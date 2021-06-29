/*
This is the main file (entry file also) for JsLoxLang.
The main() function expects a string inside an array, 
which should be the raw input given by the user 
*/
const fs = require('fs');
const readline = require('readline');

const { Scanner } = require('./src/scanner');
const { Parser } = require('./src/parser');
const { Interpreter } = require('./src/interpreter');

class JsLox {
    constructor(rawCode) {
        this.rawCode = rawCode;
        this.hadError = false;
    }
// Do extra check to ensure only a string is contained in the array?
    main() {
        if (this.rawCode.length > 1) {
            console.error('Input array is too long')
            process.on('error', () => {
                console.log('Exiting process')
                process.exit(0);
            })
            process.emit('error')
        }
        else if (this.rawCode.length === 1) {
            console.log('good length, let\'s read', this.rawCode);
            this.runFile(this.rawCode[0]);
            // In the Java example Charset.defaultCharset() returns the charset for the machine (OS) running the program
        }
        else {
            console.log('let\s run a prompt with this', this.rawCode);
            this.runPrompt();
        }
    }

    runFile(givenArg) {
        console.log('inside the runfile function', givenArg)
        if (this.hadError === true) {
            process.exit(0)
        }
        const fileContents = fs.readFileSync(givenArg, 'utf-8');
        console.log('reading the file', fileContents)
        this.run(fileContents)
    }

    runPrompt() {
        console.log('inside the runprompt function');

        //let inputStr = '';
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.setPrompt("> ");
        rl.prompt()
        rl.on("line", userInput => {
            // inputStr += userInput;   // Figure out a way to save multiple values and parse them in order? add EOF after each?
            // process.stdout.write(inputStr)
            // this.run(inputStr);
            let currentInput = '';
            currentInput += userInput;
            process.stdout.write(currentInput);
            this.run(currentInput)
            this.hadError = false;
            rl.prompt();
        })
        
        rl.on("close", () => {
            console.log('exiting process')
            process.exit(0)
        })
        
    }

    run(source) {
        const scanner = new Scanner(source, this);
        const tokens = scanner.scanTokens();

        const parser = new Parser(tokens, this);
        const statements = parser.parse();
        console.log('expression parsed in JsLox', statements);

        const interpreter = new Interpreter(this);
        interpreter.interpret(statements);
    }

    error(line, message) {
        console.log('in the error method in jslox')
        return this.report(line, "", message)
    }

    report(line, where, message) {
        line = parseInt(line)
        console.error(`Line: ${line} Error: ${where}: ${message}`);
        this.hadError = true;
        return `Line: ${line} Error: ${where}: ${message}`;
    }

    parseError(token, message) {
        if (token.type === 'EOF') {
            this.report(token.line, ' at end', message)
        }
        else {
            this.report(token.line, " at '", token.lexeme, "' ", message)
        }
    }
}

const jsLoxInstance = new JsLox([]);
jsLoxInstance.main();

// https://stackoverflow.com/questions/61394928/get-user-input-through-node-js-console
// https://stackoverflow.com/questions/17837147/user-input-in-node-js
