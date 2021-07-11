/*
Class representing any Lox object that can be called,
including functions.
*/

class LoxCallable {
    constructor(callee){
        this.callee = callee;
    }

    call(obj, args) {
        console.log('inside the LoxCallable'.magenta, obj, args)
    }

    arity() {
        console.log('original arity')
    }
}
// https://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string

module.exports = { LoxCallable };