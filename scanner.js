/* This is the scanner class
*/
const { tokenType } = require('./tokenType');
const { Token } = require('./token');

class Scanner {

    constructor(source, loxInstance) {
        this.source = source;
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.loxInstance = loxInstance;
    }

    scanTokens() {
        while(!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(tokenType.EOF, "", null, this.line));
        console.log('all the tokens', this.tokens)
        return this.tokens;
    }

    isAtEnd() {
        return this.current >= this.source.length;
    }

    scanToken() {
        let character = this.advance();
        console.log('in scantoken', character)
        switch(character) {
            case "(": this.addToken(tokenType.LEFT_PAREN); break;
            case ")": this.addToken(tokenType.RIGHT_PAREN); break;
            case "{": this.addToken(tokenType.LEFT_BRACE); break;
            case "}": this.addToken(tokenType.RIGHT_BRACE); break;
            case ",": this.addToken(tokenType.COMMA); break;
            case ".": this.addToken(tokenType.DOT); break;
            case "-": this.addToken(tokenType.MINUS); break;
            case "+": this.addToken(tokenType.PLUS); break;
            case ";": this.addToken(tokenType.SEMICOLON); break;
            case "*": this.addToken(tokenType.STAR); break;
            case "!": this.addToken(this.match("=") ? tokenType.BANG_EQUAL : tokenType.BANG); break;
            case "=": this.addToken(this.match("=") ? tokenType.EQUAL_EQUAL : tokenType.EQUAL); break;
            case "<": this.addToken(this.match("=") ? tokenType.LESS_EQUAL : tokenType.LESS); break;
            case ">": this.addToken(this.match("=") ? tokenType.GREATER_EQUAL : tokenType.GREATER); break;
            case "/": if (this.match("/")) {
                        while(this.peek() != "\n" && !this.isAtEnd()) {
                            this.advance();
                        }
                    }else {
                        this.addToken(tokenType.SLASH)
                    }; break;
            case " ": break;
            case "\r": break;
            case "\t": break;
            case "\n": this.line++; break;
            case '"': this.stringToken(); break; 

            default:
                if (this.isDigit(character)) {
                    this.number();
                }
                else if (this.isAlpha(character)) {
                    this.identifier();
                }
                else {
                    this.loxInstance.error(this.line, "Unexpected character.");
                }
                console.log('in default switch, there is an error', this.line);
                this.loxInstance.error(this.line, "Unexpected character.");
            break;
        }
    }

    match(expected) {
        if (this.isAtEnd()) return false;
        if (this.source.charAt(this.current) != expected) return false;

        this.current ++;
        return true; 
    }

    // Moves the cursor to the right to "look" one character ahead
    peek() {
        if (this.isAtEnd()) return "\0";
        return this.source.charAt(this.current);
    }

    // Moves the cursor to the right and consumes the character
    advance() {
        return this.source.charAt(this.current++);
    }

    addToken(type) {
        this.addTokenToArr(type, null)
    }

    // Creates a token with the information collected: token type, literal, line, lexeme
    addTokenToArr(type, literal) {
        console.log('in addtokentoarr', type, 'literal',literal)
        const text = this.source.substring(this.start, this.current);
        console.log('in addtokentoarr', text)
        this.tokens.push(new Token(type, text, literal, this.line))
    }

    // ------------------------------------ All String methods ----------------------------------

    // Analyzes tokens if they might be strings -> we need to keep the characters together until the
    // end of the string with the " .
    stringToken() {
        while(this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() === "\n") {
                this.line++;
            }
            this.advance();
        }
        if (this.isAtEnd()) {
            this.loxInstance.error(this.line, "Unexpected character.");
            return;
        }

        this.advance();

        // Removes the surrounding quotes from the string (as the user wrote the string)
        let value = this.source.substring(this.start + 1, this.current - 1)
        this.addTokenToArr(tokenType.STRING, value);
    }

    // --------------------------------------- All Number methods ------------------------------------

    isDigit(character) {
        return character >= '0' && character <= '9';
    }

    // Check if the number is an integer or a float
    number() {
        while (this.isDigit(this.peek())) {
            this.advance();
        }
        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            this.advance();

            while (this.isDigit(this.peek())) {
                this.advance();
            }
        }
        this.addTokenToArr(tokenType.NUMBER, this.makeAFloat(this.source.substring(this.start, this.current)))
    }

    // "looks" 2 characters ahead
    peekNext() {
        if (this.current + 1 >= this.source.length) {
            return "\0";
        }
        return this.source.charAt(this.current + 1);
    }

    // Creates a float with 2 digits after the floating point
    makeAFloat(num) {
        console.log('inside make a float', num)
        return parseFloat(parseFloat(num).toFixed(2))
    }

    // ---------------------------------------- All Identifiers methods ------------------------------
    identifier() {
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }

        this.addToken(tokenType.IDENTIFIER);
    }

    // Checks if the character is in the alphabet (lower or upper case) or _
    isAlpha(character) {
        return (character >= 'a' && character <= 'z') || 
               (character >= 'A' && character <= 'Z') || 
               character === '_';
    }

    isAlphaNumeric(character) {
        return this.isAlpha(character) || this.isDigit(character);
    }
}

module.exports = { Scanner };