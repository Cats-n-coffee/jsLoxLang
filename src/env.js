/*
Holds the object that contains variables and their values.
*/
const { RuntimeError } = require('./runtimeError');

const environment = {};

function defineEnvironment(variable, value) {
    console.log('inside defineenvironemtn'.red, variable, 'value'.red, value)
    return environment[variable] = value;
}

function readEnvironment(variable) {
    console.log('inside readenvironemtn'.red, variable)
    if (environment[variable.lexeme]) {
        return environment[variable.lexeme]
    }

    throw new RuntimeError(variable, "Undefined variable '" + variable.lexeme + "' .")
}

module.exports = { environment, defineEnvironment, readEnvironment }