/*
This file to create all the nodes from the AST
We need different functions for each type of node/expression.
The accept function will "direct" each incoming expression to the appropriate
function by matching the type available on the incoming object.
*/
const color = require('colors');

const expression = {
    accept: function(expr){
        console.log('accept function received'.red, expr)
        switch(expr.type) {
            case "binaryExpr": this.binaryExpr(expr); break;
            case "literalExpr": this.literalExpr(expr); break;
            case "unaryExpr": this.unaryExpr(expr); break;
            case "groupingExpr": this.groupingExpr(expr); break;
        }
    },

    binaryExpr: function(left, operator, right) {
        console.log('left is', left?.left)

        const binaryObj = {
            type: "binaryExpr",
            left: left?.left || left,
            operator: left?.operator || operator,
            right: left?.right || right
        }

        console.log('in binaryExpr', binaryObj)
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

module.exports = { expression }
