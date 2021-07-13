/*
This file to create all the nodes from the AST
We need different functions for each type of node/expression.
The accept function will "direct" each incoming expression to the appropriate
function by matching the type available on the incoming object.
*/
const util = require('util');
const color = require('colors');

// ------------------------------- Expressions ------------------------------
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
    },

    variableExpr: function(name) {
        const variableObj = {
            type: "variableExpr",
            name: name
        }

        console.log('in variable expression'.red, variableObj)
        return variableObj;
    },

    assignExpr: function(name, value) {
        const assignObj = {
            type: "assignExpr",
            name: name,
            value: value
        }

        console.log('in assign expression'.red, assignObj)
        return assignObj;
    },

    logicalExpr: function(left, operator, right) {
        const logicalObj = {
            type: "logicalExpr",
            left: left,
            operator: operator,
            right: right
        }

        console.log('inside the logical expr', logicalObj)
        return logicalObj;
    },

    callExpr: function(callee, paren, arguments) {
        const callObj = {
            type: "callExpr",
            callee: callee,
            paren: paren,
            arguments: arguments
        }

        console.log('inside the call expression'.red, callObj)
        return callObj;
    }
}

// -------------------------------- Statements ----------------------------------
const statement = {

    expressionStmt: function(expr) {
        console.log('in expression statement this is expr'.red, expr)
        const expressionObj = {
            type: "expressionStmt",
            expression: expr
        }

        console.log('in expression statement'.red, expressionObj)
        return expressionObj;
    },

    printStmt: function(expr) {
        console.log('in print statement this is value'.red, expr)
        const printObj = {
            type: "printStmt",
            expression: expr
        }

        console.log('in print statement'.red, printObj)
        return printObj;
    },

    varDecl: function(name, initializer = null) {
        const varObj = {
            type: "varDecl",
            name: name,
            initializer: initializer
        }
        console.log('in varDecl'.red, varObj)
        return varObj;
    },

    blockStmt: function ([...statements]) {
        console.log('inside block stmt this is the array'.red, ...statements)
        const blockObj = {
            type: "blockStmt",
            statements: statements
        }

        console.log('inside block stmt'.red, util.inspect(blockObj, false, null, true))
        return blockObj;
    },

    ifStmt: function(condition, thenBranch, elseBranch) {
        const ifObj = {
            type: "ifStmt",
            condition: condition,
            thenBranch: thenBranch || null,
            elseBranch: elseBranch || null
        }

        console.log('inside if stmt'.red, util.inspect(ifObj, false, null, true))
        return ifObj;
    },

    whileStmt: function(condition, body) {
        const whileObj = {
            type: "whileStmt",
            condition: condition,
            body: body
        }

        console.log('inside while stmt'.red, util.inspect(whileObj, false, null, true))
        return whileObj;
    },

    functionDecl: function(name, params, body) {
        const functionObj = {
            type: "functionDecl",
            name: name, 
            params: params, // array
            body: body // array
        }

        console.log('inside the function decl ast'.red, functionObj)
        return functionObj;
    },

    returnStmt: function(keyword, value) {
        const returnObj = {
            type: "returnStmt",
            keyword: keyword,
            value: value
        }

        console.log('inside the return stmt ast'.red, returnObj);
        return returnObj;
    }
}

module.exports = { expression, statement }
