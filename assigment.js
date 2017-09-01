let fs = require('fs');
let esprima = require('esprima');
let estraverse = require('estraverse');

let filename = process.argv[2];
console.log('Processing', filename);
let ast = esprima.parse(fs.readFileSync(filename));
estraverse.traverse(ast, {
    enter: function(node){
        if (node.type === 'AssignmentExpression'){
            console.log('Encountered assignment to', node.left.name);
        }
    }
});