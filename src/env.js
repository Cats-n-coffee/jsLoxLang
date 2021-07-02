/*
Holds the object that contains variables and their values.
*/
const { RuntimeError } = require('./runtimeError');

const environment = {
    globalEnv: {},
};

function defineEnvironment(env = 'globalEnv', variable, value) {
    console.log('inside defineenvironemtn'.red, variable, 'value'.red, value)
    if (env === 'globalEnv') return environment[env][variable] = value;
    else {
        let newEnv = environment[env] = {};
        return newEnv[variable] = value; 
    }
}

function readEnvironment(env = 'globalEnv', variable) {
    console.log('inside readenvironemtn'.red, variable)
    if (environment[env][variable]) {
        return environment[env][variable]
    }

    throw new RuntimeError(variable, "Undefined variable '" + variable.lexeme + "' .")
}

function assign(env = 'globalEnv', name, value) {
    console.log('inside the env assign function, name is'.bgCyan, name, 'value is'.bgCyan, value)
    if (environment[env].hasOwnProperty(name.lexeme)) {
        environment[env][name.lexeme] = value;
        console.log('our enviuronemtn'.red, environment)
        return;
    }
    throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "' .");
}

module.exports = { environment, defineEnvironment, readEnvironment, assign }

