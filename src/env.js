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

function assign(name, value) {
    console.log('inside the env assign function, name is'.bgCyan, name, 'value is'.bgCyan, value)
    if (environment.hasOwnProperty(name.lexeme)) {
        environment[name.lexeme] = value;
        console.log('our enviuronemtn'.red, environment)
        return;
    }
    throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "' .");
}

module.exports = { environment, defineEnvironment, readEnvironment, assign }