/*
This file to create all the nodes from the AST
We need different functions for each type of node/expression.
The accept function will "direct" each incoming expression to the appropriate
function by matching the type available on the incoming object.
*/
const color = require('colors');

const expression = {

    binaryExpr: function(left, operator, right) {

        const binaryObj = {
            type: "binaryExpr",
            left: left?.type === "binaryExpr" ? left : left?.left || left,
            operator: left?.type === "binaryExpr" ? operator : left?.operator || operator,
            right: left?.type === "binaryExpr" ? right : left?.right || right
        }

        console.log('in binaryExpr'.red, binaryObj)
        return binaryObj;
    },

    unaryExpr: function(operator, right) {
        console.log('in unary expression operator'.red, operator, 'right '.red, right)
        
        const unaryObj = {
            type: "unaryExpr",
            operator: operator?.operator || operator,
            right: right
        }
        console.log('in unary expression'.red, unaryObj)
        return unaryObj;
    },

    literalExpr: function(value) {
        console.log('in literal expression'.red, value)

        const literalObj = {
            type: "literalExpr",
            value: value?.value || value
        }

        return literalObj;
    },

    groupingExpr: function(group) {
        console.log('in grouping expression'.red, group)

        const groupingObj = {
            type: "groupingExpr",
            group: group
        }
        console.log('in grouping expression'.red, groupingObj);
        return groupingObj;
    }
}

const statement = {

    expressionStmt: function(expr) {
        const expressionObj = {}

        console.log('in expression statement'.red, expressionObj)
        return expressionObj;
    },

    printStmt: function(expr) {
        const printObj = {}

        console.log('in print statement'.red, printObj)
        return printObj;
    }
}

module.exports = { expression, statement }