var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');

var filename = process.argv[2];
console.log('Processing', filename);
try {
  var data = fs.readFileSync(filename, 'utf8');
  console.log('sync readFile');
}
catch (e) {
  console.log(e);
}
var ast = esprima.parse(data, {loc: true, comment: true});
var scopeChain = [];
var assignments = [];
var requiresModules = [];
var variablesTotal = [];
var functionList = [];

estraverse.traverse(ast, {
    enter: enter,
    leave: leave
});

function processRequires(node) {
    if (node.init != null&& node.init.type != null && node.init.type === 'CallExpression' && node.init.callee.name === 'require') {
        requiresModules.push(node.id.name);
    }
}

function enter(node){
    if (createsNewScope(node)){
        scopeChain.push([]);
    }
   // console.log(node);
    if (node.type === 'VariableDeclarator'){
        var currentScope = scopeChain[scopeChain.length - 1];
        currentScope.push(node.id.name);
        variablesTotal.push(node.id.name);
        var locals = [];
        var globals = [];
        var externals = [];
        functionList.push([node.id.name,locals,globals,externals]);
        processRequires(node);
    }
    if (node.type === 'AssignmentExpression'){
        assignments.push(node);
      processRequires(node);
    }
}

function leave(node){
    if (createsNewScope(node)){
        checkForLeaks(assignments, scopeChain, functionList);
        var currentScope = scopeChain.pop();
        printScope(currentScope, node);
      //  console.log(assignments);
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

function checkForLeaks(assignments, scopeChain, functionList){
    for (var i = 0; i < assignments.length; i++){
        var assignment = assignments[i];
        var varname = assignment.left.name;
        if (!isVarDefined(varname, scopeChain)){
            console.log('Leaked global', varname, 'on line', assignment.loc.start.line);
            updateGlobal(varname, functionList.globals);
        }
    }
}
function updateGlobal(varname, globals){
  console.log("varname " + varname);
  console.log("globals " + globals);
  //globals.push(varname);
}

function createsNewScope(node){
    return node.type === 'FunctionDeclaration' ||
        node.type === 'FunctionExpression' ||
        node.type === 'Program';
}

function printScope(scope, node){
    var varsDisplay = scope.join(', ');
    if (node.type === 'Program'){
        console.log('Variables declared in the global scope:',
            varsDisplay);
    }else{
        if (node.id && node.id.name){
            console.log('Variables declared in the function ' + node.id.name + '():',
                varsDisplay);
        }else{
            console.log('Variables declared in anonymous function:',
                varsDisplay);
        }
    }
}

function printRequiresModules(){
    console.log("requireModules = ");
    console.log(requiresModules);
}

//printRequiresModules();
// console.log("Variables Total: ");
// console.log(variablesTotal);


function processVariablesTotal(variablesTotal){
    var count = {};
    variablesTotal.forEach(function(i) { count[i] = (count[i]||0)+1;  });
    console.log(count);
}
processVariablesTotal(variablesTotal);


//const esprima = require('esprima');
//const tokens = esprima.tokenize(source);

// var identificadores = tokens.filter(function (el) {
//     return (el.type === "Identifier");
// });

// var listIdentifiers = [];
// identificadores.forEach(function (element) {
//     var indice = arrayObjectIndexOf(listIdentifiers,element.value, "id");
//     if(indice == -1){ // No encontró el identificador, lo agrega.
//         var list = [element.value, 1];
//         listIdentifiers.push.apply(listIdentifiers, list);
//     } else { // Encontró el identificador, suma uno.
//         listIdentifiers[indice].size++;
//     }
// });
// var armarArray = [];
// identificadores.forEach(function (element) {
//     var indice = arrayObjectIndexOf(armarArray,element.value, "id");
//     if(indice == -1){ // No encontró el identificador, lo agrega.
//         armarArray.push(new Identifier(element.value,1));
//     } else { // Encontró el identificador, suma uno.
//         armarArray[indice].quantity++;
//     }
// });
//
// console.log(armarArray);
//
// function arrayObjectIndexOf(myArray, searchTerm, property) {
//     for(var i = 0, len = myArray.length; i < len; i++) {
//         if (myArray[i][property] === searchTerm) return i;
//     }
//     return -1;
// }
//
// function Identifier(id, quantity) {
//     this.id = id;
//     this.quantity = quantity;
// }
//
// function Item (id, size){
//     this.id = id;
//     this.size = size;
// }
