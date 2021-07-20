/*
This class extends LoxCallable to use the methods
 */

const { Environment } = require("./env");

class LoxFunction {
    constructor(declaration, closure){
        this.declaration = declaration;
        this.closure = closure; 
    }

    arity() {
        return this.declaration.params.length;
    }

    convertToString() {
        return "<fn" + this.declaration.name.lexeme + ">";
    }

    call(interpreter, args){
        let env = new Environment(this.closure);
        for (let i = 0; i < this.declaration.params.length; i += 1) {
            env.defineEnvironment(this.declaration.params[i].lexeme, args[i]);
        }

        try {
            interpreter.executeBlock(this.declaration.body, env);
        }
        catch (returnValue) {
            return returnValue.value;
        }
        
        return null;
    }
}

module.exports = { LoxFunction }