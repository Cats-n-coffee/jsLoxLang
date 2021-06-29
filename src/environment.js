/*
Holds the object that contains variables and their values.
*/
const { RuntimeError } = require('./runtimeError');

const environment = {
    values: {}
};

function defineEnvironment(variable, value) {
    return environment.values[variable] = value;
}

function readEnvironment(variable) {
    if (environment.values[variable.lexeme]) {
        return environment.values[variable.lexeme]
    }

    throw new RuntimeError(variable, "Undefined variable '" + variable.lexeme + "' .")
}

module.exports = { environment, defineEnvironment, readEnvironment }