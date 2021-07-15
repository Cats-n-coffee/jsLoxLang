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
            const getVal = this.iterateAndRead(this, variable)
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

    getAt(distance, name) {
        console.log('inside environm at getAt'.bgGreen, distance, 'name', name);
        console.log('getAt second line',typeof this.ancestor(distance))
        return this.ancestor(distance)[name];
    }

    ancestor(distance) {
        console.log('in ancestor'.magenta, distance)
        let environment = this;
        for (let i = 0; i < distance; i += 1) {
            console.log('inside the ancestor method, environment.parent is'.bgBlue, environment.parent)
            environment = environment.parent;
        }
        return environment;
    }

    assign(name, newValue) {
        console.log('inside the env assign function, name is'.bgCyan, name, 'value is'.bgCyan, newValue, 'current env is ', this)
        while (this !== null || this !== undefined) {
            const changeVal = this.iterateAndAssign(this, name.lexeme, newValue)
            console.log('at assign Env'.bgMagenta, changeVal)
            return changeVal;
        }
        throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "' .");
    }

    assignAt(distance, name, value) {
        this.ancestor(distance).values[name.lexeme] = value;
    }

    iterateAndRead(obj, variable) {

        Object.keys(obj).forEach(key => {
            console.log('inside iterate and read'.bgGreen, obj[key], 'obj is ', obj)
            if (obj.hasOwnProperty(variable)) {
                console.log('inside new if stmt'.blue, obj)
                value = obj[variable]
                return value;
            }
            if (obj[key] === variable) {
                value = obj[variable]
                return value;
            }
            if (obj[key] === null || obj[key] === undefined) {
                value = obj[variable];
                console.log('one level'.bgGreen, value)
                return value;
            }
            if (obj[key].hasOwnProperty(variable)) {
                console.log('tryign to find this key'.cyan, variable)
                value = obj[key][variable];
                return value;
            }
            else if (typeof obj[key] === 'object') {
                console.log('insdie if stmt'.blue, obj[key])
                this.iterateAndRead(obj[key], variable)
            }
            else {
                console.log('cant find anything'.bgGreen)
                return;
            }
        })

        return value;
    }

    iterateAndAssign(obj, variable, newValue) {
        Object.keys(obj).forEach(key => {
            console.log('inside iterate and assign'.bgMagenta, obj[key], 'obj is ', obj, 'variable is ', variable, 'newValue is ', newValue)
            if (obj[key] === variable) {
                obj[variable] = newValue;
                return;
            }
            if (obj[key] === null || obj[key] === undefined) {
                obj[variable] = newValue;
                console.log('one level'.bgMagenta, newValue)
                return;
            }
            if (obj[key].hasOwnProperty(variable)) {
                console.log('tryign to find this key'.cyan, obj[key][variable])
                obj[key][variable] = newValue;
                return;
            }
            else if (typeof obj[key] === 'object') {
                console.log('insdie if stmt'.blue, obj[key])
                this.iterateAndAssign(obj[key], variable, newValue)
            }
            else {
                console.log('cant find anything'.bgGreen)
                return;
            }
        })

        return;
    }

    returnSelf() {
        return this;
    }
}

module.exports = { Environment }