/*
Holds the object that contains variables and their values.
*/
const { RuntimeError } = require('./runtimeError');

class Environment {
   
    constructor() {
        //this.env = null;
    }

    defineEnvironment(variable, value) {
        console.log('inside defineenvironemtn'.red, variable, 'value'.red, value, 'current is', this.env)
        //this.env = {};
        //let adding = this.env[variable] = value;
        //console.log('before return', this.env, 'value', adding)
        return this[variable] = value;
    }

    readEnvironment(variable) {
        console.log('inside readenvironemtn'.red, variable)
        console.log('current env'.yellow, this.env, 'this'.yellow, this)
        if (this[variable] !== undefined) {
            return this[variable]
        }
        if (this[variable] === undefined && this.parent) {
            console.log('cant find it')
            return this.parent;
        }
    
        throw new RuntimeError(variable, "Undefined variable '" + variable.lexeme + "' .")
    }

    assign(name, value) {
        console.log('inside the env assign function, name is'.bgCyan, name, 'value is'.bgCyan, value)
        if (this.hasOwnProperty(name.lexeme)) {
            this[name.lexeme] = value;
            console.log('our enviuronemtn'.red, this)
            return;
        }
        throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "' .");
    }

    returnSelf() {
        return this;
    }
}

class ScopeEnvironment extends Environment {
    constructor(scopeEnv) {
        super();
        this.env = {scopeEnv}
        this.parent = null;
    }

    showParent(globalEnv) {
        if (globalEnv !== null || env !== undefined) {
            this.parent = globalEnv;
        }
        return this.parent;
    }
}

// class ScopeEnvironment extends Environment {
//     constructor(scopeEnv) {
//         super(env)
//         this.scopeEnv = {scopeEnv};
//     }

//     defineEnvironment(variable, value){
//         super.defineEnvironment();
//         let adding = this.scopeEnv[variable] = value;
//         console.log('before return', this.scopeEnv, 'value', adding)
//         return this.scopeEnv[variable] = value;
//     }
    
//     readEnvironment(variable){
//         super.readEnvironment();
//         console.log('inside readenvironemtn in the scopeenv'.red, variable)
//         console.log('current env'.yellow, this.scopeEnv)
//         if (this.scopeEnv[variable]) {
//             return this.scopeEnv[variable]
//         }
    
//         throw new RuntimeError(variable, "Undefined variable '" + variable.lexeme + "' .")
//     }

//     assign(name, value) {
//         super.assign();
//         console.log('inside the env assign function, name is'.bgCyan, name, 'value is'.bgCyan, value)
//         if (this.scopeEnv.hasOwnProperty(name.lexeme)) {
//             this.scopeEnv[name.lexeme] = value;
//             console.log('our enviuronemtn'.red, this.scopeEnv)
//             return;
//         }
//         throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "' .");
//     }
// }

module.exports = { Environment, ScopeEnvironment }