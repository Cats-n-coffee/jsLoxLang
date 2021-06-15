/*
This is the main file (entry file also) for JsLoxLang.
The main() function expects a string inside an array, 
which should be the raw input given by the user 
*/

class Lox {
    constructor(rawCode) {
        this.rawCode = rawCode;
    }
// Do extra check to ensure only a string is contained in the array?
    main() {
        if (this.rawCode.length > 1) {
            console.error('Input array is too long, exiting program')
            process.exit(0);
        }
        else if (this.rawCode.length === 1) {
            console.log('good length, let\'s read', this.rawCode);
            this.runFile(this.rawCode[0]);
        }
        else {
            console.log('let\s run a prompt with this', this.rawCode);
            this.runPrompt();
        }
    }

    static runFile(givenArg) {
        console.log('inside the runfile function', givenArg)
    }

    static runPrompt() {
        console.log('inside the runprompt function')
    }

    //Need an InputStreamReader class
    // Need an BufferReader class
}

const jsLoxInstance = new Lox(['x = x + 1']);
jsLoxInstance.main();