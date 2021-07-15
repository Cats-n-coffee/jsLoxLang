/*
This class to implement closures properly and take
a 'snapshot' of the function before it runs, so
variables bind to the correct environments
*/

const { RuntimeError } = require("./runtimeError");

const functionType = {
    NONE: 'NONE',
    FUNCTION: 'FUNCTION'
}

class Resolver {
    constructor(interpreter, loxInstance){
        this.interpreter = interpreter;
        this.scopes = []; // Used only for local block scopes
        this.loxInstance = loxInstance;
        this.currentFunction = functionType.NONE;
    }

    // Checks the node type and redirects to the correct method
    lookAtNodeType(expr) {
        //console.log('inside resolver lookign at types'.bgYellow, expr)
        switch(expr.type) {
            case "blockStmt": return this.getBlockStmt(expr); 
            case "varDecl": return this.getVarDecl(expr);
            case "variableExpr": return this.getVariableExpr(expr);
            case "assignExpr": return this.getAssignExpr(expr);
            case "functionDecl": return this.getFunctionDecl(expr);
            case "expressionStmt": return this.getExpressionStmt(expr);
            case "ifStmt": return this.getIfStmt(expr);
            case "printStmt": return this.getPrintStmt(expr);
            case "returnStmt": return this.getReturnStmt(expr);
            case "whileStmt": return this.getWhileStmt(expr);
            case "binaryExpr": return this.getBinaryExpr(expr);
            case "callExpr": return this.getCallExpr(expr);
            case "groupingExpr": return this.getGroupingExpr(expr);
            case "literalExpr": return this.getLiteralExpr(expr);
            case "logicalExpr": return this.getLogicalExpr(expr);
            case "unaryExpr": return this.getUnaryExpr(expr);
            default:
                throw new RuntimeError('Resolver cannot evaluate expression or statement')
        }
    }

    getPrintStmt(stmt) {
        this.resolve(stmt.expression);
        return null;
    }

    getReturnStmt(stmt) {
        if (this.currentFunction === functionType.NONE) {
            this.loxInstance.error(stmt.keyword, "Can't return from top-level code.")
        }
        if (stmt.value !== null) {
            this.resolve(stmt.value);
        }
        return null;
    }

    getBlockStmt(stmt) {
        this.beginScope();
        this.resolve(stmt.statements);
        this.endScope();

        return null;
    }

    getExpressionStmt(stmt) {
        //console.log('inside resolver at expression stmt', stmt.expression)
        this.resolve(stmt.expression);
        return null;
    }

    getFunctionDecl(stmt) {
        //console.log('inside fucntiondeclaration at resolver'.blue, stmt)
        this.declare(stmt.name);
        this.define(stmt.name);

        this.resolveFunction(stmt, functionType.FUNCTION);
        return null;
    }

    getVarDecl(stmt) {
        this.declare(stmt.name);
        if (stmt.initializer !== null) {
            this.resolve(stmt.initializer);
        }

        this.define(stmt.name);
        return null;
    }

    getIfStmt(stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.thenBranch);
        if (stmt.elseBranch !== null) {
            this.resolve(stmt.elseBranch);
        }
        return null;
    }

    getWhileStmt(stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.body);
        return null;
    }

    getVariableExpr(expr) {
        //console.log('in resolver inside variable expr first line'.bgCyan, expr, 'scopes', this.scopes)
        if ((!this.scopes.length === 0) && (this.scopes[-1][expr.name.lexeme] === false)) {
            this.loxInstance.error(expr.name, "Can't read local variable in its own initializer");
        }
        //console.log('inside resolver in getvariable expr'.bgCyan, expr, 'expr.name', expr.name)
        this.resolveLocal(expr, expr.name);
        return null;
    }

    getAssignExpr(expr) {
        //console.log('inside resolver in getassign expr'.bgCyan, expr, 'expr.name', expr.name)
        this.resolve(expr.value);
        this.resolveLocal(expr, expr.name);
        return null;
    }

    getCallExpr(expr) {
        //console.log('inside the call expr in resolver'.bgCyan, expr)
        this.resolve(expr.callee);
        for (let i = 0; i < expr.arguments.length; i += 1) {
            //console.log('inside the resolver at get call expr'.bgCyan, expr.arguments[i])
            this.resolve(expr.arguments[i]);
        }
        return null;
    }

    getBinaryExpr(expr) {
        //console.log('inside resolver at binary'.bgCyan, expr)
        this.resolve(expr.left);
        this.resolve(expr.right);
        return null;
    }

    getGroupingExpr(expr) {
        this.resolve(expr.expression);
        return null;
    }

    getLiteralExpr(expr) {
        return null;
    }

    getLogicalExpr(expr) {
        this.resolve(expr.left);
        this.resolve(expr.right);
        return null;
    }

    getUnaryExpr(expr) {
        this.resolve(expr.right);
        return null;
    }

    // ---------------------------------- Helper methods ----------------------------------
    resolve(statements) {
        //console.log('inside the resolver at resolve'.blue, 'type of', typeof statements, 'my stmt is'.blue, statements)
        let expr;
        if (statements === undefined) return;
        if (!statements.length) {
            this.lookAtNodeType(statements)
        }
        // if (statements.length < 1) --> returns false and doesn't work
        if (statements.length === undefined || statements.length === 0) { // --> this works, am I stupid?
            //console.log('inside the if stmt for length 0'.bgCyan, statements)
            this.lookAtNodeType(statements)
        }
        if (statements !== undefined) {
            for (let i = 0; i < statements.length; i += 1) {
                expr = statements[i];
                //console.log('each expr'.bgCyan,expr)
                this.lookAtNodeType(expr)
            }
        }
    }

    beginScope() {
        this.scopes.push({});
    }

    endScope() {
        this.scopes.pop();
    }

    declare(name) {
        //console.log('inside the resolver at decalre first line'.blue, name)
        //if (this.scopes.length === 0) return;
        let scope = {};
        this.scopes.push(scope);
        if (scope.hasOwnProperty(name.lexeme)) {
            this.loxInstance.error(name, "A variable with this name is already in this scope.");
        }
        scope[name.lexeme] = false;
        //console.log('in resolver inside the declare scope'.bgBlue, scope, 'all scopes',  this.scopes)
    }

    define(name) {
        //console.log('inside the resolver at define scope'.blue, this.scopes, this.scopes[this.scopes.length -1])
        if (this.scopes.length === 0) return;
        this.scopes[this.scopes.length -1][name.lexeme] = true;
        
    }

    resolveLocal(expr, name) {
        //console.log('inside the resolver at resolve local'.bgCyan, expr, 'name is '.blue, name)
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            //console.log('this is a scope'.bgGreen, this.scopes[i], 'all scopes'.bgGreen, this.scopes)
            if (this.scopes[i].hasOwnProperty(name.lexeme)) {
                //console.log('in resvolve local'.bgGreen, expr, 'scope length', this.scopes.length - 1 - i)
                this.interpreter.resolve(expr, this.scopes.length - 1 - i);
                return;
            }
        }
    }

    resolveFunction(func, type) {
        let enclosingFunction = this.currentFunction;
        this.currentFunction = type;

        this.beginScope();
        for (let i = 0; i < func.params; i += 1) {
            this.declare(func.params[i]);
            this.define(func.params[i]);
        }
        this.resolve(func.body);
        this.endScope();

        this.currentFunction = enclosingFunction;
    }
}

module.exports = { Resolver };