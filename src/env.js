/*
Holds the environments that contains variables and their values.
*/
const { RuntimeError } = require('./runtimeError');

let value;

class Environment {
    constructor(parent) {
        this.parent = parent;
    }

    defineEnvironment(variable, value) {
        return this[variable] = value;
    }

    readEnvironment(variable) {
        while (this !== null || this !== undefined) {
            const getVal = this.iterateAndRead(this, variable)
            return getVal;
        }
    
        throw new RuntimeError(variable, "Undefined variable '" + variable.lexeme + "' .")
    }

    getAt(distance, name) {
        return this.ancestor(distance)[name];
    }

    ancestor(distance) {
        let environment = this;
        if (distance === 0) {
            environment = environment;
        }
        if (distance === 1) {
            environment = environment.parent;
        }
        else {
            for (let i = 1; i < distance; i += 1) { 
                if (environment.parent !== null) {
                    environment = environment.parent;
                }
                else {
                    environment = environment;
                }
            }
        }
        
        return environment;
    }

    assign(name, newValue) {
        while (this !== null || this !== undefined) {
            const changeVal = this.iterateAndAssign(this, name.lexeme, newValue)
            return changeVal;
        }
        throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "' .");
    }

    assignAt(distance, name, value) {
        return this.ancestor(distance)[name.lexeme] = value;
    }

    iterateAndRead(obj, variable) {

        Object.keys(obj).forEach(key => {
            if (obj.hasOwnProperty(variable)) {
                value = obj[variable]
                return value;
            }
            if (obj[key] === variable) {
                value = obj[variable]
                return value;
            }
            if (obj[key] === null || obj[key] === undefined) {
                value = obj[variable];
                return value;
            }
            if (obj[key].hasOwnProperty(variable)) {
                value = obj[key][variable];
                return value;
            }
            else if (typeof obj[key] === 'object') {
                this.iterateAndRead(obj[key], variable)
            }
            else {
                return;
            }
        })

        return value;
    }

    iterateAndAssign(obj, variable, newValue) {
        Object.keys(obj).forEach(key => {
            if (obj[key] === variable) {
                obj[variable] = newValue;
                return;
            }
            if (obj[key] === null || obj[key] === undefined) {
                obj[variable] = newValue;
                return;
            }
            if (obj[key].hasOwnProperty(variable)) {
                obj[key][variable] = newValue;
                return;
            }
            else if (typeof obj[key] === 'object') {
                this.iterateAndAssign(obj[key], variable, newValue)
            }
            else {
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