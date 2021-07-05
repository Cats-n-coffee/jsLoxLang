/*
Holds the object that contains variables and their values.
*/
const { RuntimeError } = require('./runtimeError');

let value;

class Environment {
    constructor(parent) {
        this.parent = parent;
    }

    defineEnvironment(variable, value) {
        console.log('inside defineenvironemtn'.red, variable, 'value'.red, value, 'current is', this)
        return this[variable] = value;
    }

    readEnvironment(variable) {
        console.log('inside readenvironemtn'.red, variable)
        console.log('current env'.yellow, 'this'.yellow, this)

        while (this !== null || this !== undefined) {
            const getVal = this.iterate(this, variable)
            console.log('at readEnv'.bgGreen, getVal)
            return getVal;
        }

        // if (this[variable] !== undefined) {
        //     return this[variable]
        // }
        //let env = this.parent; // either null or aother env
        //while (env !== null) {
            // console.log('checking env'.bgMagenta, env, 'env varaible', env.parent[variable], 'this variable', env[variable])
            
            // if (env.parent[variable] !== undefined) {
            //     console.log('found variable'.red, env[variable])
            //     return env.parent[variable];
            // }
            // env = this.parent;
            // console.log('checking env second'.bgMagenta, env)
       //} 
        // if (this[variable] === undefined && this.parent) {
        //     console.log('cant find it')
        //     return this.parent;
        // }
    
        throw new RuntimeError(variable, "Undefined variable '" + variable.lexeme + "' .")
    }

    assign(name, value) {
        console.log('inside the env assign function, name is'.bgCyan, name, 'value is'.bgCyan, value, 'current env is ', this)
        if (this.hasOwnProperty(name.lexeme)) {
            this[name.lexeme] = value;
            console.log('our enviuronemtn'.red, this)
            return;
        }
        else {
            const scope = this.iterate(this, name.lexeme)
            console.log(scope)
            this[name.lexeme] = scope;
        }
        throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "' .");
    }

    iterate(obj, variable) {

        Object.keys(obj).forEach(key => {
            console.log('inside iterate'.bgGreen, obj[key], 'obj is ', obj)
            if (obj[key] === null || obj[key] === undefined) {
                value = obj[variable];
                console.log('one level'.bgGreen, value)
                return value;
            }
            if (obj[key].hasOwnProperty(variable)) {
                console.log('tryign to find this key'.cyan, obj[key][variable])
                value = obj[key][variable];
                return value;
            }
            else if (typeof obj[key] === 'object') {
                console.log('insdie if stmt'.blue, obj[key])
                this.iterate(obj[key], variable)
            }
            else {
                console.log('cant find anything'.bgGreen)
                return;
            }
        })

        return value;
    }

    returnSelf() {
        return this;
    }
}

module.exports = { Environment }