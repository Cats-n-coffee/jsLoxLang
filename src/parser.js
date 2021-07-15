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
        const statements = [];
        while (!this.isAtEnd()) { 
            statements.push(this.declaration())
        }

        return statements;
    }

    // Checks for the 'var' keyword and creates a new variable declaration if true
    declaration() {
        try {
            if (this.match([tokenType.FUN])) return this.function("function");
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

    statement() {
        console.log('inside statement'.red, this.peek())
        if (this.match([tokenType.FOR])) return this.forStatement();
        if (this.match([tokenType.IF])) return this.ifStatement();
        if (this.match([tokenType.PRINT])) return this.printStatement();
        if (this.match([tokenType.RETURN])) return this.returnStatement();
        if (this.match([tokenType.WHILE])) return this.whileStatement();
        if (this.match([tokenType.LEFT_BRACE])) return statement.blockStmt(this.block());

        return this.expressionStatement();
    }

    // Parses expressions 
    expression() {
        return this.assignment();
    }
// ------------------------------------ STATEMENTS / ASSIGNMENT ---------------------------------------
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

    // Creates a 'functionDecl' AST node.
    // 'kind' is either a function or class method
    function(kind) {
        let name = this.consume(tokenType.IDENTIFIER, "Exepect " + kind + " name.");
        this.consume(tokenType.LEFT_PAREN, "Expect '(' after " + kind + " name.");

        let parameters = [];
        if (!this.check(tokenType.RIGHT_PAREN)) {
            do {
                if (parameters.length >= 255) {
                    this.error(this.peek(), "Can't have more than 255 parameters");
                }
                parameters.push(this.consume(tokenType.IDENTIFIER, "Expect parameter name."));
            } while (this.match([tokenType.COMMA]))
        }
        this.consume(tokenType.RIGHT_PAREN, "Expect ')' after parameters");
        
        this.consume(tokenType.LEFT_BRACE, "Expect '{' before " + kind + " body.");
        let body = this.block();
        return statement.functionDecl(name, parameters, body);
    }

    returnStatement() {
        let keyword = this.previous();
        let value = null;

        if (!this.check(tokenType.SEMICOLON)) {
            value = this.expression();
        }

        this.consume(tokenType.SEMICOLON, "Expect ';' after return value.");
        return statement.returnStmt(keyword, value);
    }

    varDeclaration() {
        const name = this.consume(tokenType.IDENTIFIER, "Expect variable name.");

        let initializer = null;
        if (this.match([tokenType.EQUAL])) {
            initializer = this.expression();
        }

        this.consume(tokenType.SEMICOLON, "Expect ';' after variable declaration.");
        return statement.varDecl(name, initializer);
    }

    whileStatement() {
        this.consume(tokenType.LEFT_PAREN, "Expect '(' after 'while'.");
        const condition = this.expression();

        this.consume(tokenType.RIGHT_PAREN, "Expect ')' after condition.");
        const body = this.statement();

        return statement.whileStmt(condition, body);
    }

    assignment() {
        let expr = this.or();

        if (this.match([tokenType.EQUAL])) {
            const equals = this.previous();
            const value = this.assignment();

            if (expr.type === 'variableExpr') {
                let name = expr.name;
                console.log('inside parser at assignment'.yellow, expr, 'name is'.yellow, name)
                return expression.assignExpr(name, value)
            }
            this.error(equals, "Invalid assignment target.");
        }
        return expr;
    }

    or() {
        let expr = this.and();

        while (this.match([tokenType.OR])) {
            const operator = this.previous();
            const right = this.and();
            expr = expression.logicalExpr(expr, operator, right);
        }
        return expr;
    }

    and() {
        let expr = this.equality();

        while (this.match([tokenType.AND])) {
            const operator = this.previous();
            const right = this.equality();

            expr = expression.LogicalExpr(expr, operator, right)
        }
        return expr;
    }

    block() {
        const statements = [];

        while (!this.check(tokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            console.log('inside the while in block'.bgGreen)
            statements.push(this.declaration());
        }
     
        this.consume(tokenType.RIGHT_BRACE, "Expect '}' after block.");
        return statements;
    }

    ifStatement() {
        this.consume(tokenType.LEFT_PAREN, "Expect '(' after 'if'.");
        let condition = this.expression();
        this.consume(tokenType.RIGHT_PAREN, "Expect ')' if condition.");

        let thenBranch = this.statement();
        let elseBranch = null;
        if (this.match([tokenType.ELSE])) {
            this.statement();
        }
        return statement.ifStmt(condition, thenBranch, elseBranch)
    }

    forStatement() {
        this.consume(tokenType.LEFT_PAREN, "Expect '(' after 'for'.");
console.log('inside the for statement in parser'.bgCyan)
        // Creates the initializer
        let initializer;
        if (this.match([tokenType.SEMICOLON])) {
            initializer = null; // If there is only a semicolon declares null
        }
        else if (this.match([tokenType.VAR])) {
            initializer = this.varDeclaration(); // If there is VAR, creates a variable
        }
        else {
            initializer = this.expressionStatement(); // Else, creates an expression statement
        }

        // Checks the condition
        let condition = null;
        if (!this.check(tokenType.SEMICOLON)) {
            condition = this.expression(); // If there is no semicolon, creates an expression
        }
        this.consume(tokenType.SEMICOLON, "Expect ';' after loop condition.");

        // Checks the increment
        let increment = null;
        if (!this.check(tokenType.RIGHT_PAREN)) {
            increment = this.expression(); // If there is no ')' creates an expression
        }
        this.consume(tokenType.RIGHT_PAREN, "Expect ')' after for clauses.");
        
        // Checks the body
        let body = this.statement();
        // "Desugaring" of all the variables declared above
        // Creates the tree for the for loop
        if (increment !== null) { // If the increment is not null, the body is a block
            body = statement.blockStmt([body, statement.expressionStmt(increment)])
        }
        if (condition === null) { // If the condition is null, we create an infinite loop
            condition = expression.literalExpr(true);
        }
        body = statement.whileStmt(condition, body);
        if (initializer !== null) { // If the initializer has a value, the body will be a statement block
            body = statement.blockStmt([initializer, body]);
        }

        return body;
    }

// ----------------------------------- EXPRESSION WORK ------------------------------------

    // Check if there is '!=' or '=='
    // The result of each method called (comparison, previous) is stored in a variable to be used
    equality() {
        var expr = this.comparison();

        while(this.match([tokenType.BANG_EQUAL, tokenType.EQUAL_EQUAL])) {
            const operator = this.previous();
            const right = this.comparison();
      
            expr = expression.binaryExpr(expr, operator, right);
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
        return this.call(); // change from this.primary() before implementing functions
    }

    call() {
        let expr = this.primary();

        while (true) {
            if (this.match([tokenType.LEFT_PAREN])) {
                expr = this.finishCall(expr);
            }
            else {
                break;
            }
        }
        console.log('inside the call in parser', expr)
        return expr;
    }

    finishCall(callee) {
        const argumentsArr = [];

        if (!this.check(tokenType.RIGHT_PAREN)) {
            do {
                if (argumentsArr.length >= 255) {
                    this.error(this.peek(), "Can't have more than 255 arguments.")
                }
                argumentsArr.push(this.expression())
            } while (this.match([tokenType.COMMA]))
        }
        const paren = this.consume(tokenType.RIGHT_PAREN, "Expect ')' after arguments.");

        return expression.callExpr(callee, paren, argumentsArr);
    }

    primary() {
        if (this.match([tokenType.FALSE])) return expression.literalExpr(false);
        if (this.match([tokenType.TRUE])) return expression.literalExpr(true);
        if (this.match([tokenType.NIL])) return expression.literalExpr(null);

        if (this.match([tokenType.NUMBER, tokenType.STRING])) {
            return expression.literalExpr(this.previous().literal)
        }

        if (this.match([tokenType.IDENTIFIER])) {
            return expression.variableExpr(this.previous());
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