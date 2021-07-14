/*
This class to implement closures properly and take
a 'snapshot' of the function before it runs, so
variables bind to the correct environments
*/

class Resolver {
    constructor(interpreter){
        this.interpreter = interpreter;
    }

    // Checks the node type and redirects to the correct method
    lookAtNodeType(expr) {
        switch(expr.type) {
            case "blockStmt": return this.getBlockStmt(expr); 
        }
    }

    getBlockStmt(stmt) {
        this.beginScope();
        this.resolve(stmt.statements);
        this.endScope();

        return null;
    }

    // Helper methods
    resolve(statements) {
        for (let i = 0; i < statements.length; i += 1) {
            resolveMore(statement[i]);
        }
    }
}

module.exports = { Resolver };