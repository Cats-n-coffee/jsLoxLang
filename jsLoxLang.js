/*
This is the main file (entry file also) for JsLoxLang.
The main() function expects a string inside an array, 
which should be the raw input given by the user 
*/
const fs = require('fs');
const readline = require('readline');

class JsLox {
    constructor(rawCode) {
        this.rawCode = rawCode;
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
        const fileContents = fs.readFileSync(givenArg, 'utf-8');
        console.log('reading the file', fileContents)
    }

    runPrompt() {
        console.log('inside the runprompt function');

        let inputStr = '';
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.setPrompt("> ");
        rl.prompt()
        rl.on("line", userInput => {
            inputStr += userInput;
            process.stdout.write(inputStr)
        })
        
        rl.on("close", () => {
            console.log('\n that string is', inputStr)
            console.log('exiting process')
            process.exit(0)
        })
        
    }
}

const jsLoxInstance = new JsLox([]);
jsLoxInstance.main();

// https://stackoverflow.com/questions/61394928/get-user-input-through-node-js-console
// https://stackoverflow.com/questions/17837147/user-input-in-node-js