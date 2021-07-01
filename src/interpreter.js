/*
This file holds the interpreter class. 
It evaluates statements and expressions that were built into the AST form.
*/
const util = require('util');
const { expression, statement } = require('./ast');
const { RuntimeError } = require('./runtimeError');
const {
    environment,
    defineEnvironment,
    readEnvironment,
    assign
} = require('./env');
const color = require('colors');

class Interpreter {
    constructor(loxInstance) {
        this.loxInstance = loxInstance
    }

    interpret(statements) {
        console.log('/////////////////////////////////////////////////'.bgBlue)
        console.log('please, interpreter interpret'.bgRed, util.inspect(statements, false, null, true));
        console.log('/////////////////////////////////////////////////'.bgBlue)
        if (statements === undefined) {
            console.log('error at runtime inside interpreter, statement is undefined'.bgGreen)
        };
        try {
            if (statements !== undefined) {
                //const value = this.evaluate(expr[0]);
                //console.log('inside interpret after evaluation'.bgRed, value)
                //process.stdout.write(value)
                for (let i = 0; i < statements.length; i += 1) {
                    this.evaluate(statements[i])
                }
            }
            else {
                const errorObj = new RuntimeError(statements, "Unable to read input.");
                throw errorObj;
            }
        }
        catch (err) {
            console.log('error at runtime inside interpreter'.bgRed, err)
            console.log(new RuntimeError(statements, "Unable to read input.", "2nd console.log"))
            //return new RuntimeError(expr, "Unable to read input.");
        }
    }
// ----------------------------- STATEMENTS / ASSIGNMENT EVALUATION -------------------------------
    getExpression(expr) {
        console.log('inside get epxres'.bgYellow, expr.expression)
        return this.evaluate(expr.expression);
    }

    getPrint(expr) {
        const value = this.evaluate(expr.expression);
        console.log('printing your expression!'.bgYellow, value);
        console.log('inside interpreter environment'.yellow, environment)
        process.stdout.write(this.stringify(value))
        return null;
    }

    getVarStmt(stmt) {
        let value = null;
        if (stmt.initializer != null) {
            value = this.evaluate(stmt.initializer);
        }

        defineEnvironment(stmt.name.lexeme, value);
        return null;
    }

    getAssignExpr(expr) {
        const value = this.evaluate(expr.value);
        assign(expr.name, value);
        return value;
    }

    getBlockStmt(stmt) {
        console.log('inside interpreter looking at statement', stmt)
        let key = stmt.statements[0].name.lexeme;
        let value = stmt.statements[0].initializer.value;
        let obj = {};
        obj[key] = value;
        const localEnv = defineEnvironment('0000', obj)
        this.executeBlock(stmt.statements, localEnv);
        return null
    }

// ------------------------------ EXPRESSION EVALUATION ----------------------------------
    // Returns the value
    getLiteralExpr(expr) {
        console.log('inside getliteral in interpreter '.blue, expr.value)
        return expr.value; // ex: { type: "literalExpr", value: 1 } --> returns 1
    }

    // "steps" inside the parentheses and calls evaluate() to "unpack" the inside expression
    getGroupingExpr(expr) {
        console.log('in grouping interpreter'.blue, expr.group)
        return this.evaluate(expr.group)
    }

    // Calls evaluate() on the right side of the expression to be further evaluated, then performs the operation inside the switch
    getUnaryExpr(expr) {
        let right = this.evaluate(expr.right);
        console.log('inside interpreter unary right value'.blue, right, 'unary operator'.blue, expr.operator.type)

        switch(expr.operator.type) {
            case "BANG": return !this.isTruthy(right);
            case "MINUS": return -right;
        }

        return null;
    }

    getVariableExpr(expr) {
        return readEnvironment(expr.name)
    }

    // Calls evaluate() on the left and right sides of the expression, then performs the appropriate operation inside the swicth
    getBinaryExpr(expr) {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        console.log('inside getbinary in interpreter'.blue, expr, 'left value is '.blue, left, 'right value is '.blue, right)

        switch(expr.operator.type) {
            case "GREATER": {
                this.checkNumberOperands(left, expr.operator, right);
                return left > right;
            };
            case "GREATER_EQUAL": {
                this.checkNumberOperands(left, expr.operator, right);
                return left >= right;
            };
            case "LESS": {
                this.checkNumberOperands(left, expr.operator, right);
                return left < right;
            };
            case "LESS_EQUAL": {
                this.checkNumberOperands(left, expr.operator, right);
                return left <= right;
            };
            case "BANG_EQUAL": return !this.isEqual(left, right);
            case "EQUAL_EQUAL": return this.isEqual(left, right);
            case "MINUS": {
                this.checkNumberOperands(left, expr.operator, right);
                return left - right
            };
            case "PLUS": { 
                console.log('inside addition looking for my datatype'.blue, typeof left, 'right'.blue, typeof right)
                if (typeof left === 'string' && typeof right === 'string') {
                    return left + right;
                }
                else if (typeof left === 'number' && typeof right === 'number') {
                    return left + right;
                }
                else {
                    return new RuntimeError(expr.operator, "Operands must be two strings or two numbers")
                }; 
            };
            case "SLASH": {
                this.checkNumberOperands(left, expr.operator, right);
                console.log('result from divison is'.blue, left / right)
                return left / right
            };
            case "STAR": {
                this.checkNumberOperands(left, expr.operator, right);
                return left * right
            };
            default: {
                return new RuntimeError(expr.operator, "Unable to perform the operation with this operator.")
            }
        }
    }

// ----------------------------------- EVALUATE / EXECUTE --------------------------------------
    // Directs to the appropriate method to perform the operation. It matches the 'type' given when building the AST
    evaluate(expr) {
        switch(expr.type) {
            case "binaryExpr": return this.getBinaryExpr(expr); 
            case "literalExpr": return this.getLiteralExpr(expr);
            case "unaryExpr": return this.getUnaryExpr(expr); 
            case "groupingExpr": return this.getGroupingExpr(expr); 
            case "expressionStmt": return this.getExpression(expr);
            case "printStmt": return this.getPrint(expr);
            case "varDecl": return this.getVarStmt(expr);
            case "variableExpr": return this.getVariableExpr(expr);
            case "assignExpr": return this.getAssignExpr(expr);
            case "blockStmt": return this.getBlockStmt(expr);
        }
    }

    executeBlock(statements, env) {
        let previous = this.env;
console.log('inside executeBlock in interpreter'.magenta, this.env, 'env is', env, 'statms', statements)
        try {
            this.env = env;
            for (let i = 0; i < statements.length; i += 1){
                console.log('each stmt', statements[i])
                this.evaluate(statements[i])
            }
        }
        finally {
            this.env = previous;
        }
    }

// ---------------------------------- HELPERS ----------------------------------------
    isTruthy(obj) {
        if (obj === null) return false;
        if (obj.constructor == Boolean) return obj;
        return true;
    }

    isEqual(item1, item2) {
        if (item1 === null && item2 === null) return true;
        if (item1 === null) return false;
        
        return item1 == item2;
    }

    stringify(obj) {
        if (obj === null) return "nil";
        if (typeof obj === 'number') {
            let text = JSON.stringify(obj);
            if (text.endsWith('.0')) {
                text = text.substring(0, text.length - 2);
            }
            return text;
        }

        return JSON.stringify(obj);
    }

// ----------------------------------- ERROR HANDLING ------------------------------------
    // Returns an error if operand is not a number
    checkNumberUnaryOperand(operator, operand) {
        if (typeof operand === 'number') return;
        return new RuntimeError(operator, "Operand must be a number.");
    }

    // Returns an error if both operands are not numbers
    checkNumberOperands(left, operator, right) {
        if (typeof left === 'number' && typeof right === 'number') return;
        return new RuntimeError(operator, "Operands must be numbers.")
    }
}

module.exports = { Interpreter }