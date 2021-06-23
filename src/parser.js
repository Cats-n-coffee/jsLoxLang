/*
This is the parser class. It takes the tokens as input (from the scanner),
and outputs a syntax tree for the grammar rule being parsed.
*/
const { tokenType } = require('./tokenType');
const { expression } = require('./ast');
const color = require('colors');

class Parser {
    constructor(tokens){
        this.tokens = tokens;
        this.current = 0;
    }

    // This function is called inside JsLox class
    parse() {
        try {
            return this.expression()
        }
        catch (e) {
            // change for error function once made
            console.log('error in parser', e);
        }
    }

    expression() {
        console.log('inside expression method');
        return this.equality();
    }

    // Check if there is '!=' or '=='
    // The result of each method called (comparison, previous) is stored in a variable to be used
    equality() {
        var expr = this.comparison();

        while(this.match([tokenType.BANG_EQUAL, tokenType.EQUAL_EQUAL])) {
            const operator = this.previous();
            const right = this.comparison();
            console.log('inside while'.bgMagenta)
            expr = expression.binaryExpr(expr, operator, right);
            console.log('inside equality while'.bgMagenta, expr)
        }
        console.log('in parser equality'.bgMagenta, expr)
        return expr;
    }

    comparison() {
        var expr = this.term();
        console.log('inside comparison'.bgBlue, expr)
        while(this.match([tokenType.GREATER, tokenType.GREATER_EQUAL, tokenType.LESS, tokenType.LESS_EQUAL])) {
            const operator = this.previous();
            const right = this.term();

            expr = expression.binaryExpr(expr, operator, right);
        }
        return expr;
    }

    term() {
        var expr = this.factor();

        while(this.match([tokenType.MINUS, tokenType.PLUS])) {
            const operator = this.previous();
            const right = this.factor();

            expr = expression.binaryExpr(expr, operator, right);
        }
        return expr;
    }

    factor() {
        var expr = this.unary();

        while(this.match([tokenType.SLASH, tokenType.STAR])) {
            const operator = this.previous();
            const right = this.unary();

            expr = expression.binaryExpr(expr, operator, right);
        }
        return expr;
    }

    unary() {
        if (this.match([tokenType.BANG, tokenType.MINUS])) {
            const operator = this.previous();
            const right = this.unary();

            return expression.unaryExpr(operator, right);
        }
        return this.primary();
    }

    primary() {
        if (this.match([tokenType.FALSE])) return expression.literalExpr(false);
        if (this.match([tokenType.TRUE])) return expression.literalExpr(true);
        if (this.match([tokenType.NIL])) return expression.literalExpr(null);

        if (this.match([tokenType.NUMBER, tokenType.STRING])) {
            return expression.literalExpr(this.previous().literal)
        }

        if (this.match([tokenType.LEFT_PAREN])) {
            const expr = this.expression();
            this.consume(tokenType.RIGHT_PAREN, "Expect ')' after expression.")
            return expression.groupingExpr(expr);
        }
    }

    // Matches the token types, checks if they correspond to the current token type
    match([...types]) {
        console.log('match', types)
        types.forEach(type => {
            if (this.check(type)) {
                this.advance()
                console.log('inside foreach match'.bgGreen, type)
                console.log('inside match loop'.bgGreen, this.peek().type)
                return true;
            }
        })
        return false;
    }

    // Checks if the token type is of type ')'
    consume(type, message) {
        if (this.check(type)) return this.advance();
        else {
            console.log('error in consume', message)
        }
    }

    // Returns the most recently consumed token (current -1)
    previous() {
        return this.tokens[this.current - 1];
    }

    // "looks" at the current token and checks if the type matches
    check(type) {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    // Consumes the current token
    advance() {
        if (!this.isAtEnd()) { // if isAtEnd is true, we invoke this.previous
            this.current++;
        }
        return this.previous(); // The last token has EOF type, we do not need to consume it, so we go back one token
    }

    // Checks if the last token is of type EOF, in that case type of EOF should be the last token in the array
    isAtEnd() {
        return this.peek().type === tokenType.EOF;
    }

    // "looks" at the current token
    peek() {
        return this.tokens[this.current];
    }
}

module.exports = { Parser }