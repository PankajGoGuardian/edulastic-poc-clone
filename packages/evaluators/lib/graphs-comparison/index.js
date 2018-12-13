"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _shapeTypes = require("./constants/shapeTypes");

var _compareShapes = _interopRequireDefault(require("./compareShapes"));

var checkAnswer = function checkAnswer(trueAnswer, testAnswer) {
  var result = {
    commonResult: false,
    details: []
  };
  var trueAnswerValue = trueAnswer.valid_response.value;
  var trueShapes = trueAnswerValue.filter(function (item) {
    return !item.subElement;
  });
  var compareShapes = new _compareShapes.default(trueAnswerValue, testAnswer);
  testAnswer.filter(function (elem) {
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


  if (trueAnswer.ignore_repeated_shapes && trueAnswer.ignore_repeated_shapes === 'yes') {
    result.commonResult = true;
    return result;
  } // compare by points


  if (trueAnswer.ignore_repeated_shapes && trueAnswer.ignore_repeated_shapes === 'strict') {
    result.commonResult = true;

    var _loop = function _loop(i) {
      var sameShapes = result.details.filter(function (item) {
        return item.relatedId === relatedIds[i];
      });
      var sameShapesType = testAnswer.find(function (item) {
        return item.id === sameShapes[0].id;
      }).type;

      if (sameShapes.length > 1 && sameShapesType !== _shapeTypes.ShapeTypes.POINT && sameShapesType !== _shapeTypes.ShapeTypes.SEGMENT && sameShapesType !== _shapeTypes.ShapeTypes.VECTOR && sameShapesType !== _shapeTypes.ShapeTypes.POLYGON) {
        var allowedSubElementsIds = testAnswer.find(function (item) {
          return item.id === sameShapes[0].id;
        }).subElementsIds;

        var _loop2 = function _loop2(j) {
          var checkableShape = testAnswer.find(function (item) {
            return item.id === sameShapes[j].id;
          });

          switch (checkableShape.type) {
            case _shapeTypes.ShapeTypes.CIRCLE:
              if (checkableShape.subElementsIds.endPoint !== allowedSubElementsIds.endPoint) {
                sameShapes[j].result = false;
                result.commonResult = false;
              }

              break;

            case _shapeTypes.ShapeTypes.PARABOLA:
            case _shapeTypes.ShapeTypes.SINE:
            case _shapeTypes.ShapeTypes.LINE:
            case _shapeTypes.ShapeTypes.RAY:
            default:
              if (checkableShape.subElementsIds.startPoint !== allowedSubElementsIds.startPoint || checkableShape.subElementsIds.endPoint !== allowedSubElementsIds.endPoint) {
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
    var sameShapes = result.details.filter(function (item) {
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

var _default = {
  checkAnswer: checkAnswer
};
exports.default = _default;