const espree = require('espree');
//var source = 'answer = 42; hola = 5; isCold = "Si"; answer = 50;';
var source = 'function radToDeg(num) {\n' +
    '  return num*180/Math.PI;\n' +
    '}\n' +
    ' \n' +
    '(function() {\n' +
    ' \n' +
    '    var MyRenderer = {\n' +
    '      create: function() {\n' +
    '        return { controller: MyRenderer };\n' +
    '      },\n' +
    '      world: function(engine) {\n' +
    '        var cumulativeHeight = 0;\n' +
    '        for (var i=0; i<bodies.length; i++) {\n' +
    '          cumulativeHeight += bodies[i].height\n' +
    '          bodies[i].domelement.style.transform = \'translate3d(0px, \'+(bodies[i].position.y-cumulativeHeight+(bodies[i].height/2)-startY)+\'px, \'+(-bodies[i].position.x)+\'px) rotateX(\'+(radToDeg(bodies[i].angle)-90)+\'deg)\';\n' +
    '        }\n' +
    '      },\n' +
    '      clear: function(engine) {\n' +
    '      }\n' +
    '    };\n' +
    ' \n' +
    '    // Matter aliases\n' +
    '    var Engine = Matter.Engine,\n' +
    '        World = Matter.World,\n' +
    '        Bodies = Matter.Bodies,\n' +
    '        Body = Matter.Body,\n' +
    '        Composite = Matter.Composite,\n' +
    '        Composites = Matter.Composites,\n' +
    '        Common = Matter.Common,\n' +
    '        Constraint = Matter.Constraint,\n' +
    '        RenderPixi = Matter.RenderPixi,\n' +
    '        Events = Matter.Events,\n' +
    '        Bounds = Matter.Bounds,\n' +
    '        Vector = Matter.Vector,\n' +
    '        Vertices = Matter.Vertices,\n' +
    '        MouseConstraint = Matter.MouseConstraint,\n' +
    '        Mouse = Matter.Mouse,\n' +
    '        Query = Matter.Query;\n' +
    ' \n' +
    '    var FreeFallMenu = {};\n' +
    ' \n' +
    '    var _engine,\n' +
    '        _sceneEvents = [],\n' +
    '        bodies = [],\n' +
    '        endConstraint,\n' +
    '        on = false\n' +
    ' \n' +
    '    FreeFallMenu.init = function() {\n' +
    ' \n' +
    '        // Uncomment for debug mode\n' +
    '        var container = document.getElementById(\'freefallmenu-container\');\n' +
    ' \n' +
    '        var options = {\n' +
    '            positionIterations: 6,\n' +
    '            velocityIterations: 4,\n' +
    '            render: {\n' +
    '              controller: MyRenderer\n' +
    '            }\n' +
    '        };\n' +
    ' \n' +
    '        _engine = Engine.create(container, options);\n' +
    '        Engine.run(_engine);\n' +
    ' \n' +
    '        var _world = _engine.world;\n' +
    ' \n' +
    '        FreeFallMenu.reset();\n' +
    ' \n' +
    '        var groupId = Matter.Body.nextGroupId();\n' +
    '        var menuElements = document.getElementsByClassName(\'freefallmenu-element\');\n' +
    '        var cumulativeHeight = 0;\n' +
    ' \n' +
    '        //Bodies\n' +
    '        for (var i=0;i<menuElements.length;i++) {\n' +
    '          var height = menuElements[i].offsetHeight;\n' +
    '          bodies[i] = Bodies.rectangle(0, startY, height, 2.0, {groupId: groupId});\n' +
    '          bodies[i].height = height;\n' +
    '          bodies[i].domelement = menuElements[i];\n' +
    '          cumulativeHeight += bodies[i].height;\n' +
    '          Matter.Body.rotate(bodies[i],-startAngle);\n' +
    '          Matter.Body.translate(bodies[i],{x: (cumulativeHeight-height/2)*Math.cos(startAngle), y: -(cumulativeHeight-height/2)*Math.sin(startAngle)});\n' +
    '          World.add(_world, bodies[i]);\n' +
    '        }\n' +
    ' \n' +
    '        //Constraints\n' +
    '        var worldPositionConstraintX = (bodies[0].height/2-0.5)*Math.cos(startAngle);\n' +
    '        var worldPositionConstraintY = (bodies[0].height/2-0.5)*Math.sin(startAngle);\n' +
    '        World.add(_world, Constraint.create({\n' +
    '            pointA: { x: 0, y: startY },\n' +
    '            pointB: { x: -worldPositionConstraintX, y: worldPositionConstraintY },\n' +
    '            bodyB: bodies[0],\n' +
    '            stiffness: 1,\n' +
    '        }));\n' +
    '        for (i=0;i<menuElements.length-1;i++) {\n' +
    '          World.add(_world, Constraint.create({\n' +
    '            pointA: { x: (bodies[i].height/2-0.5)*Math.cos(startAngle), y: -(bodies[i].height/2-0.5)*Math.sin(startAngle) },\n' +
    '            pointB: { x: -(bodies[i+1].height/2-0.5)*Math.cos(startAngle), y: (bodies[i+1].height/2-0.5)*Math.sin(startAngle) },\n' +
    '            bodyA: bodies[i],\n' +
    '            bodyB: bodies[i+1],\n' +
    '            stiffness: 1,\n' +
    '          }));\n' +
    '        }\n' +
    '        endConstraint = Constraint.create({\n' +
    '            pointA: { x: cumulativeHeight*Math.cos(startAngle), y: startY-cumulativeHeight*Math.sin(startAngle) },\n' +
    '            pointB: { x: (bodies[bodies.length-1].height/2-0.5)*Math.cos(startAngle), y: -(bodies[bodies.length-1].height/2-0.5)*Math.sin(startAngle) },\n' +
    '            bodyB: bodies[bodies.length-1],\n' +
    '            stiffness: 1,\n' +
    '            length: 0.01,\n' +
    '            angularStiffness: 1,\n' +
    '            render: {\n' +
    '                strokeStyle: \'#90EE90\',\n' +
    '                lineWidth: 3\n' +
    '            }\n' +
    '        });\n' +
    '        World.add(_world,endConstraint);\n' +
    ' \n' +
    '        _sceneEvents.push(\n' +
    ' \n' +
    '            Events.on(_engine, \'beforeUpdate\', function(event) {\n' +
    '              if (!on) {\n' +
    '                var engine = event.source;\n' +
    '                var rotX = (bodies[bodies.length-1].height-0.5)*Math.cos(bodies[bodies.length-1].angle)/2;\n' +
    '                var rotY = (bodies[bodies.length-1].height-0.5)*Math.sin(bodies[bodies.length-1].angle)/2;\n' +
    '                var endPoint = Matter.Vector.add(bodies[bodies.length-1].position, {x:rotX, y:rotY});\n' +
    '                var cumulativeHeight = 0;\n' +
    '                for (i=0;i<bodies.length;i++) {\n' +
    '                  cumulativeHeight+=bodies[i].height\n' +
    '                }\n' +
    '                var dest = { x: cumulativeHeight*Math.cos(startAngle), y: startY-cumulativeHeight*Math.sin(startAngle) };\n' +
    '                var dist = Matter.Vector.magnitude(Matter.Vector.sub(dest, endPoint));\n' +
    '                var normal = Matter.Vector.normalise(Matter.Vector.sub(dest, endPoint));\n' +
    '                var vectorToMove = Matter.Vector.add(endPoint, {x:(normal.x*Math.max(dist/50,1)), y:(normal.y*Math.max(dist/70,1))});\n' +
    '                if (dist > 1) {\n' +
    '                  // Moving the menu upwards\n' +
    '                  endConstraint.pointA = vectorToMove;\n' +
    '                }\n' +
    '              }\n' +
    '            })\n' +
    ' \n' +
    '        );\n' +
    ' \n' +
    '        // Events\n' +
    '        var dropdownButton = document.getElementById(\'freefallmenu-button\');\n' +
    '        if (dropdownButton.addEventListener) {\n' +
    '            dropdownButton.addEventListener(\'mouseover\', FreeFallMenu.mouseOver);\n' +
    '            dropdownButton.addEventListener(\'mouseout\', FreeFallMenu.mouseOut);\n' +
    '        } else if (dropdownButton.attachEvent) {\n' +
    '            dropdownButton.attachEvent(\'mouseover\', FreeFallMenu.mouseOver);\n' +
    '            dropdownButton.attachEvent(\'mouseout\', FreeFallMenu.mouseOut);\n' +
    '        }\n' +
    '        for (var i=0;i<menuElements.length;i++) {\n' +
    '          var menuElement = menuElements[i];\n' +
    '          if (menuElement.addEventListener) {\n' +
    '              menuElement.addEventListener(\'mouseover\', FreeFallMenu.mouseOver);\n' +
    '              menuElement.addEventListener(\'mouseout\', FreeFallMenu.mouseOut);\n' +
    '          } else if (menuElement.attachEvent) {\n' +
    '              menuElement.attachEvent(\'mouseover\', FreeFallMenu.mouseOver);\n' +
    '              menuElement.addEventListener(\'mouseout\', FreeFallMenu.mouseOut);\n' +
    '          }\n' +
    '        }\n' +
    ' \n' +
    '    };\n' +
    ' \n' +
    '    FreeFallMenu.mouseOver = function() {\n' +
    '        on = true;\n' +
    '        endConstraint.pointA = null;\n' +
    '    };\n' +
    ' \n' +
    '    FreeFallMenu.mouseOut = function() {\n' +
    '        on = false;\n' +
    '    };\n' +
    ' \n' +
    '    if (window.addEventListener) {\n' +
    '        window.addEventListener(\'load\', FreeFallMenu.init);\n' +
    '    } else if (window.attachEvent) {\n' +
    '        window.attachEvent(\'load\', FreeFallMenu.init);\n' +
    '    }\n' +
    ' \n' +
    '    var startAngle = 50 * Math.PI/180;\n' +
    '    var startY = 200;\n' +
    ' \n' +
    '    FreeFallMenu.reset = function() {\n' +
    ' \n' +
    '        var _world = _engine.world;\n' +
    ' \n' +
    '        World.clear(_world);\n' +
    '        Engine.clear(_engine);\n' +
    ' \n' +
    '        var renderController = _engine.render.controller;\n' +
    '        if (renderController.clear)\n' +
    '            renderController.clear(_engine.render);\n' +
    ' \n' +
    '        for (var i = 0; i < _sceneEvents.length; i++)\n' +
    '            Events.off(_engine, _sceneEvents[i]);\n' +
    '        _sceneEvents = [];\n' +
    ' \n' +
    '        Common._nextId = 0;\n' +
    ' \n' +
    '        _engine.enableSleeping = true;\n' +
    ' \n' +
    '        _mouseConstraint = MouseConstraint.create(_engine);\n' +
    '        World.add(_world, _mouseConstraint);\n' +
    ' \n' +
    '    };\n' +
    ' \n' +
    '})();';
const esprima = require('esprima');
const tokens = esprima.tokenize(source);

var identificadores = tokens.filter(function (el) {
    return (el.type === "Identifier");
});

var listIdentifiers = [];
// identificadores.forEach(function (element) {
//     var indice = arrayObjectIndexOf(listIdentifiers,element.value, "id");
//     if(indice == -1){ // No encontró el identificador, lo agrega.
//         var list = [element.value, 1];
//         listIdentifiers.push.apply(listIdentifiers, list);
//     } else { // Encontró el identificador, suma uno.
//         listIdentifiers[indice].size++;
//     }
// });
var armarArray = [];
identificadores.forEach(function (element) {
    var indice = arrayObjectIndexOf(armarArray,element.value, "id");
    if(indice == -1){ // No encontró el identificador, lo agrega.
        armarArray.push(new Identifier(element.value,1));
    } else { // Encontró el identificador, suma uno.
        armarArray[indice].quantity++;
    }
});

console.log(armarArray);

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