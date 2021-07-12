/*
This class extends LoxCallable to use the methods
 */

const { Environment } = require("./env");
const { LoxCallable } = require("./loxCallable");

class LoxFunction extends LoxCallable {
    constructor(declaration){
        super();
        this.declaration = declaration;
    }

    arity() {
        return this.declaration.parameters.length;
    }

    convertToString() {
        return "<fn" + this.declaration.name.lexeme + ">";
    }

    call(interpreter, args){
        let env = new Environment(interpreter.globalEnv);
        for (let i = 0; i < this.declaration.parameters.length; i += 1) {
            env.defineEnvironment(this.declaration.parameters[i].lexeme, args[i]);
        }
        interpreter.executeBlock(this.declaration.body, env);
        return null;
    }
}

module.exports = { LoxFunction }