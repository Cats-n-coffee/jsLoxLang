/*
This file holds the interpreter class. 
*/
const { expression } = require('./ast');
const color = require('colors');

class Interpreter {
    constructor() {
    }

    interpret(expr) {
        console.log('please, interpreter interpret'.bgRed, expr);
        try {
            const value = this.evaluate(expr);
            console.log('inside interpret after evaluation'.bgRed, value)
            //process.stdout.write(value)
        }
        catch (err) {
            console.log('error at runtime inside interpreter'.bgRed, err)
        }
    }

    getLiteralExpr(expr) {
        return expr.value; // ex: { type: "literalExpr", value: 1 } --> returns 1
    }

    getGroupingExpr(expr) {
        return this.evaluate(expr.expression)
    }

    getUnaryExpr(expr) {
        let right = this.evaluate(expr.right);
        console.log('inside interpreter unary right value'.blue, right, 'unary operator'.blue, expr.operator.type)

        switch(expr.operator.type) {
            case "BANG": return !this.isTruthy(right);
            case "MINUS": return -right;
        }

        return null;
    }

    getBinaryExpr(expr) {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        console.log('inside getbinary in interpreter'.blue, expr)
        switch(expr.operator.type) {
            case "MINUS": return left - right;
            case "PLUS": 
            if (left instanceof String && right instanceof String) {
                console.log('concatinating strings'.yellow)
                return left + right;
            }
            else if (left instanceof Number && right instanceof Number) {
                console.log('adding numbers'.yellow)
                return left + right;
            }; break;
            case "SLASH": return left / right;
            case "STAR": return left * right;
        }

        return null;
    }

    evaluate(expr) {
        return expression.accept(expr)
    }

    isTruthy(obj) {
        if (obj === null) return false;
        if (obj instanceof Boolean) return obj;
        return true;
    }
}

module.exports = { Interpreter }