/* This is the scanner class
*/

class Scanner {
    constructor(source) {
        this.source = source;
    }

    scanTokens() {
        console.log('scanning tokens', this.source)
        return this.source;
    }
}

module.exports = { Scanner };