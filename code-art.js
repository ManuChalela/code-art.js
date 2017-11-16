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
var namesGlobals = [];
var externalsTotal = [];
var variablesTotal = [];
var variablesGlobal = [];
var size = 0;
var FinalList = [];
var FunctionDefTotal = [];
var min = Number.MAX_VALUE;
var max = Number.MIN_VALUE;
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
  //  size = size + 1;
  if (createsNewScope(node)) {
    scopeChain.push([]);
  }
  if (node.type === 'FunctionDeclaration') {
    //console.log(node);
    size = node.body.body.length;
    //size = size + 1;
    //  console.log("size: " + size);
    var nameFunction = node.id.name;
  }
  if (node.type === 'VariableDeclarator') {
    var currentScope = scopeChain[scopeChain.length - 1];
    var name = node.id.name;
    //  console.log(name);
    var nameGlobal;
    if (isVarDefined(name, scopeChain)) {
      nameGlobal = 'global';
      //console.log("variable global detectada.");
      namesGlobals.push(name);
      //console.log(JSON.stringify(namesGlobals));
    }
    currentScope.push(name);
    variablesTotalSimple.push(name);
    //console.log(node.init);
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
        }
        // lo comento para no tener 3 globall en globals de Absoluto con abs.js
        //checkGlobal(node, nameFunction, 'AssignmentExpression');
      }
    }
  }
  if (node.type === 'AssignmentExpression') {
    assignments.push(node);
    //console.log(node);
    //checkGlobal(node, nameFunction);
  }
  if (node.type === 'ExpressionStatement') {
    if (node.expression.type === 'AssignmentExpression') {
      //console.log(node);
      checkGlobal(node, node.id, 'ExpressionStatement');
    }
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
  if (node.type === "TryStatement" || node.type === "ForStatement" ||
    node.type === "IfStatement" || node.type === "WhileStatement" ||
    node.type === "SwitchStatement") {
    if (node.body) {
      //  console.log(node.body);
      if (node.body.body) {
        size = size + node.body.body.length;
      } else {
        size = size + 1;
      }
    }
  }
}

function checkGlobal(node, name, type) {
  if (type === 'AssignmentExpression') {
    if (node.init.type === 'BinaryExpression') {
      if (node.init.left.type === 'Identifier') {
        if (isVarDefined(node.init.left.name, scopeChain)) {
          //console.log("hay una variable global left");
          processIdentifiersGlobal(node.init.left.name);
          //console.log(namesGlobals);
          addVarToItemFunction(name, node.init.left.name, 'globals', functionList);
        } else if (isVarDefined(node.init.right.name, scopeChain)) {
          //console.log("hay una variable global right");
          processIdentifiersGlobal(node.init.right.name);
          addVarToItemFunction(name, node.init.right.name, 'globals', functionList);
        }
      } else if (node.init.right.type === 'Identifier') {
        if (isVarDefined(node.init.left.name, scopeChain)) {
          //console.log("hay una variable global left");
          processIdentifiersGlobal(node.init.left.name);
          //console.log(namesGlobals);
          addVarToItemFunction(name, node.init.left.name, 'globals', functionList);
        } else if (isVarDefined(node.init.right.name, scopeChain)) {
          //console.log("hay una variable global right");
          processIdentifiersGlobal(node.init.right.name);
          addVarToItemFunction(name, node.init.right.name, 'globals', functionList);
        }
      }
    }
  } else if (type === 'ExpressionStatement') {
    if (node.expression.type === 'AssignmentExpression') {
      if (node.expression.left.type === 'Identifier') {
        if (isVarDefined(node.expression.left.name, scopeChain)) {
          //  console.log("hay una variable global left en ExpressionStatement");
          processIdentifiersGlobal(node.expression.left.name);
          addVarToItemFunction(name, node.expression.left.name, 'globals', functionList);
        }
      }
    }
  }
  // if (node.init.type === 'BinaryExpression') {
  //   if (node.init.left.type === 'Identifier') {
  //     if (isVarDefined(node.init.left.name, scopeChain)) {
  //       console.log("hay una variable global left");
  //       processIdentifiersGlobal(node.init.left.name);
  //       console.log(namesGlobals);
  //     } else if (isVarDefined(node.init.right.name, scopeChain)) {
  //       console.log("hay una variable global right");
  //       processIdentifiersGlobal(node.init.right.name);
  //     }
  //   } else if (node.init.right.type === 'BinaryExpression') {
  //     if (isVarDefined(node.init.left.name, scopeChain)) {
  //       console.log("hay una variable global left");
  //       processIdentifiersGlobal(node.init.left.name);
  //       console.log(namesGlobals);
  //       addVarToItemFunction(name, node.init.left.name, 'globals', functionList);
  //     } else if (isVarDefined(node.init.right.name, scopeChain)) {
  //       console.log("hay una variable global right");
  //       processIdentifiersGlobal(node.init.right.name);
  //       addVarToItemFunction(name, node.init.right.name, 'globals', functionList);
  //     }
  //   }
  // }
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

function processIdentifiersGlobal(name) {
  namesGlobals.push(name);
}

function processRequires(node) {
  if (node.init != null && node.init.type != null && node.init.type === 'CallExpression' && node.init.callee.name != undefined) {
    nameExternal = node.init.calle.name;
    //console.log(nameExternal);
    //namesExternals.push(nameExternal);
  }
}

function ItemFunction(name, locals, globals, externals, size, color, fontFamily, fontWeight) {
  this.name = name;
  this.locals = locals;
  this.globals = globals;
  this.externals = externals;
  this.size = size;
  this.color = color;
  this.fontFamily = fontFamily;
  this.fontWeight = fontWeight;
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

function ItemVariableTotal(name, count, color, fontFamily, fontWeight) {
  this.name = name;
  this.count = count;
  this.color = color;
  this.fontFamily = fontFamily;
  this.fontWeight = fontWeight;
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
      var itemVariable = new ItemVariable(nameVariable);
      var locals = [];
      var globals = [];
      var externals = [];
      var color = getColorNotRed();
      var fontFamily = getRandomFontFamily();
      var fontWeight = getRandomWeight();
      var itemFunction = new ItemFunction(nameItemFunction, locals, globals, externals, size, color, fontFamily, fontWeight);
      if (type === 'locals') {
        itemFunction.locals.push(itemVariable);
      } else if (type === 'globals') {
        itemFunction.globals.push(itemVariable);
        // namesGlobals.forEach(function(item) {
        //   var itemG = new ItemVariable(item);
        //   itemFunction.globals.push(itemG);
        // });
      } else if (type === 'externals') {
        itemFunction.externals.push(itemVariable);
      } else {
        console.log("Error de tipo en addVarToItemFunction.");
      }
      functionList.push(itemFunction);
    } else { // functionList not empty
      functionList.forEach(function(element) {
        var indice = arrayObjectIndexOf(functionList, nameItemFunction, "name");
        if (indice == -1) { // No encontró el nombre de la función
          var itemVariable = new ItemVariable(nameVariable);
          var locals = [];
          var globals = [];
          var externals = [];
          var color = getColorNotRed();
          var fontFamily = getRandomFontFamily();
          var fontWeight = getRandomWeight();
          var itemFunction = new ItemFunction(nameItemFunction, locals, globals, externals, size, color, fontFamily, fontWeight);
          if (type === 'locals') {
            itemFunction.locals.push(itemVariable);
          } else if (type === 'globals') {
            itemFunction.globals.push(itemVariable);
            // namesGlobals.forEach(function(item) {
            //   var itemG = new ItemVariable(item);
            //   itemFunction.globals.push(itemG);
            // });
          } else if (type === 'externals') {
            itemFunction.externals.push(itemVariable);
          } else {
            console.log("Error en el tipo de addVarToItemFunction no nulo.");
          }
          functionList.push(itemFunction);
        } else { // Encontró el nombre de la función
          var itemVariable = new ItemVariable(nameVariable);
          if (type === 'locals') {
            var indiceItemLocal = arrayObjectIndexOf(functionList[indice].locals, nameVariable, "name");
            if (indiceItemLocal == -1) { // No encontró el nombre del locals.
              functionList[indice].locals.push(itemVariable);
            }
          } else if (type === 'globals') {
            var indiceItemGlobal = arrayObjectIndexOf(functionList[indice].globals, nameVariable, "name");
            if (indiceItemGlobal == -1) { // No encontró el nombre del global
              functionList[indice].globals.push(itemVariable);
              namesGlobals.forEach(function(item) {
                var itemG = new ItemVariable(item);
                functionList[indice].globals.push(itemG);
              });
            }
          } else if (type === 'externals') {
            var indiceItemExternal = arrayObjectIndexOf(functionList[indice].externals, nameVariable, "name");
            if (indiceItemExternal == -1) {
              functionList[indice].externals.push(itemVariable);
            }
          } else {
            console.log("Error en el tipo de addVarToItemFunction no nulo.");
          }
        }
      });
    }
  }
}

function checkVariablesTotal(listVariables, varname) {
  if (varname) {
    var color = getRandomColor();
    var fontFamily = getRandomFontFamily();
    var fontWeight = getRandomWeight();
    var indiceVariablesTotal = arrayObjectIndexOf(listVariables, varname, "name");
    if (indiceVariablesTotal == -1) {
      var itemVariablesTotal = new ItemVariableTotal(varname, 1, color, fontFamily, fontWeight);
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
  var color = getColorNotRed();
  var fontFamily = getRandomFontFamily();
  var fontWeight = getRandomWeight();
  if (nameItemFunction != undefined && namesExternals.length != 0) {
    if (functionList.length === 0) {
      var itemFunction = new ItemFunction(nameItemFunction, locals, globals, externals, size, color, fontFamily, fontWeight);
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
          var itemFunction = new ItemFunction(nameItemFunction, locals, globals, externals, size, color, fontFamily, fontWeight);
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
      namesExternals = [];
      //console.log("namesGlobals leave: " + JSON.stringify(namesGlobals));
      namesGlobals.forEach(function(itemGlobal) {
        addVarToItemFunction(nameFunction, itemGlobal, 'globals', functionList);
      });
      namesGlobals = [];
      //console.log(node);
    }
    //console.log(node.id);
    if (node.type === 'ExpressionStatement') {
      if (node.expression.type === 'AssignmentExpression') {
        //console.log(node);
        checkGlobal(node, node.id, 'ExpressionStatement');
      }
    }
    if (node.type === 'AssignmentExpression') {
      //console.log(node);
      checkGlobal(node, node.id, 'AssignmentExpression');
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
      /*
      var itemList = [];
      itemList.push(graph.serialize().nodes[i].id, 1);
      itemListJS.push(JSON.stringify(itemList));
      */
    }
    for (var i = 0; i < functionList.length; i++) {
      var itemList = [];
      itemList.push(functionList[i].name, 2 + Math.round(Math.log(functionList[i].size) * 100) / 100, functionList[i].color, functionList[i].fontFamily, functionList[i].fontWeight);
      //itemList.push(functionList[i].name, functionList[i].size, functionList[i].color, functionList[i].fontFamily, functionList[i].fontWeight);

      itemListJS.push(JSON.stringify(itemList));
      var item = functionList[i];
      var itemVariableTotal = new ItemVariableTotal(item.name, 2 + Math.round(Math.log(item.size) * 100) / 100, item.color, item.fontFamily, item.fontWeight);
      //var itemVariableTotal = new ItemVariableTotal(item.name, item.size, item.color, item.fontFamily, item.fontWeight);

      FunctionDefTotal.push(itemVariableTotal);

      // Agrego las globales de cada function a variablesGlobal
      if (functionList[i].globals) {
        functionList[i].globals.forEach(function(varGlobal) {
          checkVariablesTotal(variablesGlobal, varGlobal.name);
        });
      }
    }
    // Agrego los globals a la WordCloud
    variablesGlobal.forEach(function(varGlobal) {
      var itemList = [];
      itemList.push(varGlobal.name, 2 + Math.round(Math.log(varGlobal.count) * 100) / 100, varGlobal.color, varGlobal.fontFamily, varGlobal.fontWeight);
      //itemList.push(varGlobal.name, varGlobal.count, varGlobal.color, varGlobal.fontFamily, varGlobal.fontWeight);
      itemListJS.push(JSON.stringify(itemList));
    });

    itemListJS = "[" + itemListJS + "]";
    fs.writeFile('views/list.json', itemListJS, 'utf8', function(err) {
      if (err) throw err;
    });

    nodesJS = "[" + nodesJS + "]";
    fs.writeFile('nodes.json', nodesJS, 'utf8', function(err) {
      if (err) throw err;
    });


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
    var edgesLogJS = [];
    for (var i = 0; i < externalsTotal.length; i++) {
      var itemListET = [];
      itemListET.push(externalsTotal[i].name, externalsTotal[i].count);
      edgesJS.push(JSON.stringify(itemListET));

      var itemListLog = [];
      // if (externalsTotal[i].count == 1) {
      //   itemListLog.push(externalsTotal[i].name, externalsTotal[i].count);
      // } else {
      //   //itemListLog.push(externalsTotal[i].name, Math.log(externalsTotal[i].count));
      //   itemListLog.push(externalsTotal[i].name, externalsTotal[i].count);
      // }
      // if (externalsTotal[i].count == 1) {
      //   itemListLog.push(externalsTotal[i].name, externalsTotal[i].count);
      // } else {
      //   //itemListLog.push(externalsTotal[i].name, Math.log(externalsTotal[i].count));
      //   itemListLog.push(externalsTotal[i].name, externalsTotal[i].count);
      // }
      itemListLog.push(externalsTotal[i].name, 2 + Math.round(Math.log(externalsTotal[i].count)));
      edgesLogJS.push(JSON.stringify(itemListLog));
    }
    var edgesETJS = "[" + edgesJS + "]";
    fs.writeFile('views/edges.json', edgesETJS, 'utf8', function(err) {
      if (err) throw err;
    });

    var edgesETLogs = "[" + edgesLogJS + "]";
    fs.writeFile('views/edgesLog.json', edgesETLogs, 'utf8', function(err) {
      if (err) throw err;
    });
    if (variablesTotalSimple.length > 0) {
      //console.log("VariablesTotalSimple: ");
      //console.log(JSON.stringify(variablesTotalSimple));
    } else {
      console.log("variablesTotalSimple empty.");
    }
    if (variablesTotal.length > 0) {
      //  console.log("variablesTotal: ");
      //console.log(JSON.stringify(variablesTotal));
    } else {
      console.log("variablesTotal empty.");
    }
    if (variablesGlobal.length > 0) {
      //console.log("VariablesGlobal: ");
      //console.log(JSON.stringify(variablesGlobal));
    } else {
      console.log("variablesGlobal empty.");
    }
    if (externalsTotal.length > 0) {
      //console.log("ExternalTotal: ");
      //console.log(JSON.stringify(externalsTotal));
    } else {
      console.log("externalsTotal empty.");
    }
    if (variablesGlobal.length > 0 && FunctionDefTotal.length > 0) {
      finalList = variablesGlobal;
      finalList = finalList.concat(FunctionDefTotal);
    } else if (variablesGlobal.length > 0) {
      finalList = variablesGlobal;
    } else if (FunctionDefTotal.length > 0) {
      finalList = FunctionDefTotal;
    } else {
      console.log("Error with finalList!");
    }
    for (var i = 0; i < finalList.length; i++) {
      if (finalList[i].count < min)
        min = finalList[i].count;
      if (finalList[i].count > max)
        max = finalList[i].count;
    }
    console.log("Min: " + min);
    console.log("Max: " + max);
    console.log("Length: " + finalList.length);
    if (min > 0 && max > 0) {
      if (min < max)
        var finalListColored = setColorByCount(finalList, min, max, (max - min) / 2); // 0.5
      else if (min == max)
        var finalListColored = setColorByCount(finalList, min, min, 1);
    } else {
      console.log("Error with min and max!");
    }
    var itemFinalListJS = [];
    for (var i = 0; i < finalListColored.length; i++) {
      var itemList = [];

      //var size = Math.round(Math.log(finalListColored[i].count) * 100) / 100;
      itemList.push(finalListColored[i].name, finalListColored[i].count, finalListColored[i].color, finalListColored[i].fontFamily, finalListColored[i].fontWeight);
      //console.log(itemList);
      itemFinalListJS.push(JSON.stringify(itemList));
    }
    itemFinalListJS = "[" + itemFinalListJS + "]";
    fs.writeFile('views/finalList.json', itemFinalListJS, 'utf8', function(err) {
      if (err) throw err;
    });
  } else {
    console.log("Graph empty.");
  }
}

function setColorByCount(list, min, max, factor) {
  if (list.length > 0 && min > 0 && max > 0) {
    var start = "#0000FF";
    var end = "#FF0000";
    for (var i = 0; i < list.length; i++) {
      if (list[i].count == min)
        list[i].color = start;
      else if (list[i].count == max)
        list[i].color = end;
      else
        list[i].color = interpolateRGBColor(min, max, list[i].count);
      //list[i].color = rgb2hex(interpolateRGBColor(min, max, list[i].count));
      console.log("Count: " + list[i].count + " Color: " + list[i].color);
    }
    console.log("FinalList: ");
    console.log(JSON.stringify(list));
    return list;
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
    //console.log(assignment);
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
    scope.forEach(function(item) {
      checkVariablesTotal(variablesGlobal, item);
    });
  } else {
    if (node.id && node.id.name) {
      console.log('Variables declared in the function ' + node.id.name + '():',
        varsDisplay);
      var nameItemFunction = node.id.name;
      scope.forEach(function(item) {
        var indiceGlobal = arrayObjectIndexOf(variablesGlobal, item, "name");
        if (indiceGlobal == -1) { // Si no encontró son locales.
          // scope.forEach(function(item) {
          //   addVarToItemFunction(nameItemFunction, item, 'locals', functionList);
          //   checkVariablesTotal(variablesTotal, item);
          // });
          addVarToItemFunction(nameItemFunction, item, 'locals', functionList);
          checkVariablesTotal(variablesTotal, item);
          for (i = 0; i < node.params.length; i++) {
            var varname = node.params[i].name;
            // TODO: Revisar esto para no agregar como locales los parámetros.
            //addVarToItemFunction(nameItemFunction, varname, 'locals', functionList);
            checkVariablesTotal(variablesTotal, varname);
          }
        } else { // Si encontró son globales
          console.log("porque cantann !!!! ");
          addVarToItemFunction(nameItemFunction, item, 'globals', functionList);
          checkVariablesTotal(variablesGlobal, item);
        }

      });
    } else {
      console.log('Variables declared in anonymous function:', varsDisplay);
    }
  }
}
/*
function printScope(scope, node) {
  var varsDisplay = scope.join(', ');
  if (node.type === 'Program') {
    console.log('Variables declared in the global scope:', varsDisplay);
  } else {
    if (node.id && node.id.name) {
      console.log('Variables declared in the function ' + node.id.name + '():',
        varsDisplay);
      var nameItemFunction = node.id.name;
      addVarToItemFunction(nameItemFunction, varsDisplay, 'locals', functionList);
      checkVariablesTotal(variablesTotalChecked, varsDisplay);
      for (i = 0; i < node.params.length; i++) {
        var varname = node.params[i].name;
        addVarToItemFunction(nameItemFunction, varname, 'locals', functionList);
        checkVariablesTotal(variablesTotalChecked, varname);
      }
    } else {
      console.log('Variables declared in anonymous function:', varsDisplay);
    }
  }
}
*/
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

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getColorNotRed() {
  var color = "";
  do {
    color = getRandomColor();
  } while (color === "#FF0000");
  return color;
}

function getRandomRGBColor() {
  return "rgb(" + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ")";
}

function getRandomFontFamily() {
  var fontFamilyList = ["Georgia", "Palatino Linotype", "Book Antiqua", "Palatino", "Times New Roman", "Arial", "Helvetica", "Arial Black", "Comic Sans MS", "Impact", "Charcoal", "Lucida Sans Unicode", "Lucida Grande", "Tahoma", "Geneva", "Trebuchet MS", "Helvetica", "Verdana", "Geneva", "Courier New", "Lucida Console"];
  return fontFamilyList[Math.floor(Math.random() * fontFamilyList.length)];
}

function getRandomWeight() {
  var weightList = ["normal", "bold", "italic"];
  return weightList[Math.floor(Math.random() * weightList.length)];
}

function interpolateColor(start, end, count) {

  var ah = parseInt(start.replace(/#/g, ''), 16),
    ar = ah >> 16,
    ag = ah >> 8 & 0xff,
    ab = ah & 0xff,
    bh = parseInt(end.replace(/#/g, ''), 16),
    br = bh >> 16,
    bg = bh >> 8 & 0xff,
    bb = bh & 0xff,
    rr = ar + count * (br - ar),
    rg = ag + count * (bg - ag),
    rb = ab + count * (bb - ab);

  return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}


function interpolateRGBColor(min, max, count) {
  if (count > 0 && min > 0 && max > 0) {
    if (count == min)
      return "rgb(0,0,255)";
    else if (count == max)
      return "rgb(255,0,0)";
    else return "rgb(" + Math.floor(255 - (count / max * 255)) + ", 0, " + Math.floor(255 - (min / count * 255)) + ")";
  } else console.log("Error with interpolateRGBColor!");
}

function rgb2hex(rgb) {
  var rgbArray = rgb.split(',');
  var r = parseInt(rgbArray[0].substring(4)); // skip rgb(
  var g = parseInt(rgbArray[1]);
  var b = parseInt(rgbArray[2]);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
