/*
This file holds the interpreter class. 
*/
const { expression } = require('./ast');
const color = require('colors');

class Interpreter {
    constructor() {
    }

    interpret(expr) {
        console.log('/////////////////////////////////////////////////'.bgBlue)
        console.log('please, interpreter interpret'.bgRed, expr);
        console.log('/////////////////////////////////////////////////'.bgBlue)
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
        console.log('inside getliteral in interpreter '.blue, expr.value)
        return expr.value; // ex: { type: "literalExpr", value: 1 } --> returns 1
    }

    getGroupingExpr(expr) {
        console.log('in grouping interpreter'.blue, expr.group)
        return this.evaluate(expr.group)
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
        console.log('inside getbinary in interpreter'.blue, expr, 'left value is '.blue, left, 'right value is '.blue, right)

        switch(expr.operator.type) {
            case "MINUS": return left - right;
            case "PLUS": 
            console.log('inside addition looking for my datatype'.blue, typeof left, 'right'.blue, typeof right)
            if (typeof left === 'string' && typeof right === 'string') {
                return left + right;
            }
            else if (typeof left === 'number' && typeof right === 'number') {
                return left + right;
            }; break;
            case "SLASH": {
                console.log('result from divison is'.blue, left / right)
                return left / right
            };
            case "STAR": return left * right;
            default: {

            }
        }

        return null;
    }

    evaluate(expr) {
        //return expression.accept(expr)
        switch(expr.type) {
            case "binaryExpr": return this.getBinaryExpr(expr); 
            case "literalExpr": return this.getLiteralExpr(expr);
            case "unaryExpr": return this.getUnaryExpr(expr); 
            case "groupingExpr": return this.getGroupingExpr(expr); 
        }
    }

    isTruthy(obj) {
        if (obj === null) return false;
        if (obj.constructor == Boolean) return obj;
        return true;
    }
}

module.exports = { Interpreter }