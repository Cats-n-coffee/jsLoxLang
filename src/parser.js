/*
This is the parser class. It takes the tokens as input (from the scanner),
and outputs a syntax tree for the grammar rule being parsed.
*/
const { tokenType } = require('./tokenType');
const { expression, statement } = require('./ast');
const color = require('colors');

class Parser {
    constructor(tokens, loxInstance){
        this.tokens = tokens;
        this.current = 0;
        this.loxInstance = loxInstance
    }

    // This function is called inside JsLox class
    parse() {
        // try {
        //     return this.expression()
        // }
        // catch (e) {
        //     // change for error function once made
        //     console.log('error in parser', e);
        // }
        const statements = [];
        if (!this.isAtEnd()) { // --------> supposed to be a while loop, but infinite loop, figure out why
            statements.push(this.declaration())
        }

        return statements;
    }

    declaration() {
        try {
            if (this.match([tokenType.VAR])) return this.varDeclaration();

            return this.statement()
        }
        catch (err) {
            // Parse Error class??
            console.log('error in parse declaration', err)
            this.synchronize();
            return null;
        }
    }

    // Looks for the PRINT token, then decides to print or move forward with "unpacking" expressions
    statement() {
        console.log('inside statement'.red, this.peek())
        if (this.match([tokenType.PRINT])) return this.printStatement();

        return this.expressionStatement();
    }

    // Parses expressions (inside statements)
    expression() {
        return this.equality();
    }
// --------------------------------- STATEMENTS ------------------------------------
    printStatement() {
        const value = this.expression();
console.log('inside printStatement'.magenta, value)
        this.consume(tokenType.SEMICOLON, "Expect ';' after value.")
        return statement.printStmt(value);
    }

    expressionStatement() {
        const expr = this.expression();
        console.log('inside expressionStatement'.magenta, expr)
        this.consume(tokenType.SEMICOLON, "Expect ';' after expression.")
        return statement.expressionStmt(expr)
    }

// ----------------------------------- EXPRESSION WORK ------------------------------------

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

    // Checks for comparison tokens
    comparison() {
        var expr = this.term();
        console.log('inside comparison'.bgMagenta, expr)
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
        console.log('finished in the term function'.black.bgYellow, expr)
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
            console.log('inside parser in primary precedence'.blue, expression.literalExpr(this.previous().literal))
            return expression.literalExpr(this.previous().literal)
        }

        if (this.match([tokenType.LEFT_PAREN])) {
            const expr = this.expression();
            this.consume(tokenType.RIGHT_PAREN, "Expect ')' after expression.")
            return expression.groupingExpr(expr);
        }
        return this.error(this.peek(), 'Expect expression.')
    }

// ------------------------------- Matches and checks tokens ---------------------------------
    // Matches the token types, checks if they correspond to the current token type
    match([...types]) {
        for (let i = 0; i < types.length; i += 1) {
            if (this.check(types[i])) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    // "looks" at the current token and checks if the type matches
    check(type) {
        if (this.isAtEnd()) return false; // If the current token is the last one (EOF) return false
        console.log('inside check method'.cyan, this.peek().type)
        return this.peek().type === type;
    }

    // Checks if the token type is of type ')'
    consume(type, message) {
        if (this.check(type)) return this.advance();
        console.log('error in consume'.bgMagenta, message)
        throw this.error(this.peek(), message);
    }

// --------------------------------- Error handling ----------------------------------
    error(token, message) {
        return this.loxInstance.parseError(token, message)
    }

    synchronize() {
        this.advance();

        while (!this.isAtEnd()) {
            if (this.previous().type === tokenType.SEMICOLON) return;

            switch (this.peek().type) {
                case tokenType.CLASS: return;
                case tokenType.FUN: return;
                case tokenType.VAR: return;
                case tokenType.FOR: return;
                case tokenType.IF: return;
                case tokenType.WHILE: return;
                case tokenType.PRINT: return;
                case tokenType.RETURN: return;
            }

            this.advance()
        }
    }
// -------------------------------- Moves the cursor ---------------------------------
    // Returns the most recently consumed token (current -1)
    previous() {
        return this.tokens[this.current - 1];
    }

    // Consumes the current token
    advance() {
        if (!this.isAtEnd()) { // if isAtEnd is true, we invoke this.previous
            console.log('in advance printing current'.magenta, this.current)
            console.log('in advance printing current type'.magenta, this.peek().type)
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