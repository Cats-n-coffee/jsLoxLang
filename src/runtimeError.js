/*
This class creates the runtime Errors being returned by the interpreter
*/

class RuntimeError {
    constructor(token, message){
        this.token = token;
        this.message = message;
    }
    
}

module.exports = { RuntimeError };