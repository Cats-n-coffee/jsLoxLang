/*
This class to implement closures properly and take
a 'snapshot' of the function before it runs, so
variables bind to the correct environments
*/

class Resolver {
    constructor(interpreter, loxInstance){
        this.interpreter = interpreter;
        this.scopes = []; // Used only for local block scopes
        this.loxInstance = loxInstance;
    }

    // Checks the node type and redirects to the correct method
    lookAtNodeType(expr) {
        switch(expr.type) {
            case "blockStmt": return this.getBlockStmt(expr); 
            case "varDecl": return this.getVarDecl(expr);
            case "variableExpr": return this.getVariableExpr(expr);
        }
    }

    getBlockStmt(stmt) {
        this.beginScope();
        this.resolve(stmt.statements);
        this.endScope();

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

    getVariableExpr(expr) {
        if ((!this.scopes.length === 0) && (this.scopes[-1][expr.name.lexeme] === false)) {
            this.loxInstance.error(expr.name, "Can't read local variable in its own initializer");
        }
        
        this.resolveLocal(expr, expr.name);
        return null;
    }

    // Helper methods
    resolve(statements) {
        for (let i = 0; i < statements.length; i += 1) {
            this.lookAtNodeType(statement[i]);
        }
    }

    beginScope() {
        this.scopes.push({});
    }

    endScope() {
        this.scopes.pop();
    }

    declare(name) {
        if (this.scopes.length === 0) return;
        let scope = this.scopes[-1];
        scope[name.lexeme] = false;
    }

    define(name) {
        if (this.scopes.length === 0) return;
        this.scopes[-1][name.lexeme] = true;
    }

    resolveLocal(expr, name) {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].hasOwnProperty(name.lexeme)) {
                this.interpreter.resolveAgain(expr, this.scopes.length - 1 - i);
                return;
            }
        }
    }
}

module.exports = { Resolver };