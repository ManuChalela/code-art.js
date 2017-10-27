//debugger;
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var jsonfile = require('jsonfile');

var filename = process.argv[2];
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
var variablesTotalSimple = [];
var functionList = [];
var namesExternals = [];
var externalsTotal = [];
var variablesTotal = [];
var variablesGlobal = [];
estraverse.traverse(ast, {
  enter: enter,
  leave: leave
});

function Locals(name) {
  this.name = name;
}
var grapho;

function itemNode(id, label, group) {
  this.id = id;
  this.label = label;
  this.group = group;
}

function enter(node) {
  if (createsNewScope(node)) {
    scopeChain.push([]);
  }
  //console.log(node);
  // if (node.type === 'Program') {
  //   if (node.body.type != undefined) {
  //     console.log(node.body.type);
  //     if (node.body.type === 'VariableDeclarator')
  //       console.log(node.body);
  //   }
  // }

  if (node.type === 'VariableDeclarator') {
    var currentScope = scopeChain[scopeChain.length - 1];
    var name = node.id.name;
    //console.log(name);
    var nameGlobal;
    if (!isVarDefined(name, scopeChain))
      nameGlobal = 'global';
    currentScope.push(name);
    variablesTotalSimple.push(name);
    if (node.init != undefined) {
      if (node.init.type != undefined) {
        if (node.init.type === 'CallExpression') {
          var nameExternal;
          if (node.init.callee != undefined) {
            if (nameExternal != undefined && nameGlobal != 'global') {
              processIdentifiersCall(node);
            } else {
              //console.log("la variable es global");
            }
          }
        } else {
          //        console.log("node.init.callee is undefined");
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
    // Agrego como external cuando no estoy en el scope global
    if (nameExternal != undefined && currentScope !== scopeChain[0]) {
      namesExternals.push(nameExternal);
      checkExternalTotal(externalsTotal, nameExternal);
    }
  }
}

function processIdentifiersCall(node) {
  if (node.init.callee.type != undefined) {
    //console.log(node);
    if (node.init.callee.name != undefined) {
      nameExternal = node.init.callee.name;
      //  console.log(nameExternal);
    } else if (node.init.name != undefined) {
      nameExternal = node.init.name;
      //console.log(nameExternal);
    } else {

    }
    namesExternals.push(nameExternal);
  } else {
    //console.log("callee.type es undefined");
  }
  //console.log(namesExternals);
}

function processRequires(node) {
  if (node.init != null && node.init.type != null && node.init.type === 'CallExpression' && node.init.callee.name != undefined) {
    nameExternal = node.init.calle.name;
    //console.log(nameExternal);
    //namesExternals.push(nameExternal);
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

function ItemExternalTotal(name, count) {
  this.name = name;
  this.count = count;
}

function ItemVariableTotal(name, count) {
  this.name = name;
  this.count = count;
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
            /*
              var itemVariable = new ItemVariable(nameVariable);
              functionList[indice].locals.push(itemVariable);
            */
            var indiceItemVariable = arrayObjectIndexOf(functionList[indice].locals, nameVariable, "name");
            if (indiceItemVariable == -1) { // No encontró el nombre del locals.
              var itemVariable = new ItemVariable(nameVariable);
              functionList[indice].locals.push(itemVariable);
            } else { // Ya estaba el local guardado.

            }
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
        //  console.log(nameItemFunction + " ! " + type);
      }
    }
  }
}

function checkVariablesTotal(listVariables, varname) {
  if (varname) {
    var indiceVariablesTotal = arrayObjectIndexOf(listVariables, varname, "name");
    if (indiceVariablesTotal == -1) {
      var itemVariablesTotal = new ItemVariableTotal(varname, 1);
      listVariables.push(itemVariablesTotal);
    } else {
      listVariables[indiceVariablesTotal].count = listVariables[indiceVariablesTotal].count + 1;
    }
  } else {
    //  console.log("Error checkVariablesTotal: varname is null.");
  }
}


function checkExternalTotal(externalsTotal, nameExternal) {
  var indiceExternalTotal = arrayObjectIndexOf(externalsTotal, nameExternal, "name");
  if (indiceExternalTotal == -1) {
    var itemExternalTotal = new ItemExternalTotal(nameExternal, 0)
    externalsTotal.push(itemExternalTotal);
  } else {
    externalsTotal[indiceExternalTotal].count = externalsTotal[indiceExternalTotal].count + 1;
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
          console.log("found it: " + nameExternal);
        }
        checkExternalTotal(externalsTotal, nameExternal);
      });
      functionList.push(itemFunction);
    } else {
      var indice = arrayObjectIndexOf(functionList, nameItemFunction, "name");
      if (indice == -1) { // No encontró el nombre de la function
        namesExternals.forEach(function(nameExternal) {
          var itemExternal = new ItemExternal(nameExternal);
          var itemFunction = new ItemFunction(nameItemFunction, locals, globals, externals);
          itemFunction.externals.push(itemExternal);
          checkExternalTotal(externalsTotal, nameExternal);
          functionList.push(itemFunction);
        });
      } else { // Encontró el nombre de la function
        namesExternals.forEach(function(nameExternal) {
          var itemExternal = new ItemExternal(nameExternal);
          var indiceExternal = arrayObjectIndexOf(functionList[indice].externals, nameExternal, "name");
          if (indiceExternal == -1) {
            //itemFunction.externals.push(itemExternal);
            functionList[indice].externals.push(itemExternal);
            checkExternalTotal(externalsTotal, nameExternal);
          } else {
            console.log("found it: " + nameExternal);
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
    // if (node.type === 'Program') {
    //   node.body.forEach(function(itemBody) {
    //     //console.log(itemBody);
    //     if (itemBody.type === 'VariableDeclarator') {
    //       console.log(itemBody.id.type);
    //       if (itemBody.id.type === 'Identifier')
    //         console.log(itemBody.id.type);
    //     }
    //   });
    // }
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
    }
  }
}

function printLeave(graph) {
  if (functionList.length > 0) {
    console.log("FunctionList: " + JSON.stringify(functionList));
  } else {
    console.log("FunctionList empty. There're not externals references in your code.");
  }
  if (graph) {
    console.log("Reference graph is: ");
    console.log(graph.topologicalSort());
    console.log("Graph serialized: ");
    console.log(graph.serialize());
    var graphoJS = JSON.stringify(graph.serialize());
    fs.writeFile('grapho.json', graphoJS, 'utf8', function(err) {
      if (err) throw err;
    });
    var nodesJS = [];
    var itemListJS = [];
    for (var i = 0; i < graph.serialize().nodes.length; i++) {
      var itemN = new itemNode(i, graph.serialize().nodes[i].id, 0);
      nodesJS.push(JSON.stringify(itemN));

      var itemList = [];
      itemList.push(graph.serialize().nodes[i].id, 1);
      itemListJS.push(JSON.stringify(itemList));
    }
    nodesJS = "[" + nodesJS + "]";
    fs.writeFile('nodes.json', nodesJS, 'utf8', function(err) {
      if (err) throw err;
    });
    itemListJS = "[" + itemListJS + "]";
    fs.writeFile('views/list.json', itemListJS, 'utf8', function(err) {
      if (err) throw err;
    });

    //var nodesRJS

    var linksJS = [];
    for (var i = 0; i < graph.serialize().links.length; i++) {
      var fromIndex = arrayObjectIndexOf(graph.serialize().nodes, graph.serialize().links[i].source, "id");
      var toIndex = arrayObjectIndexOf(graph.serialize().nodes, graph.serialize().links[i].target, "id");
      var itemLink = {
        from: fromIndex,
        to: toIndex,
        arrows: 'to'
      };
      linksJS.push(JSON.stringify(itemLink));
    }
    linksJS = "[" + linksJS + "]";
    fs.writeFile('links.json', linksJS, 'utf8', function(err) {
      if (err) throw err;
    });

    // Adding externalsTotal in views/edges.json
    var edgesJS = [];
    for (var i = 0; i < externalsTotal.length; i++) {
      var itemListET = [];
      itemListET.push(externalsTotal[i].name, externalsTotal[i].count);
      edgesJS.push(JSON.stringify(itemListET));
    }
    var edgesETJS = "[" + edgesJS + "]";
    fs.writeFile('views/edges.json', edgesETJS, 'utf8', function(err) {
      if (err) throw err;
    });
    if (variablesTotalSimple.length > 0) {
      console.log("VariablesTotalSimple: ");
      console.log(JSON.stringify(variablesTotalSimple));
    } else {
      console.log("variablesTotalSimple empty.");
    }
    if (variablesTotal.length > 0) {
      console.log("variablesTotal: ");
      console.log(JSON.stringify(variablesTotal));
    } else {
      console.log("variablesTotal empty.");
    }
    if (variablesGlobal.length > 0) {
      console.log("VariablesGlobal: ");
      console.log(JSON.stringify(variablesGlobal));
    } else {
      console.log("variablesGlobal empty.");
    }
    if (externalsTotal.length > 0) {
      console.log("ExternalTotal: ");
      console.log(JSON.stringify(externalsTotal));
    } else {
      console.log("externalsTotal empty.");
    }
  } else {
    console.log("Graph empty.");
  }
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
    //variablesGlobal.push(varsDisplay);
    checkVariablesTotal(variablesGlobal, varsDisplay);
  } else {
    if (node.id && node.id.name) {
      console.log('Variables declared in the function ' + node.id.name + '():',
        varsDisplay);
      var nameItemFunction = node.id.name;
      addVarToItemFunction(nameItemFunction, varsDisplay, 'locals', functionList);
      checkVariablesTotal(variablesTotal, varsDisplay);
      for (i = 0; i < node.params.length; i++) {
        var varname = node.params[i].name;
        addVarToItemFunction(nameItemFunction, varname, 'locals', functionList);
        checkVariablesTotal(variablesTotal, varname);
      }
    } else {
      console.log('Variables declared in anonymous function:', varsDisplay);
    }
  }
}

function processVariablesTotalSimple(variablesTotalSimple) {
  var count = {};
  variablesTotalSimple.forEach(function(i) {
    count[i] = (count[i] || 0) + 1;
  });
  //console.log(count);
}
processVariablesTotalSimple(variablesTotalSimple);
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
