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
        
    }
}

module.exports = { LoxCallable };