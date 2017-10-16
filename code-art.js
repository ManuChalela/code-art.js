//debugger;
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');

var filename = process.argv[2];
//var filename = 'test\\sourceAbs.js';
console.log('Processing', filename);
try {
  var data = fs.readFileSync(filename, 'utf8');
} catch (e) {
  console.log(e);
}
var ast = esprima.parse(data, {
  loc: true,
  comment: true
});
var scopeChain = [];
var assignments = [];
var requiresModules = [];
var variablesTotal = [];
var functionList = [];
var namesExternals = [];
estraverse.traverse(ast, {
  enter: enter,
  leave: leave
});

function Locals(name) {
  this.name = name;
}
//var Graph = require("graph-data-structure");
//var grapho = Graph();
var grapho;

function enter(node) {
  if (createsNewScope(node)) {
    scopeChain.push([]);
  }
  // console.log(node);
  if (node.type === 'VariableDeclarator') {
    var currentScope = scopeChain[scopeChain.length - 1];
    var name = node.id.name;
    var nameGlobal;
    if (!isVarDefined(name, scopeChain))
      nameGlobal = 'global';
    currentScope.push(name);
    variablesTotal.push(name);
    if (node.init.type === 'CallExpression') {
      var nameExternal;
      if (node.init.callee != undefined) {
        if (nameExternal != undefined && nameGlobal != 'global') {
          nameExternal = node.init.name;
          namesExternals.push(nameExternal);
        }
      }
    }
  }
  if (node.type === 'AssignmentExpression') {
    assignments.push(node);
  }
  if (node.type === 'CallExpression') {
    var currentScope = scopeChain[scopeChain.length - 1];
    var nameExternal;
    if (node.callee.type === "MemberExpression") {
      if (node.callee.object != undefined) {
        if (node.callee.object.name != undefined) {
          if (node.callee.property != null && node.callee.property.name != undefined) {
            nameExternal = node.callee.object.name + "." + node.callee.property.name;
          } else {
            nameExternal = node.callee.object.name;
          }
        }
      }
    } else if (node.callee.type === "Identifier") {
      nameExternal = node.callee.name;
    }
    // Agrego como external cuando no estoy en scope global
    if (nameExternal != undefined && currentScope !== scopeChain[0])
      namesExternals.push(nameExternal);
  }
}

function ItemFunction(name, locals, globals, externals) {
  this.name = name;
  this.locals = locals;
  this.globals = globals;
  this.externals = externals;
}

function ItemVariable(name) {
  this.name = name;
}

function ItemExternal(name) {
  this.name = name;
}

function findById(source, id) {
  for (var i = 0; i < source.length; i++) {
    if (source[i].id === id) {
      return source[i];
    }
  }
  //throw "Couldn't find object with id: " + id;
  return -1;
}

function addVarToItemFunction(nameItemFunction, nameVariable, type, functionList) {
  if (nameItemFunction != null && nameVariable != null && type != null) {
    if (functionList.length === 0) {
      if (type === 'locals') {
        var itemVariable = new ItemVariable(nameVariable);
        var locals = [];
        var globals = [];
        var externals = [];
        var itemFunction = new ItemFunction(nameItemFunction, locals, globals, externals);
        itemFunction.locals.push(itemVariable);
        functionList.push(itemFunction);
      } else if (type === 'globals') {
        var itemVariable = new ItemVariable(nameVariable);
        var locals = [];
        var globals = [];
        var externals = [];
        var itemFunction = new ItemFunction(nameItemFunction, locals, globals, externals);
        itemFunction.globals.push(itemVariable);
        functionList.push(itemFunction);
      } else if (type === 'externals') {
        var itemVariable = new ItemVariable(nameVariable);
        var locals = [];
        var globals = [];
        var externals = [];
        var itemFunction = new ItemFunction(nameItemFunction, locals, globals, externals);
        itemFunction.externals.push(itemVariable);
        functionList.push(itemFunction);
      }
    } else {
      if (type === 'locals') {
        functionList.forEach(function(element) {
          var indice = arrayObjectIndexOf(functionList, nameItemFunction, "name");
          if (indice == -1) { // No encontró el nombre de la función
            var itemVariable = new ItemVariable(nameVariable);
            var locals = [];
            var globals = [];
            var externals = [];
            var itemFunction = new ItemFunction(nameItemFunction, locals, globals, externals);
            itemFunction.locals.push(itemVariable);
            functionList.push(itemFunction);
          } else { // Encontró el nombre
            var itemVariable = new ItemVariable(nameVariable);
            functionList[indice].locals.push(itemVariable);
          }
        });
      } else if (type === 'globals') {
        functionList.forEach(function(element) {
          var indice = arrayObjectIndexOf(functionList, nameItemFunction, "name");
          if (indice == -1) { // No encontró el nombre
            var itemVariable = new ItemVariable(nameVariable);
            var locals = [];
            var globals = [];
            var externals = [];
            var itemFunction = new ItemFunction(nameItemFunction, locals, globals, externals);
            itemFunction.globals.push(itemVariable);
            functionList.push(itemFunction);
          } else { // Encontró el nombre
            var itemVariable = new ItemVariable(nameVariable);
            functionList[indice].globals.push(itemVariable);
          }
        });
      } else if (type === 'externals') {
        functionList.forEach(function(element) {
          var indice = arrayObjectIndexOf(functionList, nameItemFunction, "name");
          if (indice == -1) { // No encontró el nombre
            var itemVariable = new ItemVariable(nameVariable);
            var locals = [];
            var globals = [];
            var externals = [];
            var itemFunction = new ItemFunction(nameItemFunction, locals, globals, externals);
            itemFunction.externals.push(itemVariable);
            functionList.push(itemFunction);
          } else { // Encontró el nombre
            var itemVariable = new ItemVariable(nameVariable);
            functionList[indice].externals.push(itemVariable);
          }
        });
      } else {
        console.log(nameItemFunction + " ! " + type);
      }
    }
  }
}

function addExternalToFunction(nameItemFunction, namesExternals, functionList) {
  var locals = [];
  var globals = [];
  var externals = [];
  if (nameItemFunction != undefined && namesExternals.length != 0) {
    if (functionList.length === 0) {
      var itemFunction = new ItemFunction(nameItemFunction, locals, globals, externals);
      namesExternals.forEach(function(nameExternal) {
        var itemExternal = new ItemExternal(nameExternal);
        var indiceExternal = arrayObjectIndexOf(namesExternals, nameExternal, "name");
        if (indiceExternal == -1) {
          itemFunction.externals.push(itemExternal);
        } else {
          console.log("ya se encontró: " + nameExternal);
        }
      });
      functionList.push(itemFunction);
    } else {
      var indice = arrayObjectIndexOf(functionList, nameItemFunction, "name");
      if (indice == -1) { // No encontró el nombre de la function
        namesExternals.forEach(function(nameExternal) {
          var itemExternal = new ItemExternal(nameExternal);
          var itemFunction = new ItemFunction(nameItemFunction, locals, globals, externals);
          itemFunction.externals.push(itemExternal);
          functionList.push(itemFunction);
        });
      } else { // Encontró el nombre de la function
        namesExternals.forEach(function(nameExternal) {
          var itemExternal = new ItemExternal(nameExternal);
          var indiceExternal = arrayObjectIndexOf(functionList[indice].externals, nameExternal, "name");
          if (indiceExternal == -1) {
            //itemFunction.externals.push(itemExternal);
            functionList[indice].externals.push(itemExternal);
          } else {
            console.log("ya se encontró: " + nameExternal);
          }
        });
      }
    }
  }
}

function leave(node) {
  if (createsNewScope(node)) {
    checkForLeaks(assignments, scopeChain, functionList);
    var currentScope = scopeChain.pop();
    printScope(currentScope, node);
    assignments = [];
    var nameFunction;
    if (node.type === 'FunctionDeclaration') {
      nameFunction = node.id.name;
      addExternalToFunction(nameFunction, namesExternals, functionList);
      namesExternals = []
    }
    if (functionList.length != 0) {
      var Graph = require("graph-data-structure");
      var graph = Graph();
      functionList.forEach(function(element) {
        graph.addNode(element.name);
        element.externals.forEach(function(nameExternal) {
          const actualNode = getNode(graph, nameExternal.name);
          if (!actualNode) {
            graph.addNode(nameExternal.name);
          }
          graph.addEdge(element.name, nameExternal.name);
        });
      });
      var functionListJS = JSON.stringify(functionList);
      fs.writeFile('functionList.json', functionListJS, 'utf8', function(err) {
        if (err) throw err;
      });
      grapho = graph;
      var graphoJS = JSON.stringify(grapho);
      fs.writeFile('grapho.json', graphoJS, 'utf8', function(err) {
        if (err) throw err;
      });
    }
  }
}

function printLeave(graph) {
  console.log("FunctionList salgo: " + JSON.stringify(functionList));
  console.log("namesExternals: " + JSON.stringify(namesExternals));
  console.log("El grafo de referencias es: ");
  console.log(graph.topologicalSort());
  console.log("El grafo serializado es: ");
  console.log(graph.serialize());
}

function isVarDefined(varname, scopeChain) {
  for (var i = 0; i < scopeChain.length; i++) {
    var scope = scopeChain[i];
    if (scope.indexOf(varname) !== -1) {
      return true;
    }
  }
  return false;
}

function checkForLeaks(assignments, scopeChain, functionList) {
  for (var i = 0; i < assignments.length; i++) {
    var assignment = assignments[i];
    var varname = assignment.left.name;
    if (!isVarDefined(varname, scopeChain)) {
      console.log('Leaked global', varname, 'on line', assignment.loc.start.line);
      console.log("assigments: " + assignments[i]);
    }
  }
}

function updateGlobal(varname, globals) {
  console.log("varname " + varname);
  console.log("globals " + globals);
}

function createsNewScope(node) {
  return node.type === 'FunctionDeclaration' ||
    node.type === 'FunctionExpression' ||
    node.type === 'Program';
}

function printScope(scope, node) {
  var varsDisplay = scope.join(', ');
  if (node.type === 'Program') {
    console.log('Variables declared in the global scope:', varsDisplay);
  } else {
    if (node.id && node.id.name) {
      console.log('Variables declared in the function ' + node.id.name + '():',
        varsDisplay);
      var nameItemFunction = node.id.name;
      for (i = 0; i < node.params.length; i++) {
        var varname = node.params[i].name;
        addVarToItemFunction(nameItemFunction, varname, 'locals', functionList);
      }
    } else {
      console.log('Variables declared in anonymous function:', varsDisplay);
    }
  }
}

function processVariablesTotal(variablesTotal) {
  var count = {};
  variablesTotal.forEach(function(i) {
    count[i] = (count[i] || 0) + 1;
  });
  console.log(count);
}
processVariablesTotal(variablesTotal);
printLeave(grapho);


function arrayObjectIndexOf(myArray, searchTerm, property) {
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i][property] === searchTerm) return i;
  }
  return -1;
}

function getNode(graph, nodeId) {
  const allNodes = graph.nodes();
  const index = arrayObjectIndexOf(allNodes, nodeId, "id");
  if (index !== -1) {
    return allNodes[index];
  } else {
    return null;
  }


}
