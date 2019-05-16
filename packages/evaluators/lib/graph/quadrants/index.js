"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _constants = require("./constants");

var _compareShapes = _interopRequireDefault(require("./compareShapes"));

var checkAnswer = function checkAnswer(answer, userResponse, ignoreRepeatedShapes, ignoreLabels) {
  var result = {
    commonResult: false,
    details: []
  };
  var trueAnswerValue = answer.value;
  var trueShapes = trueAnswerValue.filter(function(item) {
    return !item.subElement;
  });
  var compareShapes = new _compareShapes["default"](
    trueAnswerValue,
    userResponse,
    ignoreLabels !== _constants.IgnoreLabels.NO
  );
  userResponse
    .filter(function(elem) {
      return !elem.subElement;
    })
    .forEach(function(testShape) {
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

  if (
    result.details.findIndex(function(item) {
      return !item.result;
    }) > -1
  ) {
    result.commonResult = false;
    return result;
  } // check that all shapes are resolved

  var relatedIds = [];
  result.details.forEach(function(item) {
    if (
      relatedIds.findIndex(function(id) {
        return id === item.relatedId;
      }) === -1
    ) {
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
      var sameShapes = result.details.filter(function(item) {
        return item.relatedId === relatedIds[i];
      });
      var sameShapesType = userResponse.find(function(item) {
        return item.id === sameShapes[0].id;
      }).type;

      if (
        sameShapes.length > 1 &&
        sameShapesType !== _constants.ShapeTypes.POINT &&
        sameShapesType !== _constants.ShapeTypes.SEGMENT &&
        sameShapesType !== _constants.ShapeTypes.VECTOR &&
        sameShapesType !== _constants.ShapeTypes.POLYGON &&
        sameShapesType !== _constants.ShapeTypes.POLYNOM
      ) {
        var allowedSubElementsIds = userResponse.find(function(item) {
          return item.id === sameShapes[0].id;
        }).subElementsIds;

        var _loop2 = function _loop2(j) {
          var checkableShape = userResponse.find(function(item) {
            return item.id === sameShapes[j].id;
          });

          switch (checkableShape.type) {
            case _constants.ShapeTypes.CIRCLE:
            case _constants.ShapeTypes.EXPONENT:
            case _constants.ShapeTypes.LOGARITHM:
              if (
                !compareShapes.compare(checkableShape.subElementsIds.endPoint, allowedSubElementsIds.endPoint).result
              ) {
                sameShapes[j].result = false;
                result.commonResult = false;
              }

              break;

            case _constants.ShapeTypes.ELLIPSE:
            case _constants.ShapeTypes.HYPERBOLA:
              if (!compareShapes.compare(checkableShape.subElementsIds[2], allowedSubElementsIds[2]).result) {
                sameShapes[j].result = false;
                result.commonResult = false;
              }

              break;

            case _constants.ShapeTypes.PARABOLA:
            case _constants.ShapeTypes.SINE:
            case _constants.ShapeTypes.TANGENT:
            case _constants.ShapeTypes.SECANT:
            case _constants.ShapeTypes.LINE:
            case _constants.ShapeTypes.RAY:
            default:
              if (
                !compareShapes.compare(checkableShape.subElementsIds.startPoint, allowedSubElementsIds.startPoint)
                  .result ||
                !compareShapes.compare(checkableShape.subElementsIds.endPoint, allowedSubElementsIds.endPoint).result
              ) {
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

  var _loop3 = function _loop3(i) {
    var sameShapes = result.details.filter(function(item) {
      return item.relatedId === relatedIds[i];
    });

    if (sameShapes.length > 1) {
      for (var j = 1; j < sameShapes.length; j++) {
        sameShapes[j].result = false;
        result.commonResult = false;
      }
    }
  };

  for (var i = 0; i < relatedIds.length; i++) {
    _loop3(i);
  }

  return result;
};

var evaluator = function evaluator(_ref) {
  var userResponse = _ref.userResponse,
    validation = _ref.validation;
  var valid_response = validation.valid_response,
    alt_responses = validation.alt_responses,
    ignore_repeated_shapes = validation.ignore_repeated_shapes,
    ignore_labels = validation.ignore_labels;
  var score = 0;
  var maxScore = 1;
  var evaluation = {};
  var answers = [valid_response];

  if (alt_responses) {
    answers = answers.concat((0, _toConsumableArray2["default"])(alt_responses));
  }

  var result = {};
  answers.forEach(function(answer, index) {
    result = checkAnswer(answer, userResponse, ignore_repeated_shapes, ignore_labels);

    if (result.commonResult) {
      score = Math.max(answer.score, score);
    }

    maxScore = Math.max(answer.score, maxScore);
    evaluation[index] = result;
  });
  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};

var _default = evaluator;
exports["default"] = _default;
