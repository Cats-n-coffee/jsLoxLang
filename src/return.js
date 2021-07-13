/*
Class for the return statement
 */

class Return extends Error {
    constructor(value) {
        super();
        this.value = value;
    }
}

module.exports = { Return };