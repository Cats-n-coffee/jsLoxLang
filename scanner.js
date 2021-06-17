/* This is the scanner class
*/
const { tokenType } = require('./tokenType');
const { Token } = require('./token');
const { JsLox } = require('./jsLoxLang');

class Scanner {

    constructor(source) {
        this.source = source;
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
    }

    scanTokens() {
        while(!this.isAtEnd()) {
            this.start = this.current;
            //this.current ++;
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
            case "(": this.addToken(LEFT_PAREN); break;
            case ")": this.addToken(RIGHT_PAREN); break;
            case "{": this.addToken(LEFT_BRACE); break;
            case "}": this.addToken(RIGHT_BRACE); break;
            case ",": this.addToken(COMMA); break;
            case ".": this.addToken(DOT); break;
            case "-": this.addToken(MINUS); break;
            case "+": this.addToken(PLUS); break;
            case ";": this.addToken(SEMICOLON); break;
            case "*": this.addToken(STAR); break;
            case "!": this.addToken(this.match("=") ? BANG_EQUAL : BANG); break;
            case "=": this.addToken(this.match("=") ? EQUAL_EQUAL : EQUAL); break;
            case "<": this.addToken(this.match("=") ? LESS_EQUAL : LESS); break;
            case ">": this.addToken(this.match("=") ? GREATER_EQUAL : GREATER); break;
            case "/": if (this.match("/")) {
                        while(this.peek() != "\n" && !this.isAtEnd()) {
                            this.advance();
                        }
                    }else {
                        this.addToken(SLASH)
                    }; break;

            // See later if the implementation of error works using static keyword
            default:
                JsLox.error(this.line, "Unexpected character.");
            break;
        }
    }

    match(expected) {
        if (this.isAtEnd()) return false;
        if (this.source.charAt(this.current) != expected) return false;

        this.current ++;
        return true; 
    }

    peek() {
        if (this.isAtEnd()) return "\0";
        return this.source.charAt(this.current);
    }

    advance() {
        return this.source.charAt(this.current++);
    }

    addToken(type) {
        this.addTokenToArr(type, null)
    }

    addTokenToArr(type, literal) {
        const text = this.source.substring(this.start, this.current);
        console.log('in addtokentoarr', text)
        this.tokens.push(new Token(type, text, literal, this.line))
    }
}

module.exports = { Scanner };