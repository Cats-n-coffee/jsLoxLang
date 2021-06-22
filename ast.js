/*
This file to create all the nodes from the AST
We need different functions for each type of node/expression
*/

function expression(nodeType, data) {
    switch(nodeType) {
        case "binary": binaryExpr(data); break;
        case "literal": literalExpr(data); break;
        case "unary": unaryExpr(data); break;
        case "grouping": groupingExpr(data); break;
    }
}

function binaryExpr(data) {
    console.log('im binary');

    let left = literalExpr(data.left);
    let operator = data.operator;
    let right = literalExpr(data.right);
    console.log(left, operator, right);

    const binaryObj = {
        type: "binaryExpr",
        left: {
            value: left
        },
        operator: operator,
        right: {
            value: right
        }
    }

    console.log(binaryObj)
    return left.toString() + operator + right.toString();
}

function literalExpr(data) {
    console.log('im literal')
    return data;
}

function unaryExpr(data) {
    console.log('im unary')
}

function groupingExpr(data) {
    console.log('im grouping');
    let result = binaryExpr(data);

    let groupedExpr = `(${result})`;
    console.log('grouped expr', groupedExpr)
}

expression('grouping', { left: 123, operator: '+', right: 23 })