/*
Holds the object that contains variables and their values.
*/
const { RuntimeError } = require('./runtimeError');

class Environment {
    constructor() {
        this.env = { env: 'global' };
    }

    defineEnvironment(variable, value) {
        console.log('inside defineenvironemtn'.red, variable, 'value'.red, value)
        let adding = this.env[variable] = value;
        console.log('before return', this.env, 'value', adding)
        return this.env[variable] = value;
    }

    readEnvironment(variable) {
        console.log('inside readenvironemtn'.red, variable)
        console.log('current env'.yellow, this.env)
        if (this.env[variable]) {
            return this.env[variable]
        }
    
        throw new RuntimeError(variable, "Undefined variable '" + variable.lexeme + "' .")
    }

    assign(name, value) {
        console.log('inside the env assign function, name is'.bgCyan, name, 'value is'.bgCyan, value)
        if (this.env.hasOwnProperty(name.lexeme)) {
            this.env[name.lexeme] = value;
            console.log('our enviuronemtn'.red, this.env)
            return;
        }
        throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "' .");
    }

    returnSelf() {
        return this.env;
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




// const environment = {
//     globalEnv: {},
// };

// function defineEnvironment(env = 'globalEnv', variable, value) {
//     console.log('inside defineenvironemtn'.red, variable, 'value'.red, value)
//     if (env === 'globalEnv') return environment[env][variable] = value;
//     else {
//         let newEnv = environment[env] = {};
//         return newEnv[variable] = value; 
//     }
// }

// function readEnvironment(env = 'globalEnv', variable) {
//     console.log('inside readenvironemtn'.red, variable)
//     if (environment[env][variable]) {
//         return environment[env][variable]
//     }

//     throw new RuntimeError(variable, "Undefined variable '" + variable.lexeme + "' .")
// }

// function assign(env = 'globalEnv', name, value) {
//     console.log('inside the env assign function, name is'.bgCyan, name, 'value is'.bgCyan, value)
//     if (environment[env].hasOwnProperty(name.lexeme)) {
//         environment[env][name.lexeme] = value;
//         console.log('our enviuronemtn'.red, environment)
//         return;
//     }
//     throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "' .");
// }

//module.exports = { environment, defineEnvironment, readEnvironment, assign }

