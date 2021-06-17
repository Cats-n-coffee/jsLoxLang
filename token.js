/*
This class create the tokens/lexemes
*/
//const { tokenType } = require('./tokenType');

class Token {
    constructor(type, lexeme, literal, line) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    convertToString() {
        return this.type + " " + this.lexeme + " " + this.literal;
    }
}

module.exports = { Token }