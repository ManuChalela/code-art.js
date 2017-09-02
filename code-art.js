var source = 'var answer = 42; var hola = 5; var isCold = "Si"; answer = 50;';
var sourceR = 'var fs = require(\'fs\');'
var sourceJS = 'function radToDeg(num) {\n' +
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

var sourceAngular = '\'use strict\';\n' +
    '\n' +
    '/* We need to tell ESLint what variables are being exported */\n' +
    '/* exported\n' +
    '  angular,\n' +
    '  msie,\n' +
    '  jqLite,\n' +
    '  jQuery,\n' +
    '  slice,\n' +
    '  splice,\n' +
    '  push,\n' +
    '  toString,\n' +
    '  minErrConfig,\n' +
    '  errorHandlingConfig,\n' +
    '  isValidObjectMaxDepth,\n' +
    '  ngMinErr,\n' +
    '  angularModule,\n' +
    '  uid,\n' +
    '  REGEX_STRING_REGEXP,\n' +
    '  VALIDITY_STATE_PROPERTY,\n' +
    '\n' +
    '  lowercase,\n' +
    '  uppercase,\n' +
    '  manualLowercase,\n' +
    '  manualUppercase,\n' +
    '  nodeName_,\n' +
    '  isArrayLike,\n' +
    '  forEach,\n' +
    '  forEachSorted,\n' +
    '  reverseParams,\n' +
    '  nextUid,\n' +
    '  setHashKey,\n' +
    '  extend,\n' +
    '  toInt,\n' +
    '  inherit,\n' +
    '  merge,\n' +
    '  noop,\n' +
    '  identity,\n' +
    '  valueFn,\n' +
    '  isUndefined,\n' +
    '  isDefined,\n' +
    '  isObject,\n' +
    '  isBlankObject,\n' +
    '  isString,\n' +
    '  isNumber,\n' +
    '  isNumberNaN,\n' +
    '  isDate,\n' +
    '  isError,\n' +
    '  isArray,\n' +
    '  isFunction,\n' +
    '  isRegExp,\n' +
    '  isWindow,\n' +
    '  isScope,\n' +
    '  isFile,\n' +
    '  isFormData,\n' +
    '  isBlob,\n' +
    '  isBoolean,\n' +
    '  isPromiseLike,\n' +
    '  trim,\n' +
    '  escapeForRegexp,\n' +
    '  isElement,\n' +
    '  makeMap,\n' +
    '  includes,\n' +
    '  arrayRemove,\n' +
    '  copy,\n' +
    '  simpleCompare,\n' +
    '  equals,\n' +
    '  csp,\n' +
    '  jq,\n' +
    '  concat,\n' +
    '  sliceArgs,\n' +
    '  bind,\n' +
    '  toJsonReplacer,\n' +
    '  toJson,\n' +
    '  fromJson,\n' +
    '  convertTimezoneToLocal,\n' +
    '  timezoneToOffset,\n' +
    '  startingTag,\n' +
    '  tryDecodeURIComponent,\n' +
    '  parseKeyValue,\n' +
    '  toKeyValue,\n' +
    '  encodeUriSegment,\n' +
    '  encodeUriQuery,\n' +
    '  angularInit,\n' +
    '  bootstrap,\n' +
    '  getTestability,\n' +
    '  snake_case,\n' +
    '  bindJQuery,\n' +
    '  assertArg,\n' +
    '  assertArgFn,\n' +
    '  assertNotHasOwnProperty,\n' +
    '  getter,\n' +
    '  getBlockNodes,\n' +
    '  hasOwnProperty,\n' +
    '  createMap,\n' +
    '  stringify,\n' +
    '\n' +
    '  NODE_TYPE_ELEMENT,\n' +
    '  NODE_TYPE_ATTRIBUTE,\n' +
    '  NODE_TYPE_TEXT,\n' +
    '  NODE_TYPE_COMMENT,\n' +
    '  NODE_TYPE_DOCUMENT,\n' +
    '  NODE_TYPE_DOCUMENT_FRAGMENT\n' +
    '*/\n' +
    '\n' +
    '////////////////////////////////////\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc module\n' +
    ' * @name ng\n' +
    ' * @module ng\n' +
    ' * @installation\n' +
    ' * @description\n' +
    ' *\n' +
    ' * # ng (core module)\n' +
    ' * The ng module is loaded by default when an AngularJS application is started. The module itself\n' +
    ' * contains the essential components for an AngularJS application to function. The table below\n' +
    ' * lists a high level breakdown of each of the services/factories, filters, directives and testing\n' +
    ' * components available within this core module.\n' +
    ' *\n' +
    ' * <div doc-module-components="ng"></div>\n' +
    ' */\n' +
    '\n' +
    'var REGEX_STRING_REGEXP = /^\\/(.+)\\/([a-z]*)$/;\n' +
    '\n' +
    '// The name of a form control\'s ValidityState property.\n' +
    '// This is used so that it\'s possible for internal tests to create mock ValidityStates.\n' +
    'var VALIDITY_STATE_PROPERTY = \'validity\';\n' +
    '\n' +
    '\n' +
    'var hasOwnProperty = Object.prototype.hasOwnProperty;\n' +
    '\n' +
    '/**\n' +
    ' * @private\n' +
    ' *\n' +
    ' * @description Converts the specified string to lowercase.\n' +
    ' * @param {string} string String to be converted to lowercase.\n' +
    ' * @returns {string} Lowercased string.\n' +
    ' */\n' +
    'var lowercase = function(string) {return isString(string) ? string.toLowerCase() : string;};\n' +
    '\n' +
    '/**\n' +
    ' * @private\n' +
    ' *\n' +
    ' * @description Converts the specified string to uppercase.\n' +
    ' * @param {string} string String to be converted to uppercase.\n' +
    ' * @returns {string} Uppercased string.\n' +
    ' */\n' +
    'var uppercase = function(string) {return isString(string) ? string.toUpperCase() : string;};\n' +
    '\n' +
    '\n' +
    'var manualLowercase = function(s) {\n' +
    '  /* eslint-disable no-bitwise */\n' +
    '  return isString(s)\n' +
    '      ? s.replace(/[A-Z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) | 32);})\n' +
    '      : s;\n' +
    '  /* eslint-enable */\n' +
    '};\n' +
    'var manualUppercase = function(s) {\n' +
    '  /* eslint-disable no-bitwise */\n' +
    '  return isString(s)\n' +
    '      ? s.replace(/[a-z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) & ~32);})\n' +
    '      : s;\n' +
    '  /* eslint-enable */\n' +
    '};\n' +
    '\n' +
    '\n' +
    '// String#toLowerCase and String#toUpperCase don\'t produce correct results in browsers with Turkish\n' +
    '// locale, for this reason we need to detect this case and redefine lowercase/uppercase methods\n' +
    '// with correct but slower alternatives. See https://github.com/angular/angular.js/issues/11387\n' +
    'if (\'i\' !== \'I\'.toLowerCase()) {\n' +
    '  lowercase = manualLowercase;\n' +
    '  uppercase = manualUppercase;\n' +
    '}\n' +
    '\n' +
    '\n' +
    'var\n' +
    '    msie,             // holds major version number for IE, or NaN if UA is not IE.\n' +
    '    jqLite,           // delay binding since jQuery could be loaded after us.\n' +
    '    jQuery,           // delay binding\n' +
    '    slice             = [].slice,\n' +
    '    splice            = [].splice,\n' +
    '    push              = [].push,\n' +
    '    toString          = Object.prototype.toString,\n' +
    '    getPrototypeOf    = Object.getPrototypeOf,\n' +
    '    ngMinErr          = minErr(\'ng\'),\n' +
    '\n' +
    '    /** @name angular */\n' +
    '    angular           = window.angular || (window.angular = {}),\n' +
    '    angularModule,\n' +
    '    uid               = 0;\n' +
    '\n' +
    '// Support: IE 9-11 only\n' +
    '/**\n' +
    ' * documentMode is an IE-only property\n' +
    ' * http://msdn.microsoft.com/en-us/library/ie/cc196988(v=vs.85).aspx\n' +
    ' */\n' +
    'msie = window.document.documentMode;\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @private\n' +
    ' * @param {*} obj\n' +
    ' * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,\n' +
    ' *                   String ...)\n' +
    ' */\n' +
    'function isArrayLike(obj) {\n' +
    '\n' +
    '  // `null`, `undefined` and `window` are not array-like\n' +
    '  if (obj == null || isWindow(obj)) return false;\n' +
    '\n' +
    '  // arrays, strings and jQuery/jqLite objects are array like\n' +
    '  // * jqLite is either the jQuery or jqLite constructor function\n' +
    '  // * we have to check the existence of jqLite first as this method is called\n' +
    '  //   via the forEach method when constructing the jqLite object in the first place\n' +
    '  if (isArray(obj) || isString(obj) || (jqLite && obj instanceof jqLite)) return true;\n' +
    '\n' +
    '  // Support: iOS 8.2 (not reproducible in simulator)\n' +
    '  // "length" in obj used to prevent JIT error (gh-11508)\n' +
    '  var length = \'length\' in Object(obj) && obj.length;\n' +
    '\n' +
    '  // NodeList objects (with `item` method) and\n' +
    '  // other objects with suitable length characteristics are array-like\n' +
    '  return isNumber(length) &&\n' +
    '    (length >= 0 && ((length - 1) in obj || obj instanceof Array) || typeof obj.item === \'function\');\n' +
    '\n' +
    '}\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.forEach\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Invokes the `iterator` function once for each item in `obj` collection, which can be either an\n' +
    ' * object or an array. The `iterator` function is invoked with `iterator(value, key, obj)`, where `value`\n' +
    ' * is the value of an object property or an array element, `key` is the object property key or\n' +
    ' * array element index and obj is the `obj` itself. Specifying a `context` for the function is optional.\n' +
    ' *\n' +
    ' * It is worth noting that `.forEach` does not iterate over inherited properties because it filters\n' +
    ' * using the `hasOwnProperty` method.\n' +
    ' *\n' +
    ' * Unlike ES262\'s\n' +
    ' * [Array.prototype.forEach](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18),\n' +
    ' * providing \'undefined\' or \'null\' values for `obj` will not throw a TypeError, but rather just\n' +
    ' * return the value provided.\n' +
    ' *\n' +
    '   ```js\n' +
    '     var values = {name: \'misko\', gender: \'male\'};\n' +
    '     var log = [];\n' +
    '     angular.forEach(values, function(value, key) {\n' +
    '       this.push(key + \': \' + value);\n' +
    '     }, log);\n' +
    '     expect(log).toEqual([\'name: misko\', \'gender: male\']);\n' +
    '   ```\n' +
    ' *\n' +
    ' * @param {Object|Array} obj Object to iterate over.\n' +
    ' * @param {Function} iterator Iterator function.\n' +
    ' * @param {Object=} context Object to become context (`this`) for the iterator function.\n' +
    ' * @returns {Object|Array} Reference to `obj`.\n' +
    ' */\n' +
    '\n' +
    'function forEach(obj, iterator, context) {\n' +
    '  var key, length;\n' +
    '  if (obj) {\n' +
    '    if (isFunction(obj)) {\n' +
    '      for (key in obj) {\n' +
    '        if (key !== \'prototype\' && key !== \'length\' && key !== \'name\' && obj.hasOwnProperty(key)) {\n' +
    '          iterator.call(context, obj[key], key, obj);\n' +
    '        }\n' +
    '      }\n' +
    '    } else if (isArray(obj) || isArrayLike(obj)) {\n' +
    '      var isPrimitive = typeof obj !== \'object\';\n' +
    '      for (key = 0, length = obj.length; key < length; key++) {\n' +
    '        if (isPrimitive || key in obj) {\n' +
    '          iterator.call(context, obj[key], key, obj);\n' +
    '        }\n' +
    '      }\n' +
    '    } else if (obj.forEach && obj.forEach !== forEach) {\n' +
    '        obj.forEach(iterator, context, obj);\n' +
    '    } else if (isBlankObject(obj)) {\n' +
    '      // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty\n' +
    '      for (key in obj) {\n' +
    '        iterator.call(context, obj[key], key, obj);\n' +
    '      }\n' +
    '    } else if (typeof obj.hasOwnProperty === \'function\') {\n' +
    '      // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed\n' +
    '      for (key in obj) {\n' +
    '        if (obj.hasOwnProperty(key)) {\n' +
    '          iterator.call(context, obj[key], key, obj);\n' +
    '        }\n' +
    '      }\n' +
    '    } else {\n' +
    '      // Slow path for objects which do not have a method `hasOwnProperty`\n' +
    '      for (key in obj) {\n' +
    '        if (hasOwnProperty.call(obj, key)) {\n' +
    '          iterator.call(context, obj[key], key, obj);\n' +
    '        }\n' +
    '      }\n' +
    '    }\n' +
    '  }\n' +
    '  return obj;\n' +
    '}\n' +
    '\n' +
    'function forEachSorted(obj, iterator, context) {\n' +
    '  var keys = Object.keys(obj).sort();\n' +
    '  for (var i = 0; i < keys.length; i++) {\n' +
    '    iterator.call(context, obj[keys[i]], keys[i]);\n' +
    '  }\n' +
    '  return keys;\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * when using forEach the params are value, key, but it is often useful to have key, value.\n' +
    ' * @param {function(string, *)} iteratorFn\n' +
    ' * @returns {function(*, string)}\n' +
    ' */\n' +
    'function reverseParams(iteratorFn) {\n' +
    '  return function(value, key) {iteratorFn(key, value);};\n' +
    '}\n' +
    '\n' +
    '/**\n' +
    ' * A consistent way of creating unique IDs in angular.\n' +
    ' *\n' +
    ' * Using simple numbers allows us to generate 28.6 million unique ids per second for 10 years before\n' +
    ' * we hit number precision issues in JavaScript.\n' +
    ' *\n' +
    ' * Math.pow(2,53) / 60 / 60 / 24 / 365 / 10 = 28.6M\n' +
    ' *\n' +
    ' * @returns {number} an unique alpha-numeric string\n' +
    ' */\n' +
    'function nextUid() {\n' +
    '  return ++uid;\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * Set or clear the hashkey for an object.\n' +
    ' * @param obj object\n' +
    ' * @param h the hashkey (!truthy to delete the hashkey)\n' +
    ' */\n' +
    'function setHashKey(obj, h) {\n' +
    '  if (h) {\n' +
    '    obj.$$hashKey = h;\n' +
    '  } else {\n' +
    '    delete obj.$$hashKey;\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '\n' +
    'function baseExtend(dst, objs, deep) {\n' +
    '  var h = dst.$$hashKey;\n' +
    '\n' +
    '  for (var i = 0, ii = objs.length; i < ii; ++i) {\n' +
    '    var obj = objs[i];\n' +
    '    if (!isObject(obj) && !isFunction(obj)) continue;\n' +
    '    var keys = Object.keys(obj);\n' +
    '    for (var j = 0, jj = keys.length; j < jj; j++) {\n' +
    '      var key = keys[j];\n' +
    '      var src = obj[key];\n' +
    '\n' +
    '      if (deep && isObject(src)) {\n' +
    '        if (isDate(src)) {\n' +
    '          dst[key] = new Date(src.valueOf());\n' +
    '        } else if (isRegExp(src)) {\n' +
    '          dst[key] = new RegExp(src);\n' +
    '        } else if (src.nodeName) {\n' +
    '          dst[key] = src.cloneNode(true);\n' +
    '        } else if (isElement(src)) {\n' +
    '          dst[key] = src.clone();\n' +
    '        } else {\n' +
    '          if (!isObject(dst[key])) dst[key] = isArray(src) ? [] : {};\n' +
    '          baseExtend(dst[key], [src], true);\n' +
    '        }\n' +
    '      } else {\n' +
    '        dst[key] = src;\n' +
    '      }\n' +
    '    }\n' +
    '  }\n' +
    '\n' +
    '  setHashKey(dst, h);\n' +
    '  return dst;\n' +
    '}\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.extend\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Extends the destination object `dst` by copying own enumerable properties from the `src` object(s)\n' +
    ' * to `dst`. You can specify multiple `src` objects. If you want to preserve original objects, you can do so\n' +
    ' * by passing an empty object as the target: `var object = angular.extend({}, object1, object2)`.\n' +
    ' *\n' +
    ' * **Note:** Keep in mind that `angular.extend` does not support recursive merge (deep copy). Use\n' +
    ' * {@link angular.merge} for this.\n' +
    ' *\n' +
    ' * @param {Object} dst Destination object.\n' +
    ' * @param {...Object} src Source object(s).\n' +
    ' * @returns {Object} Reference to `dst`.\n' +
    ' */\n' +
    'function extend(dst) {\n' +
    '  return baseExtend(dst, slice.call(arguments, 1), false);\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    '* @ngdoc function\n' +
    '* @name angular.merge\n' +
    '* @module ng\n' +
    '* @kind function\n' +
    '*\n' +
    '* @description\n' +
    '* Deeply extends the destination object `dst` by copying own enumerable properties from the `src` object(s)\n' +
    '* to `dst`. You can specify multiple `src` objects. If you want to preserve original objects, you can do so\n' +
    '* by passing an empty object as the target: `var object = angular.merge({}, object1, object2)`.\n' +
    '*\n' +
    '* Unlike {@link angular.extend extend()}, `merge()` recursively descends into object properties of source\n' +
    '* objects, performing a deep copy.\n' +
    '*\n' +
    '* @deprecated\n' +
    '* sinceVersion="1.6.5"\n' +
    '* This function is deprecated, but will not be removed in the 1.x lifecycle.\n' +
    '* There are edge cases (see {@link angular.merge#known-issues known issues}) that are not\n' +
    '* supported by this function. We suggest\n' +
    '* using [lodash\'s merge()](https://lodash.com/docs/4.17.4#merge) instead.\n' +
    '*\n' +
    '* @knownIssue\n' +
    '* This is a list of (known) object types that are not handled correctly by this function:\n' +
    '* - [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)\n' +
    '* - [`MediaStream`](https://developer.mozilla.org/docs/Web/API/MediaStream)\n' +
    '* - [`CanvasGradient`](https://developer.mozilla.org/docs/Web/API/CanvasGradient)\n' +
    '* - AngularJS {@link $rootScope.Scope scopes};\n' +
    '*\n' +
    '* @param {Object} dst Destination object.\n' +
    '* @param {...Object} src Source object(s).\n' +
    '* @returns {Object} Reference to `dst`.\n' +
    '*/\n' +
    'function merge(dst) {\n' +
    '  return baseExtend(dst, slice.call(arguments, 1), true);\n' +
    '}\n' +
    '\n' +
    '\n' +
    '\n' +
    'function toInt(str) {\n' +
    '  return parseInt(str, 10);\n' +
    '}\n' +
    '\n' +
    'var isNumberNaN = Number.isNaN || function isNumberNaN(num) {\n' +
    '  // eslint-disable-next-line no-self-compare\n' +
    '  return num !== num;\n' +
    '};\n' +
    '\n' +
    '\n' +
    'function inherit(parent, extra) {\n' +
    '  return extend(Object.create(parent), extra);\n' +
    '}\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.noop\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * A function that performs no operations. This function can be useful when writing code in the\n' +
    ' * functional style.\n' +
    '   ```js\n' +
    '     function foo(callback) {\n' +
    '       var result = calculateResult();\n' +
    '       (callback || angular.noop)(result);\n' +
    '     }\n' +
    '   ```\n' +
    ' */\n' +
    'function noop() {}\n' +
    'noop.$inject = [];\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.identity\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * A function that returns its first argument. This function is useful when writing code in the\n' +
    ' * functional style.\n' +
    ' *\n' +
    '   ```js\n' +
    '   function transformer(transformationFn, value) {\n' +
    '     return (transformationFn || angular.identity)(value);\n' +
    '   };\n' +
    '\n' +
    '   // E.g.\n' +
    '   function getResult(fn, input) {\n' +
    '     return (fn || angular.identity)(input);\n' +
    '   };\n' +
    '\n' +
    '   getResult(function(n) { return n * 2; }, 21);   // returns 42\n' +
    '   getResult(null, 21);                            // returns 21\n' +
    '   getResult(undefined, 21);                       // returns 21\n' +
    '   ```\n' +
    ' *\n' +
    ' * @param {*} value to be returned.\n' +
    ' * @returns {*} the value passed in.\n' +
    ' */\n' +
    'function identity($) {return $;}\n' +
    'identity.$inject = [];\n' +
    '\n' +
    '\n' +
    'function valueFn(value) {return function valueRef() {return value;};}\n' +
    '\n' +
    'function hasCustomToString(obj) {\n' +
    '  return isFunction(obj.toString) && obj.toString !== toString;\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.isUndefined\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Determines if a reference is undefined.\n' +
    ' *\n' +
    ' * @param {*} value Reference to check.\n' +
    ' * @returns {boolean} True if `value` is undefined.\n' +
    ' */\n' +
    'function isUndefined(value) {return typeof value === \'undefined\';}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.isDefined\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Determines if a reference is defined.\n' +
    ' *\n' +
    ' * @param {*} value Reference to check.\n' +
    ' * @returns {boolean} True if `value` is defined.\n' +
    ' */\n' +
    'function isDefined(value) {return typeof value !== \'undefined\';}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.isObject\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not\n' +
    ' * considered to be objects. Note that JavaScript arrays are objects.\n' +
    ' *\n' +
    ' * @param {*} value Reference to check.\n' +
    ' * @returns {boolean} True if `value` is an `Object` but not `null`.\n' +
    ' */\n' +
    'function isObject(value) {\n' +
    '  // http://jsperf.com/isobject4\n' +
    '  return value !== null && typeof value === \'object\';\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * Determine if a value is an object with a null prototype\n' +
    ' *\n' +
    ' * @returns {boolean} True if `value` is an `Object` with a null prototype\n' +
    ' */\n' +
    'function isBlankObject(value) {\n' +
    '  return value !== null && typeof value === \'object\' && !getPrototypeOf(value);\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.isString\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Determines if a reference is a `String`.\n' +
    ' *\n' +
    ' * @param {*} value Reference to check.\n' +
    ' * @returns {boolean} True if `value` is a `String`.\n' +
    ' */\n' +
    'function isString(value) {return typeof value === \'string\';}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.isNumber\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Determines if a reference is a `Number`.\n' +
    ' *\n' +
    ' * This includes the "special" numbers `NaN`, `+Infinity` and `-Infinity`.\n' +
    ' *\n' +
    ' * If you wish to exclude these then you can use the native\n' +
    ' * [`isFinite\'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)\n' +
    ' * method.\n' +
    ' *\n' +
    ' * @param {*} value Reference to check.\n' +
    ' * @returns {boolean} True if `value` is a `Number`.\n' +
    ' */\n' +
    'function isNumber(value) {return typeof value === \'number\';}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.isDate\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Determines if a value is a date.\n' +
    ' *\n' +
    ' * @param {*} value Reference to check.\n' +
    ' * @returns {boolean} True if `value` is a `Date`.\n' +
    ' */\n' +
    'function isDate(value) {\n' +
    '  return toString.call(value) === \'[object Date]\';\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.isArray\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Determines if a reference is an `Array`. Alias of Array.isArray.\n' +
    ' *\n' +
    ' * @param {*} value Reference to check.\n' +
    ' * @returns {boolean} True if `value` is an `Array`.\n' +
    ' */\n' +
    'var isArray = Array.isArray;\n' +
    '\n' +
    '/**\n' +
    ' * @description\n' +
    ' * Determines if a reference is an `Error`.\n' +
    ' * Loosely based on https://www.npmjs.com/package/iserror\n' +
    ' *\n' +
    ' * @param {*} value Reference to check.\n' +
    ' * @returns {boolean} True if `value` is an `Error`.\n' +
    ' */\n' +
    'function isError(value) {\n' +
    '  var tag = toString.call(value);\n' +
    '  switch (tag) {\n' +
    '    case \'[object Error]\': return true;\n' +
    '    case \'[object Exception]\': return true;\n' +
    '    case \'[object DOMException]\': return true;\n' +
    '    default: return value instanceof Error;\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.isFunction\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Determines if a reference is a `Function`.\n' +
    ' *\n' +
    ' * @param {*} value Reference to check.\n' +
    ' * @returns {boolean} True if `value` is a `Function`.\n' +
    ' */\n' +
    'function isFunction(value) {return typeof value === \'function\';}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * Determines if a value is a regular expression object.\n' +
    ' *\n' +
    ' * @private\n' +
    ' * @param {*} value Reference to check.\n' +
    ' * @returns {boolean} True if `value` is a `RegExp`.\n' +
    ' */\n' +
    'function isRegExp(value) {\n' +
    '  return toString.call(value) === \'[object RegExp]\';\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * Checks if `obj` is a window object.\n' +
    ' *\n' +
    ' * @private\n' +
    ' * @param {*} obj Object to check\n' +
    ' * @returns {boolean} True if `obj` is a window obj.\n' +
    ' */\n' +
    'function isWindow(obj) {\n' +
    '  return obj && obj.window === obj;\n' +
    '}\n' +
    '\n' +
    '\n' +
    'function isScope(obj) {\n' +
    '  return obj && obj.$evalAsync && obj.$watch;\n' +
    '}\n' +
    '\n' +
    '\n' +
    'function isFile(obj) {\n' +
    '  return toString.call(obj) === \'[object File]\';\n' +
    '}\n' +
    '\n' +
    '\n' +
    'function isFormData(obj) {\n' +
    '  return toString.call(obj) === \'[object FormData]\';\n' +
    '}\n' +
    '\n' +
    '\n' +
    'function isBlob(obj) {\n' +
    '  return toString.call(obj) === \'[object Blob]\';\n' +
    '}\n' +
    '\n' +
    '\n' +
    'function isBoolean(value) {\n' +
    '  return typeof value === \'boolean\';\n' +
    '}\n' +
    '\n' +
    '\n' +
    'function isPromiseLike(obj) {\n' +
    '  return obj && isFunction(obj.then);\n' +
    '}\n' +
    '\n' +
    '\n' +
    'var TYPED_ARRAY_REGEXP = /^\\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array]$/;\n' +
    'function isTypedArray(value) {\n' +
    '  return value && isNumber(value.length) && TYPED_ARRAY_REGEXP.test(toString.call(value));\n' +
    '}\n' +
    '\n' +
    'function isArrayBuffer(obj) {\n' +
    '  return toString.call(obj) === \'[object ArrayBuffer]\';\n' +
    '}\n' +
    '\n' +
    '\n' +
    'var trim = function(value) {\n' +
    '  return isString(value) ? value.trim() : value;\n' +
    '};\n' +
    '\n' +
    '// Copied from:\n' +
    '// http://docs.closure-library.googlecode.com/git/local_closure_goog_string_string.js.source.html#line1021\n' +
    '// Prereq: s is a string.\n' +
    'var escapeForRegexp = function(s) {\n' +
    '  return s\n' +
    '    .replace(/([-()[\\]{}+?*.$^|,:#<!\\\\])/g, \'\\\\$1\')\n' +
    '    // eslint-disable-next-line no-control-regex\n' +
    '    .replace(/\x08/g, \'\\\x08\');\n' +
    '};\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.isElement\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Determines if a reference is a DOM element (or wrapped jQuery element).\n' +
    ' *\n' +
    ' * @param {*} value Reference to check.\n' +
    ' * @returns {boolean} True if `value` is a DOM element (or wrapped jQuery element).\n' +
    ' */\n' +
    'function isElement(node) {\n' +
    '  return !!(node &&\n' +
    '    (node.nodeName  // We are a direct element.\n' +
    '    || (node.prop && node.attr && node.find)));  // We have an on and find method part of jQuery API.\n' +
    '}\n' +
    '\n' +
    '/**\n' +
    ' * @param str \'key1,key2,...\'\n' +
    ' * @returns {object} in the form of {key1:true, key2:true, ...}\n' +
    ' */\n' +
    'function makeMap(str) {\n' +
    '  var obj = {}, items = str.split(\',\'), i;\n' +
    '  for (i = 0; i < items.length; i++) {\n' +
    '    obj[items[i]] = true;\n' +
    '  }\n' +
    '  return obj;\n' +
    '}\n' +
    '\n' +
    '\n' +
    'function nodeName_(element) {\n' +
    '  return lowercase(element.nodeName || (element[0] && element[0].nodeName));\n' +
    '}\n' +
    '\n' +
    'function includes(array, obj) {\n' +
    '  return Array.prototype.indexOf.call(array, obj) !== -1;\n' +
    '}\n' +
    '\n' +
    'function arrayRemove(array, value) {\n' +
    '  var index = array.indexOf(value);\n' +
    '  if (index >= 0) {\n' +
    '    array.splice(index, 1);\n' +
    '  }\n' +
    '  return index;\n' +
    '}\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.copy\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Creates a deep copy of `source`, which should be an object or an array.\n' +
    ' *\n' +
    ' * * If no destination is supplied, a copy of the object or array is created.\n' +
    ' * * If a destination is provided, all of its elements (for arrays) or properties (for objects)\n' +
    ' *   are deleted and then all elements/properties from the source are copied to it.\n' +
    ' * * If `source` is not an object or array (inc. `null` and `undefined`), `source` is returned.\n' +
    ' * * If `source` is identical to `destination` an exception will be thrown.\n' +
    ' *\n' +
    ' * <br />\n' +
    ' * <div class="alert alert-warning">\n' +
    ' *   Only enumerable properties are taken into account. Non-enumerable properties (both on `source`\n' +
    ' *   and on `destination`) will be ignored.\n' +
    ' * </div>\n' +
    ' *\n' +
    ' * @param {*} source The source that will be used to make a copy.\n' +
    ' *                   Can be any type, including primitives, `null`, and `undefined`.\n' +
    ' * @param {(Object|Array)=} destination Destination into which the source is copied. If\n' +
    ' *     provided, must be of the same type as `source`.\n' +
    ' * @returns {*} The copy or updated `destination`, if `destination` was specified.\n' +
    ' *\n' +
    ' * @example\n' +
    '  <example module="copyExample" name="angular-copy">\n' +
    '    <file name="index.html">\n' +
    '      <div ng-controller="ExampleController">\n' +
    '        <form novalidate class="simple-form">\n' +
    '          <label>Name: <input type="text" ng-model="user.name" /></label><br />\n' +
    '          <label>Age:  <input type="number" ng-model="user.age" /></label><br />\n' +
    '          Gender: <label><input type="radio" ng-model="user.gender" value="male" />male</label>\n' +
    '                  <label><input type="radio" ng-model="user.gender" value="female" />female</label><br />\n' +
    '          <button ng-click="reset()">RESET</button>\n' +
    '          <button ng-click="update(user)">SAVE</button>\n' +
    '        </form>\n' +
    '        <pre>form = {{user | json}}</pre>\n' +
    '        <pre>leader = {{leader | json}}</pre>\n' +
    '      </div>\n' +
    '    </file>\n' +
    '    <file name="script.js">\n' +
    '      // Module: copyExample\n' +
    '      angular.\n' +
    '        module(\'copyExample\', []).\n' +
    '        controller(\'ExampleController\', [\'$scope\', function($scope) {\n' +
    '          $scope.leader = {};\n' +
    '\n' +
    '          $scope.reset = function() {\n' +
    '            // Example with 1 argument\n' +
    '            $scope.user = angular.copy($scope.leader);\n' +
    '          };\n' +
    '\n' +
    '          $scope.update = function(user) {\n' +
    '            // Example with 2 arguments\n' +
    '            angular.copy(user, $scope.leader);\n' +
    '          };\n' +
    '\n' +
    '          $scope.reset();\n' +
    '        }]);\n' +
    '    </file>\n' +
    '  </example>\n' +
    ' */\n' +
    'function copy(source, destination, maxDepth) {\n' +
    '  var stackSource = [];\n' +
    '  var stackDest = [];\n' +
    '  maxDepth = isValidObjectMaxDepth(maxDepth) ? maxDepth : NaN;\n' +
    '\n' +
    '  if (destination) {\n' +
    '    if (isTypedArray(destination) || isArrayBuffer(destination)) {\n' +
    '      throw ngMinErr(\'cpta\', \'Can\\\'t copy! TypedArray destination cannot be mutated.\');\n' +
    '    }\n' +
    '    if (source === destination) {\n' +
    '      throw ngMinErr(\'cpi\', \'Can\\\'t copy! Source and destination are identical.\');\n' +
    '    }\n' +
    '\n' +
    '    // Empty the destination object\n' +
    '    if (isArray(destination)) {\n' +
    '      destination.length = 0;\n' +
    '    } else {\n' +
    '      forEach(destination, function(value, key) {\n' +
    '        if (key !== \'$$hashKey\') {\n' +
    '          delete destination[key];\n' +
    '        }\n' +
    '      });\n' +
    '    }\n' +
    '\n' +
    '    stackSource.push(source);\n' +
    '    stackDest.push(destination);\n' +
    '    return copyRecurse(source, destination, maxDepth);\n' +
    '  }\n' +
    '\n' +
    '  return copyElement(source, maxDepth);\n' +
    '\n' +
    '  function copyRecurse(source, destination, maxDepth) {\n' +
    '    maxDepth--;\n' +
    '    if (maxDepth < 0) {\n' +
    '      return \'...\';\n' +
    '    }\n' +
    '    var h = destination.$$hashKey;\n' +
    '    var key;\n' +
    '    if (isArray(source)) {\n' +
    '      for (var i = 0, ii = source.length; i < ii; i++) {\n' +
    '        destination.push(copyElement(source[i], maxDepth));\n' +
    '      }\n' +
    '    } else if (isBlankObject(source)) {\n' +
    '      // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty\n' +
    '      for (key in source) {\n' +
    '        destination[key] = copyElement(source[key], maxDepth);\n' +
    '      }\n' +
    '    } else if (source && typeof source.hasOwnProperty === \'function\') {\n' +
    '      // Slow path, which must rely on hasOwnProperty\n' +
    '      for (key in source) {\n' +
    '        if (source.hasOwnProperty(key)) {\n' +
    '          destination[key] = copyElement(source[key], maxDepth);\n' +
    '        }\n' +
    '      }\n' +
    '    } else {\n' +
    '      // Slowest path --- hasOwnProperty can\'t be called as a method\n' +
    '      for (key in source) {\n' +
    '        if (hasOwnProperty.call(source, key)) {\n' +
    '          destination[key] = copyElement(source[key], maxDepth);\n' +
    '        }\n' +
    '      }\n' +
    '    }\n' +
    '    setHashKey(destination, h);\n' +
    '    return destination;\n' +
    '  }\n' +
    '\n' +
    '  function copyElement(source, maxDepth) {\n' +
    '    // Simple values\n' +
    '    if (!isObject(source)) {\n' +
    '      return source;\n' +
    '    }\n' +
    '\n' +
    '    // Already copied values\n' +
    '    var index = stackSource.indexOf(source);\n' +
    '    if (index !== -1) {\n' +
    '      return stackDest[index];\n' +
    '    }\n' +
    '\n' +
    '    if (isWindow(source) || isScope(source)) {\n' +
    '      throw ngMinErr(\'cpws\',\n' +
    '        \'Can\\\'t copy! Making copies of Window or Scope instances is not supported.\');\n' +
    '    }\n' +
    '\n' +
    '    var needsRecurse = false;\n' +
    '    var destination = copyType(source);\n' +
    '\n' +
    '    if (destination === undefined) {\n' +
    '      destination = isArray(source) ? [] : Object.create(getPrototypeOf(source));\n' +
    '      needsRecurse = true;\n' +
    '    }\n' +
    '\n' +
    '    stackSource.push(source);\n' +
    '    stackDest.push(destination);\n' +
    '\n' +
    '    return needsRecurse\n' +
    '      ? copyRecurse(source, destination, maxDepth)\n' +
    '      : destination;\n' +
    '  }\n' +
    '\n' +
    '  function copyType(source) {\n' +
    '    switch (toString.call(source)) {\n' +
    '      case \'[object Int8Array]\':\n' +
    '      case \'[object Int16Array]\':\n' +
    '      case \'[object Int32Array]\':\n' +
    '      case \'[object Float32Array]\':\n' +
    '      case \'[object Float64Array]\':\n' +
    '      case \'[object Uint8Array]\':\n' +
    '      case \'[object Uint8ClampedArray]\':\n' +
    '      case \'[object Uint16Array]\':\n' +
    '      case \'[object Uint32Array]\':\n' +
    '        return new source.constructor(copyElement(source.buffer), source.byteOffset, source.length);\n' +
    '\n' +
    '      case \'[object ArrayBuffer]\':\n' +
    '        // Support: IE10\n' +
    '        if (!source.slice) {\n' +
    '          // If we\'re in this case we know the environment supports ArrayBuffer\n' +
    '          /* eslint-disable no-undef */\n' +
    '          var copied = new ArrayBuffer(source.byteLength);\n' +
    '          new Uint8Array(copied).set(new Uint8Array(source));\n' +
    '          /* eslint-enable */\n' +
    '          return copied;\n' +
    '        }\n' +
    '        return source.slice(0);\n' +
    '\n' +
    '      case \'[object Boolean]\':\n' +
    '      case \'[object Number]\':\n' +
    '      case \'[object String]\':\n' +
    '      case \'[object Date]\':\n' +
    '        return new source.constructor(source.valueOf());\n' +
    '\n' +
    '      case \'[object RegExp]\':\n' +
    '        var re = new RegExp(source.source, source.toString().match(/[^/]*$/)[0]);\n' +
    '        re.lastIndex = source.lastIndex;\n' +
    '        return re;\n' +
    '\n' +
    '      case \'[object Blob]\':\n' +
    '        return new source.constructor([source], {type: source.type});\n' +
    '    }\n' +
    '\n' +
    '    if (isFunction(source.cloneNode)) {\n' +
    '      return source.cloneNode(true);\n' +
    '    }\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '\n' +
    '// eslint-disable-next-line no-self-compare\n' +
    'function simpleCompare(a, b) { return a === b || (a !== a && b !== b); }\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.equals\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Determines if two objects or two values are equivalent. Supports value types, regular\n' +
    ' * expressions, arrays and objects.\n' +
    ' *\n' +
    ' * Two objects or values are considered equivalent if at least one of the following is true:\n' +
    ' *\n' +
    ' * * Both objects or values pass `===` comparison.\n' +
    ' * * Both objects or values are of the same type and all of their properties are equal by\n' +
    ' *   comparing them with `angular.equals`.\n' +
    ' * * Both values are NaN. (In JavaScript, NaN == NaN => false. But we consider two NaN as equal)\n' +
    ' * * Both values represent the same regular expression (In JavaScript,\n' +
    ' *   /abc/ == /abc/ => false. But we consider two regular expressions as equal when their textual\n' +
    ' *   representation matches).\n' +
    ' *\n' +
    ' * During a property comparison, properties of `function` type and properties with names\n' +
    ' * that begin with `$` are ignored.\n' +
    ' *\n' +
    ' * Scope and DOMWindow objects are being compared only by identify (`===`).\n' +
    ' *\n' +
    ' * @param {*} o1 Object or value to compare.\n' +
    ' * @param {*} o2 Object or value to compare.\n' +
    ' * @returns {boolean} True if arguments are equal.\n' +
    ' *\n' +
    ' * @example\n' +
    '   <example module="equalsExample" name="equalsExample">\n' +
    '     <file name="index.html">\n' +
    '      <div ng-controller="ExampleController">\n' +
    '        <form novalidate>\n' +
    '          <h3>User 1</h3>\n' +
    '          Name: <input type="text" ng-model="user1.name">\n' +
    '          Age: <input type="number" ng-model="user1.age">\n' +
    '\n' +
    '          <h3>User 2</h3>\n' +
    '          Name: <input type="text" ng-model="user2.name">\n' +
    '          Age: <input type="number" ng-model="user2.age">\n' +
    '\n' +
    '          <div>\n' +
    '            <br/>\n' +
    '            <input type="button" value="Compare" ng-click="compare()">\n' +
    '          </div>\n' +
    '          User 1: <pre>{{user1 | json}}</pre>\n' +
    '          User 2: <pre>{{user2 | json}}</pre>\n' +
    '          Equal: <pre>{{result}}</pre>\n' +
    '        </form>\n' +
    '      </div>\n' +
    '    </file>\n' +
    '    <file name="script.js">\n' +
    '        angular.module(\'equalsExample\', []).controller(\'ExampleController\', [\'$scope\', function($scope) {\n' +
    '          $scope.user1 = {};\n' +
    '          $scope.user2 = {};\n' +
    '          $scope.compare = function() {\n' +
    '            $scope.result = angular.equals($scope.user1, $scope.user2);\n' +
    '          };\n' +
    '        }]);\n' +
    '    </file>\n' +
    '  </example>\n' +
    ' */\n' +
    'function equals(o1, o2) {\n' +
    '  if (o1 === o2) return true;\n' +
    '  if (o1 === null || o2 === null) return false;\n' +
    '  // eslint-disable-next-line no-self-compare\n' +
    '  if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN\n' +
    '  var t1 = typeof o1, t2 = typeof o2, length, key, keySet;\n' +
    '  if (t1 === t2 && t1 === \'object\') {\n' +
    '    if (isArray(o1)) {\n' +
    '      if (!isArray(o2)) return false;\n' +
    '      if ((length = o1.length) === o2.length) {\n' +
    '        for (key = 0; key < length; key++) {\n' +
    '          if (!equals(o1[key], o2[key])) return false;\n' +
    '        }\n' +
    '        return true;\n' +
    '      }\n' +
    '    } else if (isDate(o1)) {\n' +
    '      if (!isDate(o2)) return false;\n' +
    '      return simpleCompare(o1.getTime(), o2.getTime());\n' +
    '    } else if (isRegExp(o1)) {\n' +
    '      if (!isRegExp(o2)) return false;\n' +
    '      return o1.toString() === o2.toString();\n' +
    '    } else {\n' +
    '      if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) ||\n' +
    '        isArray(o2) || isDate(o2) || isRegExp(o2)) return false;\n' +
    '      keySet = createMap();\n' +
    '      for (key in o1) {\n' +
    '        if (key.charAt(0) === \'$\' || isFunction(o1[key])) continue;\n' +
    '        if (!equals(o1[key], o2[key])) return false;\n' +
    '        keySet[key] = true;\n' +
    '      }\n' +
    '      for (key in o2) {\n' +
    '        if (!(key in keySet) &&\n' +
    '            key.charAt(0) !== \'$\' &&\n' +
    '            isDefined(o2[key]) &&\n' +
    '            !isFunction(o2[key])) return false;\n' +
    '      }\n' +
    '      return true;\n' +
    '    }\n' +
    '  }\n' +
    '  return false;\n' +
    '}\n' +
    '\n' +
    'var csp = function() {\n' +
    '  if (!isDefined(csp.rules)) {\n' +
    '\n' +
    '\n' +
    '    var ngCspElement = (window.document.querySelector(\'[ng-csp]\') ||\n' +
    '                    window.document.querySelector(\'[data-ng-csp]\'));\n' +
    '\n' +
    '    if (ngCspElement) {\n' +
    '      var ngCspAttribute = ngCspElement.getAttribute(\'ng-csp\') ||\n' +
    '                    ngCspElement.getAttribute(\'data-ng-csp\');\n' +
    '      csp.rules = {\n' +
    '        noUnsafeEval: !ngCspAttribute || (ngCspAttribute.indexOf(\'no-unsafe-eval\') !== -1),\n' +
    '        noInlineStyle: !ngCspAttribute || (ngCspAttribute.indexOf(\'no-inline-style\') !== -1)\n' +
    '      };\n' +
    '    } else {\n' +
    '      csp.rules = {\n' +
    '        noUnsafeEval: noUnsafeEval(),\n' +
    '        noInlineStyle: false\n' +
    '      };\n' +
    '    }\n' +
    '  }\n' +
    '\n' +
    '  return csp.rules;\n' +
    '\n' +
    '  function noUnsafeEval() {\n' +
    '    try {\n' +
    '      // eslint-disable-next-line no-new, no-new-func\n' +
    '      new Function(\'\');\n' +
    '      return false;\n' +
    '    } catch (e) {\n' +
    '      return true;\n' +
    '    }\n' +
    '  }\n' +
    '};\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc directive\n' +
    ' * @module ng\n' +
    ' * @name ngJq\n' +
    ' *\n' +
    ' * @element ANY\n' +
    ' * @param {string=} ngJq the name of the library available under `window`\n' +
    ' * to be used for angular.element\n' +
    ' * @description\n' +
    ' * Use this directive to force the angular.element library.  This should be\n' +
    ' * used to force either jqLite by leaving ng-jq blank or setting the name of\n' +
    ' * the jquery variable under window (eg. jQuery).\n' +
    ' *\n' +
    ' * Since AngularJS looks for this directive when it is loaded (doesn\'t wait for the\n' +
    ' * DOMContentLoaded event), it must be placed on an element that comes before the script\n' +
    ' * which loads angular. Also, only the first instance of `ng-jq` will be used and all\n' +
    ' * others ignored.\n' +
    ' *\n' +
    ' * @example\n' +
    ' * This example shows how to force jqLite using the `ngJq` directive to the `html` tag.\n' +
    ' ```html\n' +
    ' <!doctype html>\n' +
    ' <html ng-app ng-jq>\n' +
    ' ...\n' +
    ' ...\n' +
    ' </html>\n' +
    ' ```\n' +
    ' * @example\n' +
    ' * This example shows how to use a jQuery based library of a different name.\n' +
    ' * The library name must be available at the top most \'window\'.\n' +
    ' ```html\n' +
    ' <!doctype html>\n' +
    ' <html ng-app ng-jq="jQueryLib">\n' +
    ' ...\n' +
    ' ...\n' +
    ' </html>\n' +
    ' ```\n' +
    ' */\n' +
    'var jq = function() {\n' +
    '  if (isDefined(jq.name_)) return jq.name_;\n' +
    '  var el;\n' +
    '  var i, ii = ngAttrPrefixes.length, prefix, name;\n' +
    '  for (i = 0; i < ii; ++i) {\n' +
    '    prefix = ngAttrPrefixes[i];\n' +
    '    el = window.document.querySelector(\'[\' + prefix.replace(\':\', \'\\\\:\') + \'jq]\');\n' +
    '    if (el) {\n' +
    '      name = el.getAttribute(prefix + \'jq\');\n' +
    '      break;\n' +
    '    }\n' +
    '  }\n' +
    '\n' +
    '  return (jq.name_ = name);\n' +
    '};\n' +
    '\n' +
    'function concat(array1, array2, index) {\n' +
    '  return array1.concat(slice.call(array2, index));\n' +
    '}\n' +
    '\n' +
    'function sliceArgs(args, startIndex) {\n' +
    '  return slice.call(args, startIndex || 0);\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.bind\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Returns a function which calls function `fn` bound to `self` (`self` becomes the `this` for\n' +
    ' * `fn`). You can supply optional `args` that are prebound to the function. This feature is also\n' +
    ' * known as [partial application](http://en.wikipedia.org/wiki/Partial_application), as\n' +
    ' * distinguished from [function currying](http://en.wikipedia.org/wiki/Currying#Contrast_with_partial_function_application).\n' +
    ' *\n' +
    ' * @param {Object} self Context which `fn` should be evaluated in.\n' +
    ' * @param {function()} fn Function to be bound.\n' +
    ' * @param {...*} args Optional arguments to be prebound to the `fn` function call.\n' +
    ' * @returns {function()} Function that wraps the `fn` with all the specified bindings.\n' +
    ' */\n' +
    'function bind(self, fn) {\n' +
    '  var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];\n' +
    '  if (isFunction(fn) && !(fn instanceof RegExp)) {\n' +
    '    return curryArgs.length\n' +
    '      ? function() {\n' +
    '          return arguments.length\n' +
    '            ? fn.apply(self, concat(curryArgs, arguments, 0))\n' +
    '            : fn.apply(self, curryArgs);\n' +
    '        }\n' +
    '      : function() {\n' +
    '          return arguments.length\n' +
    '            ? fn.apply(self, arguments)\n' +
    '            : fn.call(self);\n' +
    '        };\n' +
    '  } else {\n' +
    '    // In IE, native methods are not functions so they cannot be bound (note: they don\'t need to be).\n' +
    '    return fn;\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '\n' +
    'function toJsonReplacer(key, value) {\n' +
    '  var val = value;\n' +
    '\n' +
    '  if (typeof key === \'string\' && key.charAt(0) === \'$\' && key.charAt(1) === \'$\') {\n' +
    '    val = undefined;\n' +
    '  } else if (isWindow(value)) {\n' +
    '    val = \'$WINDOW\';\n' +
    '  } else if (value &&  window.document === value) {\n' +
    '    val = \'$DOCUMENT\';\n' +
    '  } else if (isScope(value)) {\n' +
    '    val = \'$SCOPE\';\n' +
    '  }\n' +
    '\n' +
    '  return val;\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.toJson\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Serializes input into a JSON-formatted string. Properties with leading $$ characters will be\n' +
    ' * stripped since AngularJS uses this notation internally.\n' +
    ' *\n' +
    ' * @param {Object|Array|Date|string|number|boolean} obj Input to be serialized into JSON.\n' +
    ' * @param {boolean|number} [pretty=2] If set to true, the JSON output will contain newlines and whitespace.\n' +
    ' *    If set to an integer, the JSON output will contain that many spaces per indentation.\n' +
    ' * @returns {string|undefined} JSON-ified string representing `obj`.\n' +
    ' * @knownIssue\n' +
    ' *\n' +
    ' * The Safari browser throws a `RangeError` instead of returning `null` when it tries to stringify a `Date`\n' +
    ' * object with an invalid date value. The only reliable way to prevent this is to monkeypatch the\n' +
    ' * `Date.prototype.toJSON` method as follows:\n' +
    ' *\n' +
    ' * ```\n' +
    ' * var _DatetoJSON = Date.prototype.toJSON;\n' +
    ' * Date.prototype.toJSON = function() {\n' +
    ' *   try {\n' +
    ' *     return _DatetoJSON.call(this);\n' +
    ' *   } catch(e) {\n' +
    ' *     if (e instanceof RangeError) {\n' +
    ' *       return null;\n' +
    ' *     }\n' +
    ' *     throw e;\n' +
    ' *   }\n' +
    ' * };\n' +
    ' * ```\n' +
    ' *\n' +
    ' * See https://github.com/angular/angular.js/pull/14221 for more information.\n' +
    ' */\n' +
    'function toJson(obj, pretty) {\n' +
    '  if (isUndefined(obj)) return undefined;\n' +
    '  if (!isNumber(pretty)) {\n' +
    '    pretty = pretty ? 2 : null;\n' +
    '  }\n' +
    '  return JSON.stringify(obj, toJsonReplacer, pretty);\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.fromJson\n' +
    ' * @module ng\n' +
    ' * @kind function\n' +
    ' *\n' +
    ' * @description\n' +
    ' * Deserializes a JSON string.\n' +
    ' *\n' +
    ' * @param {string} json JSON string to deserialize.\n' +
    ' * @returns {Object|Array|string|number} Deserialized JSON string.\n' +
    ' */\n' +
    'function fromJson(json) {\n' +
    '  return isString(json)\n' +
    '      ? JSON.parse(json)\n' +
    '      : json;\n' +
    '}\n' +
    '\n' +
    '\n' +
    'var ALL_COLONS = /:/g;\n' +
    'function timezoneToOffset(timezone, fallback) {\n' +
    '  // Support: IE 9-11 only, Edge 13-15+\n' +
    '  // IE/Edge do not "understand" colon (`:`) in timezone\n' +
    '  timezone = timezone.replace(ALL_COLONS, \'\');\n' +
    '  var requestedTimezoneOffset = Date.parse(\'Jan 01, 1970 00:00:00 \' + timezone) / 60000;\n' +
    '  return isNumberNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;\n' +
    '}\n' +
    '\n' +
    '\n' +
    'function addDateMinutes(date, minutes) {\n' +
    '  date = new Date(date.getTime());\n' +
    '  date.setMinutes(date.getMinutes() + minutes);\n' +
    '  return date;\n' +
    '}\n' +
    '\n' +
    '\n' +
    'function convertTimezoneToLocal(date, timezone, reverse) {\n' +
    '  reverse = reverse ? -1 : 1;\n' +
    '  var dateTimezoneOffset = date.getTimezoneOffset();\n' +
    '  var timezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);\n' +
    '  return addDateMinutes(date, reverse * (timezoneOffset - dateTimezoneOffset));\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * @returns {string} Returns the string representation of the element.\n' +
    ' */\n' +
    'function startingTag(element) {\n' +
    '  element = jqLite(element).clone().empty();\n' +
    '  var elemHtml = jqLite(\'<div>\').append(element).html();\n' +
    '  try {\n' +
    '    return element[0].nodeType === NODE_TYPE_TEXT ? lowercase(elemHtml) :\n' +
    '        elemHtml.\n' +
    '          match(/^(<[^>]+>)/)[1].\n' +
    '          replace(/^<([\\w-]+)/, function(match, nodeName) {return \'<\' + lowercase(nodeName);});\n' +
    '  } catch (e) {\n' +
    '    return lowercase(elemHtml);\n' +
    '  }\n' +
    '\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/////////////////////////////////////////////////\n' +
    '\n' +
    '/**\n' +
    ' * Tries to decode the URI component without throwing an exception.\n' +
    ' *\n' +
    ' * @private\n' +
    ' * @param str value potential URI component to check.\n' +
    ' * @returns {boolean} True if `value` can be decoded\n' +
    ' * with the decodeURIComponent function.\n' +
    ' */\n' +
    'function tryDecodeURIComponent(value) {\n' +
    '  try {\n' +
    '    return decodeURIComponent(value);\n' +
    '  } catch (e) {\n' +
    '    // Ignore any invalid uri component.\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * Parses an escaped url query string into key-value pairs.\n' +
    ' * @returns {Object.<string,boolean|Array>}\n' +
    ' */\n' +
    'function parseKeyValue(/**string*/keyValue) {\n' +
    '  var obj = {};\n' +
    '  forEach((keyValue || \'\').split(\'&\'), function(keyValue) {\n' +
    '    var splitPoint, key, val;\n' +
    '    if (keyValue) {\n' +
    '      key = keyValue = keyValue.replace(/\\+/g,\'%20\');\n' +
    '      splitPoint = keyValue.indexOf(\'=\');\n' +
    '      if (splitPoint !== -1) {\n' +
    '        key = keyValue.substring(0, splitPoint);\n' +
    '        val = keyValue.substring(splitPoint + 1);\n' +
    '      }\n' +
    '      key = tryDecodeURIComponent(key);\n' +
    '      if (isDefined(key)) {\n' +
    '        val = isDefined(val) ? tryDecodeURIComponent(val) : true;\n' +
    '        if (!hasOwnProperty.call(obj, key)) {\n' +
    '          obj[key] = val;\n' +
    '        } else if (isArray(obj[key])) {\n' +
    '          obj[key].push(val);\n' +
    '        } else {\n' +
    '          obj[key] = [obj[key],val];\n' +
    '        }\n' +
    '      }\n' +
    '    }\n' +
    '  });\n' +
    '  return obj;\n' +
    '}\n' +
    '\n' +
    'function toKeyValue(obj) {\n' +
    '  var parts = [];\n' +
    '  forEach(obj, function(value, key) {\n' +
    '    if (isArray(value)) {\n' +
    '      forEach(value, function(arrayValue) {\n' +
    '        parts.push(encodeUriQuery(key, true) +\n' +
    '                   (arrayValue === true ? \'\' : \'=\' + encodeUriQuery(arrayValue, true)));\n' +
    '      });\n' +
    '    } else {\n' +
    '    parts.push(encodeUriQuery(key, true) +\n' +
    '               (value === true ? \'\' : \'=\' + encodeUriQuery(value, true)));\n' +
    '    }\n' +
    '  });\n' +
    '  return parts.length ? parts.join(\'&\') : \'\';\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * We need our custom method because encodeURIComponent is too aggressive and doesn\'t follow\n' +
    ' * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set (pchar) allowed in path\n' +
    ' * segments:\n' +
    ' *    segment       = *pchar\n' +
    ' *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"\n' +
    ' *    pct-encoded   = "%" HEXDIG HEXDIG\n' +
    ' *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"\n' +
    ' *    sub-delims    = "!" / "$" / "&" / "\'" / "(" / ")"\n' +
    ' *                     / "*" / "+" / "," / ";" / "="\n' +
    ' */\n' +
    'function encodeUriSegment(val) {\n' +
    '  return encodeUriQuery(val, true).\n' +
    '             replace(/%26/gi, \'&\').\n' +
    '             replace(/%3D/gi, \'=\').\n' +
    '             replace(/%2B/gi, \'+\');\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * This method is intended for encoding *key* or *value* parts of query component. We need a custom\n' +
    ' * method because encodeURIComponent is too aggressive and encodes stuff that doesn\'t have to be\n' +
    ' * encoded per http://tools.ietf.org/html/rfc3986:\n' +
    ' *    query         = *( pchar / "/" / "?" )\n' +
    ' *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"\n' +
    ' *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"\n' +
    ' *    pct-encoded   = "%" HEXDIG HEXDIG\n' +
    ' *    sub-delims    = "!" / "$" / "&" / "\'" / "(" / ")"\n' +
    ' *                     / "*" / "+" / "," / ";" / "="\n' +
    ' */\n' +
    'function encodeUriQuery(val, pctEncodeSpaces) {\n' +
    '  return encodeURIComponent(val).\n' +
    '             replace(/%40/gi, \'@\').\n' +
    '             replace(/%3A/gi, \':\').\n' +
    '             replace(/%24/g, \'$\').\n' +
    '             replace(/%2C/gi, \',\').\n' +
    '             replace(/%3B/gi, \';\').\n' +
    '             replace(/%20/g, (pctEncodeSpaces ? \'%20\' : \'+\'));\n' +
    '}\n' +
    '\n' +
    'var ngAttrPrefixes = [\'ng-\', \'data-ng-\', \'ng:\', \'x-ng-\'];\n' +
    '\n' +
    'function getNgAttribute(element, ngAttr) {\n' +
    '  var attr, i, ii = ngAttrPrefixes.length;\n' +
    '  for (i = 0; i < ii; ++i) {\n' +
    '    attr = ngAttrPrefixes[i] + ngAttr;\n' +
    '    if (isString(attr = element.getAttribute(attr))) {\n' +
    '      return attr;\n' +
    '    }\n' +
    '  }\n' +
    '  return null;\n' +
    '}\n' +
    '\n' +
    'function allowAutoBootstrap(document) {\n' +
    '  var script = document.currentScript;\n' +
    '\n' +
    '  if (!script) {\n' +
    '    // Support: IE 9-11 only\n' +
    '    // IE does not have `document.currentScript`\n' +
    '    return true;\n' +
    '  }\n' +
    '\n' +
    '  // If the `currentScript` property has been clobbered just return false, since this indicates a probable attack\n' +
    '  if (!(script instanceof window.HTMLScriptElement || script instanceof window.SVGScriptElement)) {\n' +
    '    return false;\n' +
    '  }\n' +
    '\n' +
    '  var attributes = script.attributes;\n' +
    '  var srcs = [attributes.getNamedItem(\'src\'), attributes.getNamedItem(\'href\'), attributes.getNamedItem(\'xlink:href\')];\n' +
    '\n' +
    '  return srcs.every(function(src) {\n' +
    '    if (!src) {\n' +
    '      return true;\n' +
    '    }\n' +
    '    if (!src.value) {\n' +
    '      return false;\n' +
    '    }\n' +
    '\n' +
    '    var link = document.createElement(\'a\');\n' +
    '    link.href = src.value;\n' +
    '\n' +
    '    if (document.location.origin === link.origin) {\n' +
    '      // Same-origin resources are always allowed, even for non-whitelisted schemes.\n' +
    '      return true;\n' +
    '    }\n' +
    '    // Disabled bootstrapping unless angular.js was loaded from a known scheme used on the web.\n' +
    '    // This is to prevent angular.js bundled with browser extensions from being used to bypass the\n' +
    '    // content security policy in web pages and other browser extensions.\n' +
    '    switch (link.protocol) {\n' +
    '      case \'http:\':\n' +
    '      case \'https:\':\n' +
    '      case \'ftp:\':\n' +
    '      case \'blob:\':\n' +
    '      case \'file:\':\n' +
    '      case \'data:\':\n' +
    '        return true;\n' +
    '      default:\n' +
    '        return false;\n' +
    '    }\n' +
    '  });\n' +
    '}\n' +
    '\n' +
    '// Cached as it has to run during loading so that document.currentScript is available.\n' +
    'var isAutoBootstrapAllowed = allowAutoBootstrap(window.document);\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc directive\n' +
    ' * @name ngApp\n' +
    ' * @module ng\n' +
    ' *\n' +
    ' * @element ANY\n' +
    ' * @param {angular.Module} ngApp an optional application\n' +
    ' *   {@link angular.module module} name to load.\n' +
    ' * @param {boolean=} ngStrictDi if this attribute is present on the app element, the injector will be\n' +
    ' *   created in "strict-di" mode. This means that the application will fail to invoke functions which\n' +
    ' *   do not use explicit function annotation (and are thus unsuitable for minification), as described\n' +
    ' *   in {@link guide/di the Dependency Injection guide}, and useful debugging info will assist in\n' +
    ' *   tracking down the root of these bugs.\n' +
    ' *\n' +
    ' * @description\n' +
    ' *\n' +
    ' * Use this directive to **auto-bootstrap** an AngularJS application. The `ngApp` directive\n' +
    ' * designates the **root element** of the application and is typically placed near the root element\n' +
    ' * of the page - e.g. on the `<body>` or `<html>` tags.\n' +
    ' *\n' +
    ' * There are a few things to keep in mind when using `ngApp`:\n' +
    ' * - only one AngularJS application can be auto-bootstrapped per HTML document. The first `ngApp`\n' +
    ' *   found in the document will be used to define the root element to auto-bootstrap as an\n' +
    ' *   application. To run multiple applications in an HTML document you must manually bootstrap them using\n' +
    ' *   {@link angular.bootstrap} instead.\n' +
    ' * - AngularJS applications cannot be nested within each other.\n' +
    ' * - Do not use a directive that uses {@link ng.$compile#transclusion transclusion} on the same element as `ngApp`.\n' +
    ' *   This includes directives such as {@link ng.ngIf `ngIf`}, {@link ng.ngInclude `ngInclude`} and\n' +
    ' *   {@link ngRoute.ngView `ngView`}.\n' +
    ' *   Doing this misplaces the app {@link ng.$rootElement `$rootElement`} and the app\'s {@link auto.$injector injector},\n' +
    ' *   causing animations to stop working and making the injector inaccessible from outside the app.\n' +
    ' *\n' +
    ' * You can specify an **AngularJS module** to be used as the root module for the application.  This\n' +
    ' * module will be loaded into the {@link auto.$injector} when the application is bootstrapped. It\n' +
    ' * should contain the application code needed or have dependencies on other modules that will\n' +
    ' * contain the code. See {@link angular.module} for more information.\n' +
    ' *\n' +
    ' * In the example below if the `ngApp` directive were not placed on the `html` element then the\n' +
    ' * document would not be compiled, the `AppController` would not be instantiated and the `{{ a+b }}`\n' +
    ' * would not be resolved to `3`.\n' +
    ' *\n' +
    ' * `ngApp` is the easiest, and most common way to bootstrap an application.\n' +
    ' *\n' +
    ' <example module="ngAppDemo" name="ng-app">\n' +
    '   <file name="index.html">\n' +
    '   <div ng-controller="ngAppDemoController">\n' +
    '     I can add: {{a}} + {{b}} =  {{ a+b }}\n' +
    '   </div>\n' +
    '   </file>\n' +
    '   <file name="script.js">\n' +
    '   angular.module(\'ngAppDemo\', []).controller(\'ngAppDemoController\', function($scope) {\n' +
    '     $scope.a = 1;\n' +
    '     $scope.b = 2;\n' +
    '   });\n' +
    '   </file>\n' +
    ' </example>\n' +
    ' *\n' +
    ' * Using `ngStrictDi`, you would see something like this:\n' +
    ' *\n' +
    ' <example ng-app-included="true" name="strict-di">\n' +
    '   <file name="index.html">\n' +
    '   <div ng-app="ngAppStrictDemo" ng-strict-di>\n' +
    '       <div ng-controller="GoodController1">\n' +
    '           I can add: {{a}} + {{b}} =  {{ a+b }}\n' +
    '\n' +
    '           <p>This renders because the controller does not fail to\n' +
    '              instantiate, by using explicit annotation style (see\n' +
    '              script.js for details)\n' +
    '           </p>\n' +
    '       </div>\n' +
    '\n' +
    '       <div ng-controller="GoodController2">\n' +
    '           Name: <input ng-model="name"><br />\n' +
    '           Hello, {{name}}!\n' +
    '\n' +
    '           <p>This renders because the controller does not fail to\n' +
    '              instantiate, by using explicit annotation style\n' +
    '              (see script.js for details)\n' +
    '           </p>\n' +
    '       </div>\n' +
    '\n' +
    '       <div ng-controller="BadController">\n' +
    '           I can add: {{a}} + {{b}} =  {{ a+b }}\n' +
    '\n' +
    '           <p>The controller could not be instantiated, due to relying\n' +
    '              on automatic function annotations (which are disabled in\n' +
    '              strict mode). As such, the content of this section is not\n' +
    '              interpolated, and there should be an error in your web console.\n' +
    '           </p>\n' +
    '       </div>\n' +
    '   </div>\n' +
    '   </file>\n' +
    '   <file name="script.js">\n' +
    '   angular.module(\'ngAppStrictDemo\', [])\n' +
    '     // BadController will fail to instantiate, due to relying on automatic function annotation,\n' +
    '     // rather than an explicit annotation\n' +
    '     .controller(\'BadController\', function($scope) {\n' +
    '       $scope.a = 1;\n' +
    '       $scope.b = 2;\n' +
    '     })\n' +
    '     // Unlike BadController, GoodController1 and GoodController2 will not fail to be instantiated,\n' +
    '     // due to using explicit annotations using the array style and $inject property, respectively.\n' +
    '     .controller(\'GoodController1\', [\'$scope\', function($scope) {\n' +
    '       $scope.a = 1;\n' +
    '       $scope.b = 2;\n' +
    '     }])\n' +
    '     .controller(\'GoodController2\', GoodController2);\n' +
    '     function GoodController2($scope) {\n' +
    '       $scope.name = \'World\';\n' +
    '     }\n' +
    '     GoodController2.$inject = [\'$scope\'];\n' +
    '   </file>\n' +
    '   <file name="style.css">\n' +
    '   div[ng-controller] {\n' +
    '       margin-bottom: 1em;\n' +
    '       -webkit-border-radius: 4px;\n' +
    '       border-radius: 4px;\n' +
    '       border: 1px solid;\n' +
    '       padding: .5em;\n' +
    '   }\n' +
    '   div[ng-controller^=Good] {\n' +
    '       border-color: #d6e9c6;\n' +
    '       background-color: #dff0d8;\n' +
    '       color: #3c763d;\n' +
    '   }\n' +
    '   div[ng-controller^=Bad] {\n' +
    '       border-color: #ebccd1;\n' +
    '       background-color: #f2dede;\n' +
    '       color: #a94442;\n' +
    '       margin-bottom: 0;\n' +
    '   }\n' +
    '   </file>\n' +
    ' </example>\n' +
    ' */\n' +
    'function angularInit(element, bootstrap) {\n' +
    '  var appElement,\n' +
    '      module,\n' +
    '      config = {};\n' +
    '\n' +
    '  // The element `element` has priority over any other element.\n' +
    '  forEach(ngAttrPrefixes, function(prefix) {\n' +
    '    var name = prefix + \'app\';\n' +
    '\n' +
    '    if (!appElement && element.hasAttribute && element.hasAttribute(name)) {\n' +
    '      appElement = element;\n' +
    '      module = element.getAttribute(name);\n' +
    '    }\n' +
    '  });\n' +
    '  forEach(ngAttrPrefixes, function(prefix) {\n' +
    '    var name = prefix + \'app\';\n' +
    '    var candidate;\n' +
    '\n' +
    '    if (!appElement && (candidate = element.querySelector(\'[\' + name.replace(\':\', \'\\\\:\') + \']\'))) {\n' +
    '      appElement = candidate;\n' +
    '      module = candidate.getAttribute(name);\n' +
    '    }\n' +
    '  });\n' +
    '  if (appElement) {\n' +
    '    if (!isAutoBootstrapAllowed) {\n' +
    '      window.console.error(\'AngularJS: disabling automatic bootstrap. <script> protocol indicates \' +\n' +
    '          \'an extension, document.location.href does not match.\');\n' +
    '      return;\n' +
    '    }\n' +
    '    config.strictDi = getNgAttribute(appElement, \'strict-di\') !== null;\n' +
    '    bootstrap(appElement, module ? [module] : [], config);\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.bootstrap\n' +
    ' * @module ng\n' +
    ' * @description\n' +
    ' * Use this function to manually start up AngularJS application.\n' +
    ' *\n' +
    ' * For more information, see the {@link guide/bootstrap Bootstrap guide}.\n' +
    ' *\n' +
    ' * AngularJS will detect if it has been loaded into the browser more than once and only allow the\n' +
    ' * first loaded script to be bootstrapped and will report a warning to the browser console for\n' +
    ' * each of the subsequent scripts. This prevents strange results in applications, where otherwise\n' +
    ' * multiple instances of AngularJS try to work on the DOM.\n' +
    ' *\n' +
    ' * <div class="alert alert-warning">\n' +
    ' * **Note:** Protractor based end-to-end tests cannot use this function to bootstrap manually.\n' +
    ' * They must use {@link ng.directive:ngApp ngApp}.\n' +
    ' * </div>\n' +
    ' *\n' +
    ' * <div class="alert alert-warning">\n' +
    ' * **Note:** Do not bootstrap the app on an element with a directive that uses {@link ng.$compile#transclusion transclusion},\n' +
    ' * such as {@link ng.ngIf `ngIf`}, {@link ng.ngInclude `ngInclude`} and {@link ngRoute.ngView `ngView`}.\n' +
    ' * Doing this misplaces the app {@link ng.$rootElement `$rootElement`} and the app\'s {@link auto.$injector injector},\n' +
    ' * causing animations to stop working and making the injector inaccessible from outside the app.\n' +
    ' * </div>\n' +
    ' *\n' +
    ' * ```html\n' +
    ' * <!doctype html>\n' +
    ' * <html>\n' +
    ' * <body>\n' +
    ' * <div ng-controller="WelcomeController">\n' +
    ' *   {{greeting}}\n' +
    ' * </div>\n' +
    ' *\n' +
    ' * <script src="angular.js"></script>\n' +
    ' * <script>\n' +
    ' *   var app = angular.module(\'demo\', [])\n' +
    ' *   .controller(\'WelcomeController\', function($scope) {\n' +
    ' *       $scope.greeting = \'Welcome!\';\n' +
    ' *   });\n' +
    ' *   angular.bootstrap(document, [\'demo\']);\n' +
    ' * </script>\n' +
    ' * </body>\n' +
    ' * </html>\n' +
    ' * ```\n' +
    ' *\n' +
    ' * @param {DOMElement} element DOM element which is the root of AngularJS application.\n' +
    ' * @param {Array<String|Function|Array>=} modules an array of modules to load into the application.\n' +
    ' *     Each item in the array should be the name of a predefined module or a (DI annotated)\n' +
    ' *     function that will be invoked by the injector as a `config` block.\n' +
    ' *     See: {@link angular.module modules}\n' +
    ' * @param {Object=} config an object for defining configuration options for the application. The\n' +
    ' *     following keys are supported:\n' +
    ' *\n' +
    ' * * `strictDi` - disable automatic function annotation for the application. This is meant to\n' +
    ' *   assist in finding bugs which break minified code. Defaults to `false`.\n' +
    ' *\n' +
    ' * @returns {auto.$injector} Returns the newly created injector for this app.\n' +
    ' */\n' +
    'function bootstrap(element, modules, config) {\n' +
    '  if (!isObject(config)) config = {};\n' +
    '  var defaultConfig = {\n' +
    '    strictDi: false\n' +
    '  };\n' +
    '  config = extend(defaultConfig, config);\n' +
    '  var doBootstrap = function() {\n' +
    '    element = jqLite(element);\n' +
    '\n' +
    '    if (element.injector()) {\n' +
    '      var tag = (element[0] === window.document) ? \'document\' : startingTag(element);\n' +
    '      // Encode angle brackets to prevent input from being sanitized to empty string #8683.\n' +
    '      throw ngMinErr(\n' +
    '          \'btstrpd\',\n' +
    '          \'App already bootstrapped with this element \\\'{0}\\\'\',\n' +
    '          tag.replace(/</,\'&lt;\').replace(/>/,\'&gt;\'));\n' +
    '    }\n' +
    '\n' +
    '    modules = modules || [];\n' +
    '    modules.unshift([\'$provide\', function($provide) {\n' +
    '      $provide.value(\'$rootElement\', element);\n' +
    '    }]);\n' +
    '\n' +
    '    if (config.debugInfoEnabled) {\n' +
    '      // Pushing so that this overrides `debugInfoEnabled` setting defined in user\'s `modules`.\n' +
    '      modules.push([\'$compileProvider\', function($compileProvider) {\n' +
    '        $compileProvider.debugInfoEnabled(true);\n' +
    '      }]);\n' +
    '    }\n' +
    '\n' +
    '    modules.unshift(\'ng\');\n' +
    '    var injector = createInjector(modules, config.strictDi);\n' +
    '    injector.invoke([\'$rootScope\', \'$rootElement\', \'$compile\', \'$injector\',\n' +
    '       function bootstrapApply(scope, element, compile, injector) {\n' +
    '        scope.$apply(function() {\n' +
    '          element.data(\'$injector\', injector);\n' +
    '          compile(element)(scope);\n' +
    '        });\n' +
    '      }]\n' +
    '    );\n' +
    '    return injector;\n' +
    '  };\n' +
    '\n' +
    '  var NG_ENABLE_DEBUG_INFO = /^NG_ENABLE_DEBUG_INFO!/;\n' +
    '  var NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;\n' +
    '\n' +
    '  if (window && NG_ENABLE_DEBUG_INFO.test(window.name)) {\n' +
    '    config.debugInfoEnabled = true;\n' +
    '    window.name = window.name.replace(NG_ENABLE_DEBUG_INFO, \'\');\n' +
    '  }\n' +
    '\n' +
    '  if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) {\n' +
    '    return doBootstrap();\n' +
    '  }\n' +
    '\n' +
    '  window.name = window.name.replace(NG_DEFER_BOOTSTRAP, \'\');\n' +
    '  angular.resumeBootstrap = function(extraModules) {\n' +
    '    forEach(extraModules, function(module) {\n' +
    '      modules.push(module);\n' +
    '    });\n' +
    '    return doBootstrap();\n' +
    '  };\n' +
    '\n' +
    '  if (isFunction(angular.resumeDeferredBootstrap)) {\n' +
    '    angular.resumeDeferredBootstrap();\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '/**\n' +
    ' * @ngdoc function\n' +
    ' * @name angular.reloadWithDebugInfo\n' +
    ' * @module ng\n' +
    ' * @description\n' +
    ' * Use this function to reload the current application with debug information turned on.\n' +
    ' * This takes precedence over a call to `$compileProvider.debugInfoEnabled(false)`.\n' +
    ' *\n' +
    ' * See {@link ng.$compileProvider#debugInfoEnabled} for more.\n' +
    ' */\n' +
    'function reloadWithDebugInfo() {\n' +
    '  window.name = \'NG_ENABLE_DEBUG_INFO!\' + window.name;\n' +
    '  window.location.reload();\n' +
    '}\n' +
    '\n' +
    '/**\n' +
    ' * @name angular.getTestability\n' +
    ' * @module ng\n' +
    ' * @description\n' +
    ' * Get the testability service for the instance of AngularJS on the given\n' +
    ' * element.\n' +
    ' * @param {DOMElement} element DOM element which is the root of AngularJS application.\n' +
    ' */\n' +
    'function getTestability(rootElement) {\n' +
    '  var injector = angular.element(rootElement).injector();\n' +
    '  if (!injector) {\n' +
    '    throw ngMinErr(\'test\',\n' +
    '      \'no injector found for element argument to getTestability\');\n' +
    '  }\n' +
    '  return injector.get(\'$$testability\');\n' +
    '}\n' +
    '\n' +
    'var SNAKE_CASE_REGEXP = /[A-Z]/g;\n' +
    'function snake_case(name, separator) {\n' +
    '  separator = separator || \'_\';\n' +
    '  return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {\n' +
    '    return (pos ? separator : \'\') + letter.toLowerCase();\n' +
    '  });\n' +
    '}\n' +
    '\n' +
    'var bindJQueryFired = false;\n' +
    'function bindJQuery() {\n' +
    '  var originalCleanData;\n' +
    '\n' +
    '  if (bindJQueryFired) {\n' +
    '    return;\n' +
    '  }\n' +
    '\n' +
    '  // bind to jQuery if present;\n' +
    '  var jqName = jq();\n' +
    '  jQuery = isUndefined(jqName) ? window.jQuery :   // use jQuery (if present)\n' +
    '           !jqName             ? undefined     :   // use jqLite\n' +
    '                                 window[jqName];   // use jQuery specified by `ngJq`\n' +
    '\n' +
    '  // Use jQuery if it exists with proper functionality, otherwise default to us.\n' +
    '  // AngularJS 1.2+ requires jQuery 1.7+ for on()/off() support.\n' +
    '  // AngularJS 1.3+ technically requires at least jQuery 2.1+ but it may work with older\n' +
    '  // versions. It will not work for sure with jQuery <1.7, though.\n' +
    '  if (jQuery && jQuery.fn.on) {\n' +
    '    jqLite = jQuery;\n' +
    '    extend(jQuery.fn, {\n' +
    '      scope: JQLitePrototype.scope,\n' +
    '      isolateScope: JQLitePrototype.isolateScope,\n' +
    '      controller: /** @type {?} */ (JQLitePrototype).controller,\n' +
    '      injector: JQLitePrototype.injector,\n' +
    '      inheritedData: JQLitePrototype.inheritedData\n' +
    '    });\n' +
    '\n' +
    '    // All nodes removed from the DOM via various jQuery APIs like .remove()\n' +
    '    // are passed through jQuery.cleanData. Monkey-patch this method to fire\n' +
    '    // the $destroy event on all removed nodes.\n' +
    '    originalCleanData = jQuery.cleanData;\n' +
    '    jQuery.cleanData = function(elems) {\n' +
    '      var events;\n' +
    '      for (var i = 0, elem; (elem = elems[i]) != null; i++) {\n' +
    '        events = jQuery._data(elem, \'events\');\n' +
    '        if (events && events.$destroy) {\n' +
    '          jQuery(elem).triggerHandler(\'$destroy\');\n' +
    '        }\n' +
    '      }\n' +
    '      originalCleanData(elems);\n' +
    '    };\n' +
    '  } else {\n' +
    '    jqLite = JQLite;\n' +
    '  }\n' +
    '\n' +
    '  angular.element = jqLite;\n' +
    '\n' +
    '  // Prevent double-proxying.\n' +
    '  bindJQueryFired = true;\n' +
    '}\n' +
    '\n' +
    '/**\n' +
    ' * throw error if the argument is falsy.\n' +
    ' */\n' +
    'function assertArg(arg, name, reason) {\n' +
    '  if (!arg) {\n' +
    '    throw ngMinErr(\'areq\', \'Argument \\\'{0}\\\' is {1}\', (name || \'?\'), (reason || \'required\'));\n' +
    '  }\n' +
    '  return arg;\n' +
    '}\n' +
    '\n' +
    'function assertArgFn(arg, name, acceptArrayAnnotation) {\n' +
    '  if (acceptArrayAnnotation && isArray(arg)) {\n' +
    '      arg = arg[arg.length - 1];\n' +
    '  }\n' +
    '\n' +
    '  assertArg(isFunction(arg), name, \'not a function, got \' +\n' +
    '      (arg && typeof arg === \'object\' ? arg.constructor.name || \'Object\' : typeof arg));\n' +
    '  return arg;\n' +
    '}\n' +
    '\n' +
    '/**\n' +
    ' * throw error if the name given is hasOwnProperty\n' +
    ' * @param  {String} name    the name to test\n' +
    ' * @param  {String} context the context in which the name is used, such as module or directive\n' +
    ' */\n' +
    'function assertNotHasOwnProperty(name, context) {\n' +
    '  if (name === \'hasOwnProperty\') {\n' +
    '    throw ngMinErr(\'badname\', \'hasOwnProperty is not a valid {0} name\', context);\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '/**\n' +
    ' * Return the value accessible from the object by path. Any undefined traversals are ignored\n' +
    ' * @param {Object} obj starting object\n' +
    ' * @param {String} path path to traverse\n' +
    ' * @param {boolean} [bindFnToScope=true]\n' +
    ' * @returns {Object} value as accessible by path\n' +
    ' */\n' +
    '//TODO(misko): this function needs to be removed\n' +
    'function getter(obj, path, bindFnToScope) {\n' +
    '  if (!path) return obj;\n' +
    '  var keys = path.split(\'.\');\n' +
    '  var key;\n' +
    '  var lastInstance = obj;\n' +
    '  var len = keys.length;\n' +
    '\n' +
    '  for (var i = 0; i < len; i++) {\n' +
    '    key = keys[i];\n' +
    '    if (obj) {\n' +
    '      obj = (lastInstance = obj)[key];\n' +
    '    }\n' +
    '  }\n' +
    '  if (!bindFnToScope && isFunction(obj)) {\n' +
    '    return bind(lastInstance, obj);\n' +
    '  }\n' +
    '  return obj;\n' +
    '}\n' +
    '\n' +
    '/**\n' +
    ' * Return the DOM siblings between the first and last node in the given array.\n' +
    ' * @param {Array} array like object\n' +
    ' * @returns {Array} the inputted object or a jqLite collection containing the nodes\n' +
    ' */\n' +
    'function getBlockNodes(nodes) {\n' +
    '  // TODO(perf): update `nodes` instead of creating a new object?\n' +
    '  var node = nodes[0];\n' +
    '  var endNode = nodes[nodes.length - 1];\n' +
    '  var blockNodes;\n' +
    '\n' +
    '  for (var i = 1; node !== endNode && (node = node.nextSibling); i++) {\n' +
    '    if (blockNodes || nodes[i] !== node) {\n' +
    '      if (!blockNodes) {\n' +
    '        blockNodes = jqLite(slice.call(nodes, 0, i));\n' +
    '      }\n' +
    '      blockNodes.push(node);\n' +
    '    }\n' +
    '  }\n' +
    '\n' +
    '  return blockNodes || nodes;\n' +
    '}\n' +
    '\n' +
    '\n' +
    '/**\n' +
    ' * Creates a new object without a prototype. This object is useful for lookup without having to\n' +
    ' * guard against prototypically inherited properties via hasOwnProperty.\n' +
    ' *\n' +
    ' * Related micro-benchmarks:\n' +
    ' * - http://jsperf.com/object-create2\n' +
    ' * - http://jsperf.com/proto-map-lookup/2\n' +
    ' * - http://jsperf.com/for-in-vs-object-keys2\n' +
    ' *\n' +
    ' * @returns {Object}\n' +
    ' */\n' +
    'function createMap() {\n' +
    '  return Object.create(null);\n' +
    '}\n' +
    '\n' +
    'function stringify(value) {\n' +
    '  if (value == null) { // null || undefined\n' +
    '    return \'\';\n' +
    '  }\n' +
    '  switch (typeof value) {\n' +
    '    case \'string\':\n' +
    '      break;\n' +
    '    case \'number\':\n' +
    '      value = \'\' + value;\n' +
    '      break;\n' +
    '    default:\n' +
    '      if (hasCustomToString(value) && !isArray(value) && !isDate(value)) {\n' +
    '        value = value.toString();\n' +
    '      } else {\n' +
    '        value = toJson(value);\n' +
    '      }\n' +
    '  }\n' +
    '\n' +
    '  return value;\n' +
    '}\n' +
    '\n' +
    'var NODE_TYPE_ELEMENT = 1;\n' +
    'var NODE_TYPE_ATTRIBUTE = 2;\n' +
    'var NODE_TYPE_TEXT = 3;\n' +
    'var NODE_TYPE_COMMENT = 8;\n' +
    'var NODE_TYPE_DOCUMENT = 9;\n' +
    'var NODE_TYPE_DOCUMENT_FRAGMENT = 11;';

var sourceNode = 'var http = require(\'http\');\n' +
    '\n' +
    'http.createServer(function (req, res) {\n' +
    '    res.writeHead(200, {\'Content-Type\': \'text/plain\'});\n' +
    '    res.end(\'Hello World!\');\n' +
    '}).listen(8080);';



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

var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');

// var filename = process.argv[2];
// console.log('Processing', filename);
// var ast = esprima.parse(fs.readFileSync(filename), {loc: true});
// source, sourceR, sourceJS, sourceAngular, sourceNode

var ast = esprima.parse(sourceJS, {loc: true});
var scopeChain = [];
var assignments = [];
var requiresModules = [];
var variablesTotal = [];

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
        processRequires(node);
    }
    if (node.type === 'AssignmentExpression'){
        assignments.push(node);
      processRequires(node);
    }
}

function leave(node){
    if (createsNewScope(node)){
        checkForLeaks(assignments, scopeChain);
        var currentScope = scopeChain.pop();
        printScope(currentScope, node);
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
        var assignment = assignments[i];
        var varname = assignment.left.name;
        if (!isVarDefined(varname, scopeChain)){
            console.log('Leaked global', varname, 'on line', assignment.loc.start.line);
        }
    }
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
