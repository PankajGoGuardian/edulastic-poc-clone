"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _constants = require("./constants");

var _compareShapes = _interopRequireDefault(require("./compareShapes"));

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var evaluateApi = function evaluateApi(data) {
  return _axios["default"].post("".concat(process.env.MATH_API_URI, "evaluate"), data, {
    headers: {
      Authorization: "Bearer Token: U4aJ6616mlTFKK"
    }
  }).then(function (result) {
    return result.data.result;
  });
};

var checkAnswer = function checkAnswer(answer, userResponse, ignoreRepeatedShapes, ignoreLabels) {
  var result = {
    commonResult: false,
    details: []
  };
  var trueAnswerValue = answer.value;
  var trueShapes = trueAnswerValue.filter(function (item) {
    return !item.subElement;
  });
  var compareShapes = new _compareShapes["default"](trueAnswerValue, userResponse, ignoreLabels !== _constants.IgnoreLabels.NO);
  userResponse.filter(function (elem) {
    return !elem.subElement;
  }).forEach(function (testShape) {
    var compareResult = {
      id: testShape.id,
      result: false
    };

    for (var i = 0; i < trueShapes.length; i++) {
      compareResult = compareShapes.compare(testShape.id, trueShapes[i].id);

      if (compareResult.result) {
        break;
      }
    }

    result.details.push(compareResult);
  }); // if result contain error shapes

  if (result.details.findIndex(function (item) {
    return !item.result;
  }) > -1) {
    result.commonResult = false;
    return result;
  } // check that all shapes are resolved


  var relatedIds = [];
  result.details.forEach(function (item) {
    if (relatedIds.findIndex(function (id) {
      return id === item.relatedId;
    }) === -1) {
      relatedIds.push(item.relatedId);
    }
  });

  if (relatedIds.length < trueShapes.length) {
    result.commonResult = false;
    return result;
  } // compare by slope


  if (ignoreRepeatedShapes && ignoreRepeatedShapes === _constants.IgnoreRepeatedShapes.COMPARE_BY_SLOPE) {
    result.commonResult = true;
    return result;
  } // compare by points


  if (ignoreRepeatedShapes && ignoreRepeatedShapes === _constants.IgnoreRepeatedShapes.COMPARE_BY_POINTS) {
    result.commonResult = true;

    var _loop = function _loop(i) {
      var relatedShape = trueAnswerValue.find(function (item) {
        return item.id === relatedIds[i];
      });
      var sameShapes = result.details.filter(function (item) {
        return item.relatedId === relatedIds[i];
      });

      if (sameShapes.length > 1 && relatedShape.type !== _constants.ShapeTypes.POINT && relatedShape.type !== _constants.ShapeTypes.SEGMENT && relatedShape.type !== _constants.ShapeTypes.VECTOR && relatedShape.type !== _constants.ShapeTypes.POLYGON && relatedShape.type !== _constants.ShapeTypes.POLYNOM && relatedShape.type !== _constants.ShapeTypes.EQUATION && relatedShape.type !== _constants.ShapeTypes.PARABOLA2) {
        var firstShape = userResponse.find(function (item) {
          return item.id === sameShapes[0].id;
        });

        var _loop2 = function _loop2(j) {
          var checkableShape = userResponse.find(function (item) {
            return item.id === sameShapes[j].id;
          });

          switch (checkableShape.type) {
            case _constants.ShapeTypes.RAY:
            case _constants.ShapeTypes.PARABOLA:
            case _constants.ShapeTypes.CIRCLE:
            case _constants.ShapeTypes.EXPONENT:
            case _constants.ShapeTypes.LOGARITHM:
              if (!compareShapes.compare(firstShape.subElementsIds.endPoint, checkableShape.subElementsIds.endPoint, true).result) {
                sameShapes[j].result = false;
                result.commonResult = false;
              }

              break;

            case _constants.ShapeTypes.ELLIPSE:
            case _constants.ShapeTypes.HYPERBOLA:
              if (!compareShapes.compare(firstShape.subElementsIds[2], checkableShape.subElementsIds[2], true).result) {
                sameShapes[j].result = false;
                result.commonResult = false;
              }

              break;

            case _constants.ShapeTypes.SINE:
            case _constants.ShapeTypes.TANGENT:
            case _constants.ShapeTypes.SECANT:
            case _constants.ShapeTypes.LINE:
            default:
              if (!(compareShapes.compare(firstShape.subElementsIds.startPoint, checkableShape.subElementsIds.startPoint, true).result && compareShapes.compare(firstShape.subElementsIds.endPoint, checkableShape.subElementsIds.endPoint, true).result) && !(compareShapes.compare(firstShape.subElementsIds.startPoint, checkableShape.subElementsIds.endPoint, true).result && compareShapes.compare(firstShape.subElementsIds.endPoint, checkableShape.subElementsIds.startPoint, true).result)) {
                sameShapes[j].result = false;
                result.commonResult = false;
              }

          }
        };

        for (var j = 1; j < sameShapes.length; j++) {
          _loop2(j);
        }
      }
    };

    for (var i = 0; i < relatedIds.length; i++) {
      _loop(i);
    }

    return result;
  } // compare by default


  result.commonResult = true;

  var _loop3 = function _loop3(_i) {
    var sameShapes = result.details.filter(function (item) {
      return item.relatedId === relatedIds[_i];
    });

    if (sameShapes.length > 1) {
      for (var j = 1; j < sameShapes.length; j++) {
        sameShapes[j].result = false;
        result.commonResult = false;
      }
    }
  };

  for (var _i = 0; _i < relatedIds.length; _i++) {
    _loop3(_i);
  }

  return result;
};

var getParabolaThirdPoint = function getParabolaThirdPoint(startPoint, endPoint) {
  if (startPoint.x < endPoint.x && startPoint.y <= endPoint.y) {
    return {
      x: endPoint.x - (endPoint.x - startPoint.x) * 2,
      y: endPoint.y
    };
  }

  if (startPoint.x >= endPoint.x && startPoint.y < endPoint.y) {
    return {
      x: endPoint.x,
      y: endPoint.y - (endPoint.y - startPoint.y) * 2
    };
  }

  if (startPoint.x > endPoint.x && startPoint.y >= endPoint.y) {
    return {
      x: endPoint.x + (startPoint.x - endPoint.x) * 2,
      y: endPoint.y
    };
  }

  return {
    x: endPoint.x,
    y: endPoint.y + (startPoint.y - endPoint.y) * 2
  };
};

var serialize = function serialize(shapes, lineTypes, points) {
  var getShape = function getShape(shape) {
    return shape[0] === "eqn" ? "['eqn','".concat(shape[1], "']") : "['".concat(shape[0], "',[").concat(shape[1].join(","), "]]");
  };

  var serializeShapes = shapes.length ? "[".concat(shapes.map(getShape).join(","), "]") : null;
  var serializeLineTypes = lineTypes.length ? "[".concat(lineTypes.map(function (x) {
    return "'".concat(x, "'");
  }).join(","), "]") : null;
  var serializePoints = points.length ? "[".concat(points.join(","), "]") : null;
  return [serializeShapes, serializeLineTypes, serializePoints].filter(function (el) {
    return !!el;
  }).join(",");
};

var buildGraphApiResponse = function buildGraphApiResponse() {
  var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var allowedShapes = [_constants.ShapeTypes.POINT, _constants.ShapeTypes.SEGMENT, _constants.ShapeTypes.RAY, _constants.ShapeTypes.VECTOR, _constants.ShapeTypes.PARABOLA, _constants.ShapeTypes.PARABOLA2, _constants.ShapeTypes.EQUATION, _constants.ShapeTypes.POLYNOM, _constants.ShapeTypes.SECANT, _constants.ShapeTypes.TANGENT, _constants.ShapeTypes.LOGARITHM, _constants.ShapeTypes.EXPONENT, _constants.ShapeTypes.HYPERBOLA, _constants.ShapeTypes.ELLIPSE, _constants.ShapeTypes.CIRCLE, _constants.ShapeTypes.LINE, _constants.ShapeTypes.POLYGON, _constants.ShapeTypes.SINE, _constants.ShapeTypes.AREA];
  var more2PointShapes = [_constants.ShapeTypes.POLYNOM, _constants.ShapeTypes.HYPERBOLA, _constants.ShapeTypes.ELLIPSE, _constants.ShapeTypes.POLYGON, _constants.ShapeTypes.PARABOLA2];
  var shapes = [];
  var lineTypes = [];
  var points = [];
  elements.forEach(function (el) {
    if (el.subElement || !allowedShapes.includes(el.type)) {
      return;
    }

    if (el.type === _constants.ShapeTypes.AREA) {
      points.push("(".concat(+el.x.toFixed(4), ",").concat(+el.y.toFixed(4), ")"));
      return;
    }

    if (el.type === _constants.ShapeTypes.EQUATION) {
      shapes.push(["eqn", el.latex]);
      lineTypes.push(el.latex.indexOf(">") > -1 || el.latex.indexOf("<") > -1 ? "dashed" : "solid");
      return;
    }

    var shapePoints = [];

    if (el.type === _constants.ShapeTypes.POINT) {
      shapePoints.push("(".concat(+el.x.toFixed(4), ",").concat(+el.y.toFixed(4), ")"));
    } else if (more2PointShapes.includes(el.type)) {
      Object.values(el.subElementsIds).forEach(function (id) {
        var point = elements.find(function (x) {
          return x.id === id;
        });

        if (point) {
          shapePoints.push("(".concat(+point.x.toFixed(4), ",").concat(+point.y.toFixed(4), ")"));
        }
      });
    } else {
      var startPoint = elements.find(function (x) {
        return x.id === el.subElementsIds.startPoint;
      });

      if (startPoint) {
        shapePoints.push("(".concat(+startPoint.x.toFixed(4), ",").concat(+startPoint.y.toFixed(4), ")"));
      }

      var endPoint = elements.find(function (x) {
        return x.id === el.subElementsIds.endPoint;
      });

      if (endPoint) {
        shapePoints.push("(".concat(+endPoint.x.toFixed(4), ",").concat(+endPoint.y.toFixed(4), ")"));
      }

      if (el.type === _constants.ShapeTypes.PARABOLA) {
        var thirdPoint = getParabolaThirdPoint(startPoint, endPoint);
        shapePoints.push("(".concat(+thirdPoint.x.toFixed(4), ",").concat(+thirdPoint.y.toFixed(4), ")"));
      }
    }

    shapes.push([el.type, shapePoints]);

    if (![_constants.ShapeTypes.POINT, _constants.ShapeTypes.RAY, _constants.ShapeTypes.VECTOR, _constants.ShapeTypes.SEGMENT].includes(el.type)) {
      lineTypes.push(el.dashed ? "dashed" : "solid");

      if (!points.length) {
        points.push("(0,0)");
      }
    }
  });
  return serialize(shapes, lineTypes, points);
};

var checkEquations = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(answer, userResponse) {
    var apiResult;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return evaluateApi({
              input: buildGraphApiResponse(userResponse),
              expected: buildGraphApiResponse(answer),
              checks: "evaluateGraphEquations"
            });

          case 2:
            apiResult = _context.sent;

            if (!(apiResult === "true")) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", {
              commonResult: true,
              details: userResponse.map(function (x) {
                return {
                  id: x.id,
                  result: true
                };
              })
            });

          case 5:
            return _context.abrupt("return", {
              commonResult: false,
              details: userResponse.map(function (x) {
                return {
                  id: x.id,
                  result: false
                };
              })
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function checkEquations(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var eqnToObject = function eqnToObject(validResponse) {
  if (validResponse && validResponse.value) {
    var value = [];
    validResponse.value.forEach(function (item) {
      var elements = [item];

      if (item.type === "equation") {
        // check if the equation belongs to a line
        if (item.apiLatex.match("line")) {
          // match & extract coordinates
          var coordinates = item.apiLatex.match(/\-*[0-9]+,\-*[0-9]+/g).map(function (o) {
            return o.split(",").map(Number);
          });
          elements = [{
            type: "line",
            label: item.label,
            id: item.id,
            subElementsIds: {
              startPoint: "".concat(item.id, "-start"),
              endPoint: "".concat(item.id, "-end")
            }
          }, {
            type: "point",
            x: coordinates[0][0],
            y: coordinates[0][1],
            id: "".concat(item.id, "-start"),
            label: item.pointsLabel[0],
            subElement: true
          }, {
            type: "point",
            x: coordinates[1][0],
            y: coordinates[1][1],
            id: "".concat(item.id, "-end"),
            label: item.pointsLabel[1],
            subElement: true
          }];
        }
      }

      value.push.apply(value, (0, _toConsumableArray2["default"])(elements));
    });
    return _objectSpread({}, validResponse, {
      value: value
    });
  }

  return validResponse;
};

var evaluator = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
    var userResponse, validation, validResponse, altResponses, ignore_repeated_shapes, ignoreLabels, score, maxScore, evaluation, answers, result, _iterator, _step, _step$value, index, answer;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userResponse = _ref2.userResponse, validation = _ref2.validation;
            validResponse = validation.validResponse, altResponses = validation.altResponses, ignore_repeated_shapes = validation.ignore_repeated_shapes, ignoreLabels = validation.ignoreLabels;
            score = 0;
            maxScore = 1;
            evaluation = {};
            answers = [eqnToObject(validResponse)];

            if (altResponses) {
              answers = answers.concat((0, _toConsumableArray2["default"])(altResponses));
            }

            result = {};
            _iterator = _createForOfIteratorHelper(answers.entries());
            _context2.prev = 9;

            _iterator.s();

          case 11:
            if ((_step = _iterator.n()).done) {
              _context2.next = 25;
              break;
            }

            _step$value = (0, _slicedToArray2["default"])(_step.value, 2), index = _step$value[0], answer = _step$value[1];

            if (userResponse.find(function (x) {
              return x.type === _constants.ShapeTypes.DRAG_DROP;
            })) {
              _context2.next = 19;
              break;
            }

            _context2.next = 16;
            return checkEquations(answer.value, userResponse);

          case 16:
            result = _context2.sent;
            _context2.next = 20;
            break;

          case 19:
            result = checkAnswer(answer, userResponse, ignore_repeated_shapes, ignoreLabels);

          case 20:
            if (result.commonResult) {
              score = Math.max(answer.score, score);
            }

            maxScore = Math.max(answer.score, maxScore);
            evaluation[index] = result;

          case 23:
            _context2.next = 11;
            break;

          case 25:
            _context2.next = 30;
            break;

          case 27:
            _context2.prev = 27;
            _context2.t0 = _context2["catch"](9);

            _iterator.e(_context2.t0);

          case 30:
            _context2.prev = 30;

            _iterator.f();

            return _context2.finish(30);

          case 33:
            return _context2.abrupt("return", {
              score: score,
              maxScore: maxScore,
              evaluation: evaluation
            });

          case 34:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[9, 27, 30, 33]]);
  }));

  return function evaluator(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var _default = evaluator;
exports["default"] = _default;