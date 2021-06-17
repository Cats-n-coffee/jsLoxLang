function test2Function() {
    const a = 'im a variable';

    const aExpr = (name) => {
        console.log('im a aExpr', name)
    }

    return {
        aExpr
    }
}

module.exports = { test2Function }