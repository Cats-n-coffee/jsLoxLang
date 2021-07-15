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

        return binaryObj;
    },

    unaryExpr: function(operator, right) {  
        const unaryObj = {
            type: "unaryExpr",
            operator: operator?.operator || operator,
            right: right
        }
   
        return unaryObj;
    },

    literalExpr: function(value) {
        const literalObj = {
            type: "literalExpr",
            value: value?.value || value
        }

        return literalObj;
    },

    groupingExpr: function(group) {
        const groupingObj = {
            type: "groupingExpr",
            group: group
        }

        return groupingObj;
    },

    variableExpr: function(name) {
        const variableObj = {
            type: "variableExpr",
            name: name
        }

        return variableObj;
    },

    assignExpr: function(name, value) {
        const assignObj = {
            type: "assignExpr",
            name: name,
            value: value
        }

        return assignObj;
    },

    logicalExpr: function(left, operator, right) {
        const logicalObj = {
            type: "logicalExpr",
            left: left,
            operator: operator,
            right: right
        }

        return logicalObj;
    },

    callExpr: function(callee, paren, arguments) {
        const callObj = {
            type: "callExpr",
            callee: callee,
            paren: paren,
            arguments: arguments
        }

        return callObj;
    }
}

// -------------------------------- Statements ----------------------------------
const statement = {

    expressionStmt: function(expr) {
        const expressionObj = {
            type: "expressionStmt",
            expression: expr
        }

        return expressionObj;
    },

    printStmt: function(expr) {
        const printObj = {
            type: "printStmt",
            expression: expr
        }

        return printObj;
    },

    varDecl: function(name, initializer = null) {
        const varObj = {
            type: "varDecl",
            name: name,
            initializer: initializer
        }

        return varObj;
    },

    blockStmt: function ([...statements]) {
        const blockObj = {
            type: "blockStmt",
            statements: statements
        }

        return blockObj;
    },

    ifStmt: function(condition, thenBranch, elseBranch) {
        const ifObj = {
            type: "ifStmt",
            condition: condition,
            thenBranch: thenBranch || null,
            elseBranch: elseBranch || null
        }

        return ifObj;
    },

    whileStmt: function(condition, body) {
        const whileObj = {
            type: "whileStmt",
            condition: condition,
            body: body
        }

        return whileObj;
    },

    functionDecl: function(name, params, body) {
        const functionObj = {
            type: "functionDecl",
            name: name, 
            params: params, // array
            body: body // array
        }

        return functionObj;
    },

    returnStmt: function(keyword, value) {
        const returnObj = {
            type: "returnStmt",
            keyword: keyword,
            value: value
        }

        return returnObj;
    }
}

module.exports = { expression, statement }
