const { test2Function } = require('./test2');

function mainFunction() {
    const testVar = "im a variable, hello hi";
    const aName = 'chris';

    const returnName = () => aName;

    const testExpr = () => {
        console.log('im a test function expression')
    }

    function testDecl() {
        console.log('im a test function declaration')
    }

    function compare() {
        console.log('2' > '3');
    }

    return {
        testDecl, testExpr, returnName, aName, compare
    }
}

mainFunction().testDecl();
mainFunction().testExpr();
test2Function().aExpr(mainFunction().aName);
mainFunction().compare();