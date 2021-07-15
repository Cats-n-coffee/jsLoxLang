/*
This file holds the interpreter class. 
It evaluates statements and expressions that were built into the AST form.
*/
const util = require('util');
const { RuntimeError } = require('./runtimeError');
const { Environment } = require('./env');
const color = require('colors');
const { tokenType } = require('./tokenType');
const { LoxFunction } = require('./loxFunction');
const { Return } = require('./return');

// This is the global scope/environment
const globalEnv = new Environment(null);
// We create a native function that overrides LoxCallable methods
// globalCallable = new LoxCallable(null);
// globalCallable.arity = function() {
//     return 0;
// }
// globalCallable.call = function(interpreter, newArguments) {
//     return Date.now();
// };
// globalCallable.convertToString = function() {
//     return "<native fn>";
// }
// globalEnv.defineEnvironment("clock", globalCallable);

// Class interpreter starts here
class Interpreter {
    constructor(loxInstance) {
        this.loxInstance = loxInstance,
        this.env = globalEnv;
        this.scopeEnv = null;
        this.globalEnv = globalEnv;
        this.locals = new Map();
    }

    interpret(statements) {
        console.log('/////////////////////////////////////////////////'.bgBlue)
        console.log('please, interpreter interpret'.bgRed, util.inspect(statements, false, null, true));
        console.log('/////////////////////////////////////////////////'.bgBlue)
        // if (statements === undefined) {
        //     console.log('error at runtime inside interpreter, statement is undefined'.bgGreen)
        // };
        try {
            if (statements !== undefined) {
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
            console.log(new RuntimeError(statements, "Unable to read input.", "In interpret, statements might be undefined"))
            //return new RuntimeError(expr, "Unable to read input.");
        }
    }
// ----------------------------- STATEMENTS / ASSIGNMENT EVALUATION -------------------------------
    getExpression(expr) {
        console.log('inside get epxres'.bgYellow, expr.expression)
        return this.evaluate(expr.expression);
    }

    getPrint(expr) {
        console.log('inside print'.bgYellow, expr)
        const value = this.evaluate(expr.expression);
        console.log('printing your expression!'.bgYellow, value);
        //process.stdout.write(this.stringify(value))
        return null;
    }

    getReturnStmt(stmt) {
        let value = null;
        if (stmt.value !== null) {
            value = this.evaluate(stmt.value);
        }

        throw new Return(value);
    }

    getVarStmt(stmt) {
        let value = null;
        if (stmt.initializer != null) {
            value = this.evaluate(stmt.initializer);
        }
        
        this.env.defineEnvironment(stmt.name.lexeme, value)
        console.log('inside the varstmt checking the env'.yellow, this.env, 'fron outisde', globalEnv)
        return null;
    }

    getAssignExpr(expr) {
        const value = this.evaluate(expr.value);
        //this.env.assign(expr.name, value);
        let distance  = this.locals.get(expr);
        if (distance !== null) {
            this.env.assignAt(distance, expr.name, value);
        } else {
            this.globalEnv.assign(expr.name, value);
        }
        return value;
    } 

    getBlockStmt(stmt) {
        console.log('inside interpreter looking at statement', stmt)
        const newBlock = new Environment(this.env)
        this.executeBlock(stmt.statements, newBlock);
        return null
    }

    getIfStmt(stmt) {
        console.log('inside interpreter at if stmt', stmt)
        if (this.isTruthy(this.evaluate(stmt.condition))) {
            this.evaluate(stmt.thenBranch);
        } 
        else if (stmt.elseBranch !== null) {
            this.evaluate(stmt.elseBranch);
        }
        return null;
    }

    getLogicalExpr(expr) {
        let left = this.evaluate(expr.left);

        if (expr.operator.type === tokenType.OR) {
            if (this.isTruthy(left)) return left;
        }
        else {
            if (!this.isTruthy(left)) return left;
        }

        return this.evaluate(expr.right);
    }

    getWhileStmt(stmt) {
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.evaluate(stmt.body);
        }
        return null;
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

    getVariableExpr(expr){
        console.log('inside variable expression'.bgCyan, expr)
        //return this.env.readEnvironment(expr.name.lexeme)
        return this.lookUpVariable(expr.name, expr);
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
                console.log('doing the math'.bgBlue, left-right)
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

    getCallExpr(expr) {
        const callee = this.evaluate(expr.callee); // Evaluates the callee from the AST
console.log('this the callee at getcallexpr'.bgMagenta, callee, 'expr.callee'.bgMagenta, expr.callee)
        const argumentsArr = []; // Stores the results of the evaluated arguments
        for (let i = 0; i < expr.arguments.length; i += 1) {
            let argument = expr.arguments[i];
            argumentsArr.push(this.evaluate(argument)) // Evaluates each argument from the AST and pushes to a new arr
        }

        if (!(callee instanceof LoxFunction)) {
            throw new RuntimeError(expr.paren, "Can only call functions and classes.")
        }

        //let newFunction = new LoxFunction(callee);
        console.log('newFunction arity is '.bgYellow, callee)
        if (argumentsArr.length !== callee.arity()) {  // arity() should check for length of arguments
            throw new RuntimeError(expr.paren, "Expected " + callee.arity() + " arguments, but got ", argumentsArr.length + ".")
        }
        
        return callee.call(this, argumentsArr); // 'callee' eventually becomes an instance of LoxFunction?
    }

    getFunctionDecl(stmt) {
        console.log('inside getFunctionDecl'.bgMagenta, util.inspect(stmt, false, null, true))
        const func = new LoxFunction(stmt, this.env);

        this.env.defineEnvironment(stmt.name.lexeme, func);
        return null;
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
            case "ifStmt": return this.getIfStmt(expr);
            case "logicalExpr": return this.getLogicalExpr(expr);
            case "whileStmt": return this.getWhileStmt(expr);
            case "callExpr": return this.getCallExpr(expr);
            case "functionDecl": return this.getFunctionDecl(expr);
            case "returnStmt": return this.getReturnStmt(expr);
            default:
                throw new RuntimeError(expr, "Cannot evaluate expression or statement.")
        }
    }

    resolve(expr, depth) {
        console.log('inside interpreter at resolve'.bgGreen, expr, 'depth is', depth)
        this.locals.set(expr, depth);
    }

    executeBlock(statements, scopeEnv) {
        let previous = this.env;
        
        try {
            this.env = scopeEnv;
            for (let i = 0; i < statements.length; i += 1){
                console.log('each stmt'.bgMagenta, statements[i])

                this.evaluate(statements[i])
            }
            console.log('environemtn is currently '.yellow, this.env, 'global is ', globalEnv)
        }
        finally {
            this.env = previous;
            console.log('inside finally in executeBlock newnev is', previous)
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

    lookUpVariable(name, expr) {
        console.log('inside interpreter looktup var'.bgGreen, name, 'expr', expr, 'locals are '.bgGreen, this.locals)
        let distance = this.locals.get(expr);
        if (distance !== null || distance !== undefined) {
            return this.env.getAt(distance, name.lexeme);
        } else {
            return this.globalEnv[name];
        }
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

// var a =1; {a =5; print a;}
// var a = 1; while(a < 5) {a = a + 1; print "hi";}
// var a =1; {var b =5; {print a;}}
// var a = 1; {var b = 5; {var c = 8;{print a;}}}
// var a = 0; var temp = 0; for (var i = 1; a < 5; i = temp + i){print a; temp = a; a = i;}
// var a = 1; a = a + 1; a = a + 1; print a;
// var a = 1; for (var i = 1;a < 5; i = i + 1){ print i; print a;}
// for (var i = 0; i < 5;i = i + 1)print i;

// fun hi(first){print "Hi" + first;} hi("pretty");
// --> infinite loop:  fun fib(n){if (n <= 1) return n; return fib(n - 2) + fib(n - 1);} for (var i =0; i < 20; i = i + 1){print fib(i);}
// fun fib(n){if (n <= 1) return n; return fib(n - 2) + fib(n - 1);} fib(10);
// fun makeCounter(){var i = 0; fun count(){ i = i + 1; print i;} return count;} var counter = makeCounter(); counter(); counter();

// var a ="global"; fun showA(){print a;} showA(); var a = "block"; showA();