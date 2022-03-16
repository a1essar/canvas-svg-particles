// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/Canvas/createCanvas.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function createCanvas(root, options) {
  var width = options.width,
      height = options.height,
      zIndex = options.zIndex;
  var canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  canvas.width = width;
  canvas.height = height;
  canvas.style.position = 'absolute';
  canvas.style.zIndex = zIndex;
  root.appendChild(canvas);
  return canvas;
}

exports.createCanvas = createCanvas;
},{}],"../src/Canvas/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./createCanvas"));
},{"./createCanvas":"../src/Canvas/createCanvas.ts"}],"../src/Scene/Scene.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Canvas_1 = require("../Canvas");

var Scene =
/** @class */
function () {
  function Scene(root, zIndex, options) {
    this.root = root;
    this.zIndex = zIndex;
    this.options = options;
    this.size = {
      width: 0,
      height: 0
    };
    this.updateSize();
    this.canvas = this.createCanvas(this.zIndex);
    this.context = this.canvas.getContext('2d', {
      alpha: false
    });
    this.clear();
  }

  Scene.prototype.clear = function () {
    this.context.fillStyle = this.options.backgroundColor;
    this.context.fillRect(0, 0, this.size.width, this.size.height);
  };

  Scene.prototype.destroy = function () {
    this.canvas.remove();
  };

  Scene.prototype.updateCanvasSize = function () {
    this.updateSize();
    this.canvas.height = this.size.height;
    this.canvas.width = this.size.width;
  };

  Scene.prototype.updateSize = function () {
    var _a = this.root.getBoundingClientRect(),
        width = _a.width,
        height = _a.height;

    this.size.width = width;
    this.size.height = height;
  };

  Scene.prototype.createCanvas = function (zIndex) {
    if (zIndex === void 0) {
      zIndex = 0;
    }

    return Canvas_1.createCanvas(this.root, {
      width: this.size.width,
      height: this.size.height,
      zIndex: String(zIndex)
    });
  };

  return Scene;
}();

exports.Scene = Scene;
},{"../Canvas":"../src/Canvas/index.ts"}],"../src/Scene/SceneResizer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SceneResizer =
/** @class */
function () {
  function SceneResizer(scene) {
    var _this = this;

    this.scene = scene;

    this.updateSize = function () {
      _this.scene.updateCanvasSize();
    };

    window.addEventListener('resize', this.updateSize);
  }

  SceneResizer.prototype.destroy = function () {
    window.removeEventListener('resize', this.updateSize);
  };

  return SceneResizer;
}();

exports.SceneResizer = SceneResizer;
},{}],"../src/Scene/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./Scene"));

__export(require("./SceneResizer"));
},{"./Scene":"../src/Scene/Scene.ts","./SceneResizer":"../src/Scene/SceneResizer.ts"}],"../src/Loop/Loop.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Loop =
/** @class */
function () {
  function Loop() {
    var _this = this;

    this.draw = function () {
      _this.callback();

      _this.id = requestAnimationFrame(_this.draw);
    };
  }

  Loop.prototype.start = function (callback) {
    this.callback = callback;
    this.draw();
  };

  Loop.prototype.stop = function () {
    cancelAnimationFrame(this.id);
  };

  return Loop;
}();

exports.Loop = Loop;
},{}],"../src/Loop/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./Loop"));
},{"./Loop":"../src/Loop/Loop.ts"}],"../src/Particles/Particle.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"../src/Particles/BackgroundParticle.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var BackgroundParticle =
/** @class */
function () {
  function BackgroundParticle(bound, options) {
    this.bound = bound;
    this.options = options;
    this.endAngle = Number((Math.PI * 2).toFixed(2));
    this.x = Math.random() * this.bound.width;
    this.y = Math.random() * this.bound.height;
    this.dx = -1 + Math.random() * 2;
    this.dy = -1 + Math.random() * 2;
  }

  BackgroundParticle.prototype.draw = function (context) {
    context.fillStyle = this.options.color;
    context.beginPath();
    context.arc(Number(this.x.toFixed(2)), Number(this.y.toFixed(2)), Math.round(this.options.radius), 0, this.endAngle, false);
    context.fill();
    this.move();
  };

  BackgroundParticle.prototype.getPoint = function () {
    return {
      x: this.x,
      y: this.y
    };
  };

  BackgroundParticle.prototype.move = function () {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x + this.options.radius > this.bound.width) {
      this.x = this.options.radius;
    } else if (this.x - this.options.radius < 0) {
      this.x = this.bound.width - this.options.radius;
    }

    if (this.y + this.options.radius > this.bound.height) {
      this.y = this.options.radius;
    } else if (this.y - this.options.radius < 0) {
      this.y = this.bound.height - this.options.radius;
    }
  };

  return BackgroundParticle;
}();

exports.BackgroundParticle = BackgroundParticle;
},{}],"../src/Particles/BackgroundParticles.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var index_1 = require("./index");

var BackgroundParticles =
/** @class */
function () {
  function BackgroundParticles(context, bound, options) {
    this.context = context;
    this.bound = bound;
    this.options = options;
    this.particles = [];
    this.update();
  }

  BackgroundParticles.prototype.draw = function () {
    var _this = this;

    this.particles.map(function (particle, i) {
      particle.draw(_this.context);
    });
  };

  BackgroundParticles.prototype.update = function () {
    this.updateParticlesCount();
  };

  BackgroundParticles.prototype.getPoints = function () {
    return this.particles.map(function (particle) {
      return particle.getPoint();
    });
  };

  BackgroundParticles.prototype.updateParticlesCount = function () {
    var count = Math.round(this.options.count);

    if (count <= 0) {
      this.particles = [];
    } else if (this.particles.length > count) {
      this.particles = this.particles.slice(0, this.particles.length - count);
    } else if (this.particles.length < count) {
      for (var i = 0; i <= count - this.particles.length; i++) {
        this.particles.push(new index_1.BackgroundParticle(this.bound, this.options));
      }
    }
  };

  return BackgroundParticles;
}();

exports.BackgroundParticles = BackgroundParticles;
},{"./index":"../src/Particles/index.ts"}],"../src/heplers/number.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function getRandomInt(max, min) {
  if (min === void 0) {
    min = 0;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getRandomInt = getRandomInt;
},{}],"../src/heplers/easing.ts":[function(require,module,exports) {
"use strict";

var _a;

Object.defineProperty(exports, "__esModule", {
  value: true
}); // https://easings.net/

var Easings;

(function (Easings) {
  Easings["easeOutBack"] = "easeOutBack";
  Easings["easeInCubic"] = "easeInCubic";
  Easings["easeOutBounce"] = "easeOutBounce";
  Easings["easeInBounce"] = "easeInBounce";
})(Easings = exports.Easings || (exports.Easings = {}));

exports.easing = (_a = {}, _a[Easings.easeOutBack] = function (x) {
  var c1 = 1.70158;
  var c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}, _a[Easings.easeInCubic] = function (x) {
  return x * x * x;
}, _a[Easings.easeOutBounce] = function (x) {
  var n1 = 7.5625;
  var d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}, _a[Easings.easeInBounce] = function (x) {
  return 1 - this[Easings.easeOutBounce](1 - x);
}, _a);
},{}],"../src/Particles/FigureParticle.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var number_1 = require("../heplers/number");

var easing_1 = require("../heplers/easing");

var StartPostions;

(function (StartPostions) {
  StartPostions[StartPostions["Left"] = 0] = "Left";
  StartPostions[StartPostions["Top"] = 1] = "Top";
  StartPostions[StartPostions["Right"] = 2] = "Right";
  StartPostions[StartPostions["Bottom"] = 3] = "Bottom";
})(StartPostions || (StartPostions = {}));

var FigureParticle =
/** @class */
function () {
  function FigureParticle(bound, targetX, targetY, options) {
    this.bound = bound;
    this.options = options;
    this.dt = 0;
    this.increase = Number((Math.PI * 2 / 100).toFixed(2));
    this.isTargetReached = false;
    this.endAngle = Number((Math.PI * 2).toFixed(2));
    this.randomFactor = Math.random();
    var startPosition = number_1.getRandomInt(3);
    var startPositionOffset = 100;

    switch (startPosition) {
      case StartPostions.Left:
        this.x = 0 - startPositionOffset;
        this.y = Number(number_1.getRandomInt(this.bound.height).toFixed(2));
        break;

      case StartPostions.Top:
        this.x = Number(number_1.getRandomInt(this.bound.width).toFixed(2));
        this.y = Number(this.bound.height.toFixed(2)) + startPositionOffset;
        break;

      case StartPostions.Right:
        this.x = Number(this.bound.width.toFixed(2)) + startPositionOffset;
        this.y = Number(number_1.getRandomInt(this.bound.height).toFixed(2));
        break;

      case StartPostions.Bottom:
        this.x = Number(number_1.getRandomInt(this.bound.width).toFixed(2));
        this.y = 0 - startPositionOffset;
        break;
    }

    this.targetX = Number(targetX.toFixed(2));
    this.targetY = Number(targetY.toFixed(2));
    this.startX = this.x;
    this.startY = this.y;
    var deltaX = this.targetX - this.x;
    var deltaY = this.targetY - this.y;
    this.targetDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    this.dx = Number((this.targetDistance * 0.01).toFixed(2));
    this.dy = Number((this.targetDistance * 0.01).toFixed(2));
  }

  FigureParticle.prototype.draw = function (context) {
    this.x = Number(this.x.toFixed(2));
    this.y = Number(this.y.toFixed(2));
    context.fillStyle = this.options.color;
    context.beginPath();
    context.arc(this.x, this.y, Math.round(this.options.radius), 0, this.endAngle, false);
    context.fill();
    this.move();
  };

  FigureParticle.prototype.getPoint = function () {
    return {
      x: this.x,
      y: this.y
    };
  };

  FigureParticle.prototype.move = function () {
    if (!this.isTargetReached) {
      this.moveToTarget();
    } else {
      this.moveRandom();
    }
  };

  FigureParticle.prototype.moveToTarget = function () {
    var deltaX = this.targetX - this.startX;
    var deltaY = this.targetY - this.startY;
    var iterations = this.options.speed;

    if (this.dt > iterations) {
      this.isTargetReached = true;
      return;
    }

    var deltaRemainX = deltaX * (this.dt / iterations);
    var deltaRemainY = deltaY * (this.dt / iterations);
    var dx = easing_1.easing[this.options.easing](deltaRemainX / deltaX);
    var dy = easing_1.easing[this.options.easing](deltaRemainY / deltaY);
    this.x = deltaX * dx + this.startX;
    this.y = deltaY * dy + this.startY;
    this.dt++;
  };

  FigureParticle.prototype.moveRandom = function () {
    this.x += (this.targetX - Math.abs(this.x + this.dx * 2 * this.randomFactor * Math.sin(this.dt * 1))) / (this.dx * 1);
    this.y += (this.targetY - Math.abs(this.y + this.dy * 2 * this.randomFactor * Math.sin(this.dt * 1))) / (this.dy * 1);
    this.dt += this.increase;
  };

  return FigureParticle;
}();

exports.FigureParticle = FigureParticle;
},{"../heplers/number":"../src/heplers/number.ts","../heplers/easing":"../src/heplers/easing.ts"}],"../src/heplers/svg.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function getPointsFromSvgPath(path, accuracyFactor) {
  if (accuracyFactor === void 0) {
    accuracyFactor = 0.05;
  }

  accuracyFactor = Math.min(Math.max(accuracyFactor, 0), 1);
  var absolutePath = getAbsolutePathList(getParsedSvgPath(path)).reduce(function (path, list) {
    path += list.shift();
    path += list.join(',');
    return path;
  }, '');
  var points = [];
  var svgPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  svgPathElement.setAttribute('d', absolutePath);
  var step = svgPathElement.getTotalLength() * accuracyFactor;

  for (var i = 0; i <= step + 1; i++) {
    points.push(svgPathElement.getPointAtLength(svgPathElement.getTotalLength() / step * i));
  }

  return points;
}

exports.getPointsFromSvgPath = getPointsFromSvgPath;

function getNormalizedSvgPointsByViewPort(points, bounds, maxX, maxY, scaleToViewPortFactor) {
  var _a;

  if (scaleToViewPortFactor === void 0) {
    scaleToViewPortFactor = 0.5;
  }

  scaleToViewPortFactor = Math.min(Math.max(scaleToViewPortFactor, 0), 1);
  var left = bounds[0],
      top = bounds[1],
      right = bounds[2],
      bottom = bounds[3];
  var width = right - Math.abs(left);
  var height = bottom - Math.abs(top);
  var scaleMap = (_a = {}, _a[width] = maxX, _a[height] = maxY, _a);
  var scaleRatio = scaleMap[Math.max(width, height)] / Math.max(width, height) * scaleToViewPortFactor;

  var normalized = function normalized(a, b) {
    return a - b;
  };

  var scale = function scale(a) {
    return a * scaleRatio;
  };

  var center = function center(a, b, c) {
    return a + b / 2 - c / 2;
  };

  return points.map(function (point) {
    return {
      x: center(scale(normalized(point.x, Math.abs(left))), maxX, width * scaleRatio),
      y: center(scale(normalized(point.y, Math.abs(top))), maxY, height * scaleRatio)
    };
  });
}

exports.getNormalizedSvgPointsByViewPort = getNormalizedSvgPointsByViewPort; // https://github.com/dy/svg-path-bounds/
// [left, top, right, bottom]

function getSvgPathBounds(path) {
  var commands = getAbsolutePathList(getParsedSvgPath(path));
  var bounds = [Infinity, Infinity, -Infinity, -Infinity];

  for (var i = 0, l = commands.length; i < l; i++) {
    var points = commands[i].slice(1);

    for (var j = 0; j < points.length; j += 2) {
      if (points[j + 0] < bounds[0]) bounds[0] = points[j + 0];
      if (points[j + 1] < bounds[1]) bounds[1] = points[j + 1];
      if (points[j + 0] > bounds[2]) bounds[2] = points[j + 0];
      if (points[j + 1] > bounds[3]) bounds[3] = points[j + 1];
    }
  }

  return bounds;
}

exports.getSvgPathBounds = getSvgPathBounds; // https://github.com/jkroso/parse-svg-path

function getParsedSvgPath(path) {
  var numbersRegex = getParsedSvgPath.numbersRegex;
  var segment = getParsedSvgPath.segmentRegex;
  var typesMap = getParsedSvgPath.typesMap;
  var data = [];
  path.replace(segment, function (_, command, args) {
    var type = command.toLowerCase();
    var numbers = args.match(numbersRegex);
    args = numbers ? numbers.map(Number) : [];

    if (type == 'm' && args.length > 2) {
      data.push([command].concat(args.splice(0, 2)));
      type = 'l';
      command = command == 'm' ? 'l' : 'L';
    }

    while (true) {
      if (args.length == typesMap[type]) {
        args.unshift(command);
        return data.push(args);
      }

      if (args.length < typesMap[type]) {
        throw new Error('malformed path data');
      }

      data.push([command].concat(args.splice(0, typesMap[type])));
    }
  });
  return data;
}

getParsedSvgPath.typesMap = {
  a: 7,
  c: 6,
  h: 1,
  l: 2,
  m: 2,
  q: 4,
  s: 4,
  t: 2,
  v: 1,
  z: 0
};
getParsedSvgPath.segmentRegex = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
getParsedSvgPath.numbersRegex = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig; // https://github.com/jkroso/abs-svg-path

function getAbsolutePathList(path) {
  var startX = 0;
  var startY = 0;
  var x = 0;
  var y = 0;
  return path.map(function (seg) {
    seg = seg.slice();
    var type = seg[0];
    var command = type.toUpperCase(); // is relative

    if (type != command) {
      seg[0] = command;

      switch (type) {
        case 'a':
          seg[6] += x;
          seg[7] += y;
          break;

        case 'v':
          seg[1] += y;
          break;

        case 'h':
          seg[1] += x;
          break;

        default:
          for (var i = 1; i < seg.length;) {
            seg[i++] += x;
            seg[i++] += y;
          }

      }
    } // update cursor state


    switch (command) {
      case 'Z':
        x = startX;
        y = startY;
        break;

      case 'H':
        x = seg[1];
        break;

      case 'V':
        y = seg[1];
        break;

      case 'M':
        x = startX = seg[1];
        y = startY = seg[2];
        break;

      default:
        x = seg[seg.length - 2];
        y = seg[seg.length - 1];
    }

    return seg;
  });
}
},{}],"../src/heplers/object.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

function isObject(value) {
  if (_typeof(value) === 'object' && value != null && !value.length && !(value instanceof Node)) {
    return true;
  }

  return false;
}

function deepMutableExtend(target, partial) {
  for (var _i = 0, _a = Object.entries(partial); _i < _a.length; _i++) {
    var _b = _a[_i],
        key = _b[0],
        value = _b[1];

    if (!target.hasOwnProperty(key)) {
      continue;
    }

    if (isObject(target[key]) && isObject(value)) {
      target[key] = deepMutableExtend(target[key], value);
      continue;
    }

    target[key] = value;
  }

  return target;
}

exports.deepMutableExtend = deepMutableExtend;

function shallowEqualArrays(arrA, arrB) {
  if (arrA === arrB) {
    return true;
  }

  if (!arrA || !arrB) {
    return false;
  }

  var len = arrA.length;

  if (arrB.length !== len) {
    return false;
  }

  for (var i = 0; i < len; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }

  return true;
}

exports.shallowEqualArrays = shallowEqualArrays;
},{}],"../src/heplers/function.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var object_1 = require("./object");

function callWhenArgsChanged(fn, context) {
  var prevArgs;
  return function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    if (!object_1.shallowEqualArrays(prevArgs, args)) {
      prevArgs = args;
      return fn.apply(context || this, arguments);
    }
  };
}

exports.callWhenArgsChanged = callWhenArgsChanged;
},{"./object":"../src/heplers/object.ts"}],"../src/Particles/FigureParticles.ts":[function(require,module,exports) {
"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var index_1 = require("./index");

var svg_1 = require("../heplers/svg");

var function_1 = require("../heplers/function");

var FigureParticles =
/** @class */
function () {
  function FigureParticles(context, bound, options) {
    this.context = context;
    this.bound = bound;
    this.options = options;
    this.particles = [];
    this.updateFigure = function_1.callWhenArgsChanged(this.updateFigure, this);
    this.update();
  }

  FigureParticles.prototype.draw = function () {
    var _this = this;

    this.particles.map(function (particle) {
      particle.draw(_this.context);
    });
  };

  FigureParticles.prototype.update = function () {
    this.updateFigure(this.options.paths, this.options.accuracyFactor, this.options.scaleToViewPortFactor, this.bound.width, this.bound.height, this.options.speed, this.options.easing);
  };

  FigureParticles.prototype.getPoints = function () {
    return this.particles.map(function (particle) {
      return particle.getPoint();
    });
  };

  FigureParticles.prototype.updateFigure = function (paths, accuracyFactor, scaleToViewPortFactor, boundWidth, boundHeight, speed, easing) {
    this.particles = [];
    var bounds = svg_1.getSvgPathBounds(paths.join(' '));
    var points = paths.reduce(function (points, path) {
      points = __spreadArrays(points, svg_1.getNormalizedSvgPointsByViewPort(svg_1.getPointsFromSvgPath(path, accuracyFactor), bounds, boundWidth, boundHeight, scaleToViewPortFactor));
      return points;
    }, []);

    for (var i = 0; i < points.length; i++) {
      this.particles.push(new index_1.FigureParticle(this.bound, points[i].x, points[i].y, this.options));
    }
  };

  return FigureParticles;
}();

exports.FigureParticles = FigureParticles;
},{"./index":"../src/Particles/index.ts","../heplers/svg":"../src/heplers/svg.ts","../heplers/function":"../src/heplers/function.ts"}],"../src/Particles/ParticlesConnections.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ParticlesConnections =
/** @class */
function () {
  function ParticlesConnections(context, connections, backgroundParticles, figureParticles, options) {
    this.context = context;
    this.connections = connections;
    this.backgroundParticles = backgroundParticles;
    this.figureParticles = figureParticles;
    this.options = options;
  }

  ParticlesConnections.prototype.draw = function () {
    this.backgroundParticles.draw();
    this.figureParticles.draw();
    this.drawPointsConnections(this.backgroundParticles.getPoints(), this.options.backgroundVisibilityDistance);
    this.drawPointsConnections(this.figureParticles.getPoints(), this.options.figureVisibilityDistance);
  };

  ParticlesConnections.prototype.update = function () {
    this.backgroundParticles.update();
    this.figureParticles.update();
  };

  ParticlesConnections.prototype.drawPointsConnections = function (points, visibilityDistance) {
    for (var i = 0; i < points.length; i++) {
      for (var j = i + 1; j < points.length; j++) {
        var start = points[i];
        var end = points[j];
        this.connections.draw(this.context, start, end, visibilityDistance);
      }
    }
  };

  return ParticlesConnections;
}();

exports.ParticlesConnections = ParticlesConnections;
},{}],"../src/Particles/ParticlesRenderLoop.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ParticlesRenderLoop =
/** @class */
function () {
  function ParticlesRenderLoop(scene, loop, particlesConnections, options) {
    this.loop = loop;
    this.loop.start(function () {
      options === null || options === void 0 ? void 0 : options.onBeforeRender();
      scene.clear();
      particlesConnections.draw();
      particlesConnections.update();
      options === null || options === void 0 ? void 0 : options.onAfterRender();
    });
  }

  ParticlesRenderLoop.prototype.stop = function () {
    this.loop.stop();
  };

  return ParticlesRenderLoop;
}();

exports.ParticlesRenderLoop = ParticlesRenderLoop;
},{}],"../src/Particles/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./Particle"));

__export(require("./BackgroundParticle"));

__export(require("./BackgroundParticles"));

__export(require("./FigureParticle"));

__export(require("./FigureParticles"));

__export(require("./ParticlesConnections"));

__export(require("./ParticlesRenderLoop"));
},{"./Particle":"../src/Particles/Particle.ts","./BackgroundParticle":"../src/Particles/BackgroundParticle.ts","./BackgroundParticles":"../src/Particles/BackgroundParticles.ts","./FigureParticle":"../src/Particles/FigureParticle.ts","./FigureParticles":"../src/Particles/FigureParticles.ts","./ParticlesConnections":"../src/Particles/ParticlesConnections.ts","./ParticlesRenderLoop":"../src/Particles/ParticlesRenderLoop.ts"}],"../src/heplers/string.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
}); // https://css-tricks.com/converting-color-spaces-in-javascript/

function hexToRGBA(h, alpha) {
  if (alpha === void 0) {
    alpha = 1;
  }

  var r = '0';
  var g = '0';
  var b = '0'; // 3 digits

  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3]; // 6 digits
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  return "rgba(" + +r + ", " + +g + ", " + +b + ", " + alpha + ")";
}

exports.hexToRGBA = hexToRGBA;
},{}],"../src/heplers/point.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var string_1 = require("./string");

function findDistance(start, end) {
  var dx = start.x - end.x;
  var dy = start.y - end.y;
  return Math.sqrt(dx * dx + dy * dy);
}

exports.findDistance = findDistance;

function getCalculatedColorByDistance(distance, visibilityDistance, color) {
  var alpha = 1 - distance / visibilityDistance;
  return string_1.hexToRGBA(color, alpha);
}

exports.getCalculatedColorByDistance = getCalculatedColorByDistance;
},{"./string":"../src/heplers/string.ts"}],"../src/Connections/Connection.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var point_1 = require("../heplers/point");

var Connection =
/** @class */
function () {
  function Connection(options) {
    this.options = options;
  }

  Connection.prototype.draw = function (context, start, end, visibilityDistance) {
    var distance = point_1.findDistance(start, end);

    if (distance < visibilityDistance) {
      context.beginPath();
      context.strokeStyle = point_1.getCalculatedColorByDistance(distance, visibilityDistance, this.options.color);
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
      context.closePath();
    }
  };

  return Connection;
}();

exports.Connection = Connection;
},{"../heplers/point":"../src/heplers/point.ts"}],"../src/Connections/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./Connection"));
},{"./Connection":"../src/Connections/Connection.ts"}],"../src/main.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Scene_1 = require("./Scene");

var Loop_1 = require("./Loop");

var Particles_1 = require("./Particles");

var Connections_1 = require("./Connections");

var number_1 = require("./heplers/number");

var object_1 = require("./heplers/object");

var easing_1 = require("./heplers/easing");

var Main =
/** @class */
function () {
  function Main(options) {
    this.options = {
      root: document.getElementById('particles'),
      scene: {
        backgroundColor: '#000'
      },
      particles: {
        backgroundParticles: {
          count: 100,
          color: '#fff',
          radius: number_1.getRandomInt(4, 2)
        },
        figure: {
          paths: [],
          color: '#f00',
          radius: number_1.getRandomInt(4, 2),
          accuracyFactor: 0.05,
          scaleToViewPortFactor: 0.8,
          easing: easing_1.Easings.easeInCubic,
          speed: 100
        }
      },
      connections: {
        figureVisibilityDistance: 100,
        backgroundVisibilityDistance: 100,
        color: '#fff'
      },
      loop: {
        onBeforeRender: function onBeforeRender() {},
        onAfterRender: function onAfterRender() {}
      }
    };
    this.updateConfig(options);
    this.scene = new Scene_1.Scene(this.options.root, 0, this.options.scene);
    this.sceneResizer = new Scene_1.SceneResizer(this.scene);
    this.loop = new Particles_1.ParticlesRenderLoop(this.scene, new Loop_1.Loop(), new Particles_1.ParticlesConnections(this.scene.context, new Connections_1.Connection(this.options.connections), new Particles_1.BackgroundParticles(this.scene.context, this.scene.size, this.options.particles.backgroundParticles), new Particles_1.FigureParticles(this.scene.context, this.scene.size, this.options.particles.figure), this.options.connections), this.options.loop);
  }

  Main.prototype.updateConfig = function (options) {
    object_1.deepMutableExtend(this.options, options);
  };

  Main.prototype.destroy = function () {
    this.loop.stop();
    this.scene.destroy();
    this.sceneResizer.destroy();
    this.loop = null;
    this.scene = null;
    this.sceneResizer = null;
  };

  Main.Easings = easing_1.Easings;
  return Main;
}(); // @ts-ignore


module.exports = Main;
},{"./Scene":"../src/Scene/index.ts","./Loop":"../src/Loop/index.ts","./Particles":"../src/Particles/index.ts","./Connections":"../src/Connections/index.ts","./heplers/number":"../src/heplers/number.ts","./heplers/object":"../src/heplers/object.ts","./heplers/easing":"../src/heplers/easing.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64695" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/main.ts"], "CanvasSvgParticles")
//# sourceMappingURL=/main.62d00c9e.js.map