const fs = require('fs');
const esprima = require('esprima');
const estraverse = require('estraverse');

var filename = process.argv[2];
console.log('Processing', filename);
var ast = esprima.parse(fs.readFileSync(filename));
estraverse.traverse(ast, {
    enter: function(node){
        if (node.type === 'AssignmentExpression'){
            console.log('Encountered assignment to', node.left.name);
        }
    }
});
const espree = require('espree');
var source = 'answer = 42; hola = 5; isCold = "Si"; answer = 50;';
const tokens = esprima.tokenize(source);

var identificadores = tokens.filter(function (el) {
    return (el.type === "Identifier");
});

var listIdentifiers = [];
identificadores.forEach(function (element) {
    var indice = arrayObjectIndexOf(listIdentifiers,element.value, "id");
    if(indice == -1){ // No encontró el identificador, lo agrega.
        var list = [element.value, 1];
        listIdentifiers.push.apply(listIdentifiers, list);
    } else { // Encontró el identificador, suma uno.
        listIdentifiers[indice].size++;
    }
});

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function Identifier(id, quantity) {
    this.id = id;
    this.quantity = quantity;
}

function Item (id, size){
    this.id = id;
    this.size = size;
}

var source2 = "var a = 1, b = 2; function f(){ var c; (function g(){ var d = 'yo'; }()); }";
var ast2 = esprima.parse(source2);
//console.log(ast2);
var scopeChain = [];
var assignments = [];
var source3 = 'd3';
var ast3 = espree.parse(source3,{ sourceType: "module"});
// var ast3 = esprima.parse(source3);
console.log(ast3)
estraverse.traverse(ast2, {
    enter: enter,
    leave: leave
});

function enter(node){
    if (createsNewScope(node)){
        scopeChain.push([]);
    }
    if (node.type === 'VariableDeclarator'){
        var currentScope = scopeChain[scopeChain.length - 1];
        currentScope.push(node.id.name);
    }
    if (node.type === 'AssignmentExpression'){
        assignments.push(node.left.name);
    }
}

function leave(node){
    if (createsNewScope(node)){
        checkForLeaks(assignments, scopeChain);
        scopeChain.pop();
        assignments = [];
    }
}

function isVarDefined(varname, scopeChain){
    for (var i = 0; i < scopeChain.length; i++){
        var scope = scopeChain[i];
        if (scope.indexOf(varname) !== -1){
            return true;
        }
    }
    return false;
}

function checkForLeaks(assignments, scopeChain){
    for (var i = 0; i < assignments.length; i++){
        if (!isVarDefined(assignments[i], scopeChain)){
            console.log('Detected leaked global variable:', assignments[i]);
        }
    }
}

function createsNewScope(node){
    return node.type === 'FunctionDeclaration' ||
        node.type === 'FunctionExpression' ||
        node.type === 'Program';
}