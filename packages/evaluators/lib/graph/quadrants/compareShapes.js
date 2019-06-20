"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _constants = require("./constants");

var _lineFunction = _interopRequireDefault(require("./lineFunction"));

var _parabolaFunction = _interopRequireDefault(require("./parabolaFunction"));

var _ellipseFunction = _interopRequireDefault(require("./ellipseFunction"));

var _hyperbolaFunction = _interopRequireDefault(require("./hyperbolaFunction"));

var _exponentFunction = _interopRequireDefault(require("./exponentFunction"));

var _logarithmFunction = _interopRequireDefault(require("./logarithmFunction"));

var _polynomFunction = _interopRequireDefault(require("./polynomFunction"));

var labelsAreEqual = function labelsAreEqual(label1, label2) {
  var text1 = typeof label1 === "string" ? label1 : "";
  var text2 = typeof label2 === "string" ? label2 : "";
  text1 = text1
    .replace(/<(.|\n)*?>/g, "")
    .trim()
    .toLowerCase();
  text2 = text2
    .replace(/<(.|\n)*?>/g, "")
    .trim()
    .toLowerCase();
  return text1 === text2;
};

var CompareShapes =
  /*#__PURE__*/
  (function() {
    function CompareShapes(trueAnswerValue, testAnswer, ignoreLabels) {
      (0, _classCallCheck2["default"])(this, CompareShapes);
      this.trueAnswerValue = trueAnswerValue;
      this.testAnswer = testAnswer;
      this.ignoreLabels = ignoreLabels;
    }

    (0, _createClass2["default"])(CompareShapes, [
      {
        key: "compare",
        value: function compare(testId, trueId) {
          var compareTestShapes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          var testShape = this.testAnswer.find(function(item) {
            return item.id === testId;
          });
          var trueShape = compareTestShapes
            ? this.testAnswer.find(function(item) {
                return item.id === trueId;
              })
            : this.trueAnswerValue.find(function(item) {
                return item.id === trueId;
              });

          if (!testShape || !trueShape || testShape.type !== trueShape.type) {
            return {
              id: testId,
              result: false
            };
          }

          switch (testShape.type) {
            case _constants.ShapeTypes.POINT:
              return this.comparePoints(testShape, trueShape);

            case _constants.ShapeTypes.LINE:
              return this.compareLines(testShape, trueShape);

            case _constants.ShapeTypes.RAY:
              return this.compareRays(testShape, trueShape);

            case _constants.ShapeTypes.SEGMENT:
              return this.compareSegments(testShape, trueShape);

            case _constants.ShapeTypes.VECTOR:
              return this.compareVectors(testShape, trueShape);

            case _constants.ShapeTypes.CIRCLE:
              return this.compareCircles(testShape, trueShape);

            case _constants.ShapeTypes.PARABOLA:
              return this.compareParabolas(testShape, trueShape);

            case _constants.ShapeTypes.SINE:
            case _constants.ShapeTypes.TANGENT:
            case _constants.ShapeTypes.SECANT:
              return this.compareTrigonometrics(testShape, trueShape);

            case _constants.ShapeTypes.POLYGON:
              return this.comparePolygons(testShape, trueShape);

            case _constants.ShapeTypes.ELLIPSE:
              return this.compareEllipses(testShape, trueShape);

            case _constants.ShapeTypes.HYPERBOLA:
              return this.compareHyperbolas(testShape, trueShape);

            case _constants.ShapeTypes.EXPONENT:
              return this.compareExponents(testShape, trueShape);

            case _constants.ShapeTypes.LOGARITHM:
              return this.compareLogarithms(testShape, trueShape);

            case _constants.ShapeTypes.POLYNOM:
              return this.comparePolynoms(testShape, trueShape);

            default:
              return {
                id: testId,
                result: false
              };
          }
        }
      },
      {
        key: "comparePoints",
        value: function comparePoints(testPoint, truePoint) {
          if (
            testPoint.x === truePoint.x &&
            testPoint.y === truePoint.y &&
            (this.ignoreLabels || labelsAreEqual(testPoint.label, truePoint.label))
          ) {
            return {
              id: testPoint.id,
              relatedId: truePoint.id,
              result: true
            };
          }

          return {
            id: testPoint.id,
            result: false
          };
        }
      },
      {
        key: "compareLines",
        value: function compareLines(testShape, trueShape) {
          var positiveResult = {
            id: testShape.id,
            relatedId: trueShape.id,
            result: true
          };
          var negativeResult = {
            id: testShape.id,
            result: false
          };
          var testShapePointStart = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.startPoint;
          });
          var testShapePointEnd = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.endPoint;
          });
          var trueShapePointStart = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.startPoint;
          });
          var trueShapePointEnd = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.endPoint;
          });

          if (!this.ignoreLabels) {
            if (
              labelsAreEqual(testShape.label, trueShape.label) &&
              ((this.comparePoints(testShapePointStart, trueShapePointStart).result &&
                this.comparePoints(testShapePointEnd, trueShapePointEnd).result) ||
                (this.comparePoints(testShapePointStart, trueShapePointEnd).result &&
                  this.comparePoints(testShapePointEnd, trueShapePointStart).result))
            ) {
              return positiveResult;
            }

            return negativeResult;
          }

          var testShapePoints = {
            x1: +testShapePointStart.x,
            y1: +testShapePointStart.y,
            x2: +testShapePointEnd.x,
            y2: +testShapePointEnd.y
          };
          var trueShapePoints = {
            x1: +trueShapePointStart.x,
            y1: +trueShapePointStart.y,
            x2: +trueShapePointEnd.x,
            y2: +trueShapePointEnd.y
          };
          var testShapeFunc = new _lineFunction["default"](testShapePoints);
          var trueShapeFunc = new _lineFunction["default"](trueShapePoints);

          if (
            testShapeFunc.getKoefA() === trueShapeFunc.getKoefA() &&
            testShapeFunc.getKoefB() === trueShapeFunc.getKoefB()
          ) {
            return positiveResult;
          }

          return negativeResult;
        }
      },
      {
        key: "compareRays",
        value: function compareRays(testShape, trueShape) {
          var positiveResult = {
            id: testShape.id,
            relatedId: trueShape.id,
            result: true
          };
          var negativeResult = {
            id: testShape.id,
            result: false
          };
          var testShapePointStart = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.startPoint;
          });
          var testShapePointEnd = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.endPoint;
          });
          var trueShapePointStart = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.startPoint;
          });
          var trueShapePointEnd = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.endPoint;
          });

          if (!this.ignoreLabels) {
            if (
              labelsAreEqual(testShape.label, trueShape.label) &&
              this.comparePoints(testShapePointStart, trueShapePointStart).result &&
              this.comparePoints(testShapePointEnd, trueShapePointEnd).result
            ) {
              return positiveResult;
            }

            return negativeResult;
          }

          var testShapePoints = {
            x1: +testShapePointStart.x,
            y1: +testShapePointStart.y,
            x2: +testShapePointEnd.x,
            y2: +testShapePointEnd.y
          };
          var trueShapePoints = {
            x1: +trueShapePointStart.x,
            y1: +trueShapePointStart.y,
            x2: +trueShapePointEnd.x,
            y2: +trueShapePointEnd.y
          };
          var testRayParams = {
            deltaX: testShapePoints.x2 - testShapePoints.x1,
            deltaY: testShapePoints.y2 - testShapePoints.y1
          };
          testRayParams.koef =
            testRayParams.deltaX === 0
              ? "NaN"
              : (testRayParams.deltaY / testRayParams.deltaX).toFixed(_constants.FractionDigits);
          var trueRayParams = {
            deltaX: trueShapePoints.x2 - trueShapePoints.x1,
            deltaY: trueShapePoints.y2 - trueShapePoints.y1
          };
          trueRayParams.koef =
            trueRayParams.deltaX === 0
              ? "NaN"
              : (trueRayParams.deltaY / trueRayParams.deltaX).toFixed(_constants.FractionDigits);

          if (
            testShapePoints.x1 === trueShapePoints.x1 &&
            testShapePoints.y1 === trueShapePoints.y1 &&
            testRayParams.koef === trueRayParams.koef &&
            Math.sign(testRayParams.deltaX) === Math.sign(trueRayParams.deltaX) &&
            Math.sign(testRayParams.deltaY) === Math.sign(trueRayParams.deltaY)
          ) {
            return positiveResult;
          }

          return negativeResult;
        }
      },
      {
        key: "compareSegments",
        value: function compareSegments(testShape, trueShape) {
          var testShapePointStart = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.startPoint;
          });
          var testShapePointEnd = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.endPoint;
          });
          var trueShapePointStart = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.startPoint;
          });
          var trueShapePointEnd = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.endPoint;
          });

          if (
            labelsAreEqual(testShape.label, trueShape.label) &&
            ((this.comparePoints(testShapePointStart, trueShapePointStart).result &&
              this.comparePoints(testShapePointEnd, trueShapePointEnd).result) ||
              (this.comparePoints(testShapePointStart, trueShapePointEnd).result &&
                this.comparePoints(testShapePointEnd, trueShapePointStart).result))
          ) {
            return {
              id: testShape.id,
              relatedId: trueShape.id,
              result: true
            };
          }

          return {
            id: testShape.id,
            result: false
          };
        }
      },
      {
        key: "compareVectors",
        value: function compareVectors(testShape, trueShape) {
          var testShapePointStart = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.startPoint;
          });
          var testShapePointEnd = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.endPoint;
          });
          var trueShapePointStart = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.startPoint;
          });
          var trueShapePointEnd = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.endPoint;
          });

          if (
            labelsAreEqual(testShape.label, trueShape.label) &&
            this.comparePoints(testShapePointStart, trueShapePointStart).result &&
            this.comparePoints(testShapePointEnd, trueShapePointEnd).result
          ) {
            return {
              id: testShape.id,
              relatedId: trueShape.id,
              result: true
            };
          }

          return {
            id: testShape.id,
            result: false
          };
        }
      },
      {
        key: "compareCircles",
        value: function compareCircles(testShape, trueShape) {
          var positiveResult = {
            id: testShape.id,
            relatedId: trueShape.id,
            result: true
          };
          var negativeResult = {
            id: testShape.id,
            result: false
          };
          var testShapePointStart = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.startPoint;
          });
          var testShapePointEnd = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.endPoint;
          });
          var trueShapePointStart = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.startPoint;
          });
          var trueShapePointEnd = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.endPoint;
          });

          if (!this.ignoreLabels) {
            if (
              labelsAreEqual(testShape.label, trueShape.label) &&
              this.comparePoints(testShapePointStart, trueShapePointStart).result &&
              this.comparePoints(testShapePointEnd, trueShapePointEnd).result
            ) {
              return positiveResult;
            }

            return negativeResult;
          }

          var testShapePoints = {
            startX: +testShapePointStart.x,
            startY: +testShapePointStart.y,
            endX: +testShapePointEnd.x,
            endY: +testShapePointEnd.y
          };
          var trueShapePoints = {
            startX: +trueShapePointStart.x,
            startY: +trueShapePointStart.y,
            endX: +trueShapePointEnd.x,
            endY: +trueShapePointEnd.y
          };
          var deltaX = testShapePoints.startX - testShapePoints.endX;
          var deltaY = testShapePoints.startY - testShapePoints.endY;
          var testCircleRadius = Math.sqrt(deltaX * deltaX + deltaY * deltaY).toFixed(_constants.FractionDigits);
          deltaX = trueShapePoints.startX - trueShapePoints.endX;
          deltaY = trueShapePoints.startY - trueShapePoints.endY;
          var trueCircleRadius = Math.sqrt(deltaX * deltaX + deltaY * deltaY).toFixed(_constants.FractionDigits);

          if (
            testShapePoints.startX === trueShapePoints.startX &&
            testShapePoints.startY === trueShapePoints.startY &&
            testCircleRadius === trueCircleRadius
          ) {
            return positiveResult;
          }

          return negativeResult;
        }
      },
      {
        key: "compareParabolas",
        value: function compareParabolas(testShape, trueShape) {
          var positiveResult = {
            id: testShape.id,
            relatedId: trueShape.id,
            result: true
          };
          var negativeResult = {
            id: testShape.id,
            result: false
          };
          var testShapePointStart = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.startPoint;
          });
          var testShapePointEnd = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.endPoint;
          });
          var trueShapePointStart = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.startPoint;
          });
          var trueShapePointEnd = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.endPoint;
          });

          if (!this.ignoreLabels) {
            if (
              labelsAreEqual(testShape.label, trueShape.label) &&
              this.comparePoints(testShapePointStart, trueShapePointStart).result &&
              this.comparePoints(testShapePointEnd, trueShapePointEnd).result
            ) {
              return positiveResult;
            }

            return negativeResult;
          }

          var testShapePoints = {
            startX: +testShapePointStart.x,
            startY: +testShapePointStart.y,
            endX: +testShapePointEnd.x,
            endY: +testShapePointEnd.y
          };
          var trueShapePoints = {
            startX: +trueShapePointStart.x,
            startY: +trueShapePointStart.y,
            endX: +trueShapePointEnd.x,
            endY: +trueShapePointEnd.y
          };
          var testFunc = new _parabolaFunction["default"](testShapePoints);
          var trueFunc = new _parabolaFunction["default"](trueShapePoints);

          if (
            testShapePoints.startX === trueShapePoints.startX &&
            testShapePoints.startY === trueShapePoints.startY &&
            testFunc.getKoefA() === trueFunc.getKoefA() &&
            testFunc.getDirection() === trueFunc.getDirection()
          ) {
            return positiveResult;
          }

          return negativeResult;
        }
      },
      {
        key: "compareTrigonometrics",
        value: function compareTrigonometrics(testShape, trueShape) {
          var positiveResult = {
            id: testShape.id,
            relatedId: trueShape.id,
            result: true
          };
          var negativeResult = {
            id: testShape.id,
            result: false
          };
          var testShapePointStart = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.startPoint;
          });
          var testShapePointEnd = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.endPoint;
          });
          var trueShapePointStart = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.startPoint;
          });
          var trueShapePointEnd = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.endPoint;
          });

          if (!this.ignoreLabels) {
            if (
              labelsAreEqual(testShape.label, trueShape.label) &&
              ((this.comparePoints(testShapePointStart, trueShapePointStart).result &&
                this.comparePoints(testShapePointEnd, trueShapePointEnd).result) ||
                (this.comparePoints(testShapePointStart, trueShapePointEnd).result &&
                  this.comparePoints(testShapePointEnd, trueShapePointStart).result))
            ) {
              return positiveResult;
            }

            return negativeResult;
          }

          var testShapePoints = {
            startX: +testShapePointStart.x,
            startY: +testShapePointStart.y,
            endX: +testShapePointEnd.x,
            endY: +testShapePointEnd.y
          };
          var trueShapePoints = {
            startX: +trueShapePointStart.x,
            startY: +trueShapePointStart.y,
            endX: +trueShapePointEnd.x,
            endY: +trueShapePointEnd.y
          }; // amplitudes

          var testAmpl = Math.abs(testShapePoints.endY - testShapePoints.startY);
          var trueAmpl = Math.abs(trueShapePoints.endY - trueShapePoints.startY); // center lines

          var testCenterLine = testShapePoints.startY;
          var trueCenterLine = trueShapePoints.startY; // periods

          var testPeriod = (testShapePoints.endX - testShapePoints.startX) * 4;
          var truePeriod = (trueShapePoints.endX - trueShapePoints.startX) * 4; // offsets

          var testNormalX =
            testShapePoints.endY < testShapePoints.startY
              ? testShapePoints.startX + testPeriod / 2
              : testShapePoints.startX;
          var trueNormalX =
            trueShapePoints.endY < trueShapePoints.startY
              ? trueShapePoints.startX + truePeriod / 2
              : trueShapePoints.startX;
          var testOffset = testNormalX % testPeriod;

          if (testOffset < 0) {
            testOffset += testPeriod;
          }

          var trueOffset = trueNormalX % truePeriod;

          if (trueOffset < 0) {
            trueOffset += truePeriod;
          }

          if (
            testAmpl === trueAmpl &&
            testCenterLine === trueCenterLine &&
            testPeriod === truePeriod &&
            testOffset === trueOffset
          ) {
            return positiveResult;
          }

          return negativeResult;
        }
      },
      {
        key: "comparePolygons",
        value: function comparePolygons(testShape, trueShape) {
          var _this = this;

          var negativeResult = {
            id: testShape.id,
            result: false
          };
          var positiveResult = {
            id: testShape.id,
            relatedId: trueShape.id,
            result: true
          };
          var testPolygonPoints = [];
          Object.getOwnPropertyNames(testShape.subElementsIds).forEach(function(value) {
            var pointId = testShape.subElementsIds[value];

            var point = _this.testAnswer.find(function(item) {
              return item.id === pointId;
            });

            testPolygonPoints.push({
              x: point.x,
              y: point.y,
              label: point.label
            });
          });
          var truePolygonPoints = [];
          Object.getOwnPropertyNames(trueShape.subElementsIds).forEach(function(value) {
            var pointId = trueShape.subElementsIds[value];

            var point = _this.trueAnswerValue.find(function(item) {
              return item.id === pointId;
            });

            truePolygonPoints.push({
              x: point.x,
              y: point.y,
              label: point.label
            });
          });

          if (testPolygonPoints.length !== truePolygonPoints.length) {
            return negativeResult;
          } // find first equal point

          var startIndex = -1;

          for (var i = 0; i < testPolygonPoints.length; i++) {
            if (
              testPolygonPoints[i].x === truePolygonPoints[0].x &&
              testPolygonPoints[i].y === truePolygonPoints[0].y &&
              (this.ignoreLabels || labelsAreEqual(testPolygonPoints[i].label, truePolygonPoints[0].label))
            ) {
              startIndex = i;
              break;
            }
          }

          if (startIndex === -1) {
            return negativeResult;
          } // set start point to array beginning

          var removed = testPolygonPoints.splice(0, startIndex);
          testPolygonPoints = testPolygonPoints.concat(removed); // check direct order

          var equalCount = 0;

          for (var _i = 0; _i < testPolygonPoints.length; _i++) {
            if (
              testPolygonPoints[_i].x === truePolygonPoints[_i].x &&
              testPolygonPoints[_i].y === truePolygonPoints[_i].y &&
              (this.ignoreLabels || labelsAreEqual(testPolygonPoints[_i].label, truePolygonPoints[_i].label))
            ) {
              equalCount++;
            }
          }

          if (
            equalCount === truePolygonPoints.length &&
            (this.ignoreLabels || labelsAreEqual(testShape.label, trueShape.label))
          ) {
            return positiveResult;
          } // check reverse order

          testPolygonPoints.reverse();
          var last = testPolygonPoints.splice(testPolygonPoints.length - 1, 1);
          testPolygonPoints.unshift(last[0]);
          equalCount = 0;

          for (var _i2 = 0; _i2 < testPolygonPoints.length; _i2++) {
            if (
              testPolygonPoints[_i2].x === truePolygonPoints[_i2].x &&
              testPolygonPoints[_i2].y === truePolygonPoints[_i2].y &&
              (this.ignoreLabels || labelsAreEqual(testPolygonPoints[_i2].label, truePolygonPoints[_i2].label))
            ) {
              equalCount++;
            }
          }

          if (
            equalCount === truePolygonPoints.length &&
            (this.ignoreLabels || labelsAreEqual(testShape.label, trueShape.label))
          ) {
            return positiveResult;
          }

          return negativeResult;
        }
      },
      {
        key: "compareEllipses",
        value: function compareEllipses(testShape, trueShape) {
          var positiveResult = {
            id: testShape.id,
            relatedId: trueShape.id,
            result: true
          };
          var negativeResult = {
            id: testShape.id,
            result: false
          };
          var testShapeFocusPoint1 = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds[0];
          });
          var testShapeFocusPoint2 = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds[1];
          });
          var testShapeLinePoint = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds[2];
          });
          var trueShapeFocusPoint1 = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds[0];
          });
          var trueShapeFocusPoint2 = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds[1];
          });
          var trueShapeLinePoint = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds[2];
          });

          if (!this.ignoreLabels) {
            if (
              labelsAreEqual(testShape.label, trueShape.label) &&
              this.comparePoints(testShapeLinePoint, trueShapeLinePoint).result &&
              ((this.comparePoints(testShapeFocusPoint1, trueShapeFocusPoint1).result &&
                this.comparePoints(testShapeFocusPoint2, trueShapeFocusPoint2).result) ||
                (this.comparePoints(testShapeFocusPoint1, trueShapeFocusPoint2).result &&
                  this.comparePoints(testShapeFocusPoint2, trueShapeFocusPoint1).result))
            ) {
              return positiveResult;
            }

            return negativeResult;
          }

          var testShapePoints = {
            focusPoint1X: +testShapeFocusPoint1.x,
            focusPoint1Y: +testShapeFocusPoint1.y,
            focusPoint2X: +testShapeFocusPoint2.x,
            focusPoint2Y: +testShapeFocusPoint2.y,
            linePointX: +testShapeLinePoint.x,
            linePointY: +testShapeLinePoint.y
          };
          var trueShapePoints = {
            focusPoint1X: +trueShapeFocusPoint1.x,
            focusPoint1Y: +trueShapeFocusPoint1.y,
            focusPoint2X: +trueShapeFocusPoint2.x,
            focusPoint2Y: +trueShapeFocusPoint2.y,
            linePointX: +trueShapeLinePoint.x,
            linePointY: +trueShapeLinePoint.y
          };
          var testFunc = new _ellipseFunction["default"](testShapePoints);
          var trueFunc = new _ellipseFunction["default"](trueShapePoints);
          var focusPointsAreMatched =
            (testShapePoints.focusPoint1X === trueShapePoints.focusPoint1X &&
              testShapePoints.focusPoint1Y === trueShapePoints.focusPoint1Y &&
              testShapePoints.focusPoint2X === trueShapePoints.focusPoint2X &&
              testShapePoints.focusPoint2Y === trueShapePoints.focusPoint2Y) ||
            (testShapePoints.focusPoint1X === trueShapePoints.focusPoint2X &&
              testShapePoints.focusPoint1Y === trueShapePoints.focusPoint2Y &&
              testShapePoints.focusPoint2X === trueShapePoints.focusPoint1X &&
              testShapePoints.focusPoint2Y === trueShapePoints.focusPoint1Y);

          if (focusPointsAreMatched && testFunc.getR1R2Sum() === trueFunc.getR1R2Sum()) {
            return positiveResult;
          }

          return negativeResult;
        }
      },
      {
        key: "compareHyperbolas",
        value: function compareHyperbolas(testShape, trueShape) {
          var positiveResult = {
            id: testShape.id,
            relatedId: trueShape.id,
            result: true
          };
          var negativeResult = {
            id: testShape.id,
            result: false
          };
          var testShapeFocusPoint1 = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds[0];
          });
          var testShapeFocusPoint2 = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds[1];
          });
          var testShapeLinePoint = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds[2];
          });
          var trueShapeFocusPoint1 = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds[0];
          });
          var trueShapeFocusPoint2 = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds[1];
          });
          var trueShapeLinePoint = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds[2];
          });

          if (!this.ignoreLabels) {
            if (
              labelsAreEqual(testShape.label, trueShape.label) &&
              this.comparePoints(testShapeLinePoint, trueShapeLinePoint).result &&
              ((this.comparePoints(testShapeFocusPoint1, trueShapeFocusPoint1).result &&
                this.comparePoints(testShapeFocusPoint2, trueShapeFocusPoint2).result) ||
                (this.comparePoints(testShapeFocusPoint1, trueShapeFocusPoint2).result &&
                  this.comparePoints(testShapeFocusPoint2, trueShapeFocusPoint1).result))
            ) {
              return positiveResult;
            }

            return negativeResult;
          }

          var testShapePoints = {
            focusPoint1X: +testShapeFocusPoint1.x,
            focusPoint1Y: +testShapeFocusPoint1.y,
            focusPoint2X: +testShapeFocusPoint2.x,
            focusPoint2Y: +testShapeFocusPoint2.y,
            linePointX: +testShapeLinePoint.x,
            linePointY: +testShapeLinePoint.y
          };
          var trueShapePoints = {
            focusPoint1X: +trueShapeFocusPoint1.x,
            focusPoint1Y: +trueShapeFocusPoint1.y,
            focusPoint2X: +trueShapeFocusPoint2.x,
            focusPoint2Y: +trueShapeFocusPoint2.y,
            linePointX: +trueShapeLinePoint.x,
            linePointY: +trueShapeLinePoint.y
          };
          var testFunc = new _hyperbolaFunction["default"](testShapePoints);
          var trueFunc = new _hyperbolaFunction["default"](trueShapePoints);
          var focusPointsAreMatched =
            (testShapePoints.focusPoint1X === trueShapePoints.focusPoint1X &&
              testShapePoints.focusPoint1Y === trueShapePoints.focusPoint1Y &&
              testShapePoints.focusPoint2X === trueShapePoints.focusPoint2X &&
              testShapePoints.focusPoint2Y === trueShapePoints.focusPoint2Y) ||
            (testShapePoints.focusPoint1X === trueShapePoints.focusPoint2X &&
              testShapePoints.focusPoint1Y === trueShapePoints.focusPoint2Y &&
              testShapePoints.focusPoint2X === trueShapePoints.focusPoint1X &&
              testShapePoints.focusPoint2Y === trueShapePoints.focusPoint1Y);

          if (focusPointsAreMatched && testFunc.getR1R2Diff() === trueFunc.getR1R2Diff()) {
            return positiveResult;
          }

          return negativeResult;
        }
      },
      {
        key: "compareExponents",
        value: function compareExponents(testShape, trueShape) {
          var positiveResult = {
            id: testShape.id,
            relatedId: trueShape.id,
            result: true
          };
          var negativeResult = {
            id: testShape.id,
            result: false
          };
          var testShapePointStart = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.startPoint;
          });
          var testShapePointEnd = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.endPoint;
          });
          var trueShapePointStart = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.startPoint;
          });
          var trueShapePointEnd = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.endPoint;
          });

          if (!this.ignoreLabels) {
            if (
              labelsAreEqual(testShape.label, trueShape.label) &&
              this.comparePoints(testShapePointStart, trueShapePointStart).result &&
              this.comparePoints(testShapePointEnd, trueShapePointEnd).result
            ) {
              return positiveResult;
            }

            return negativeResult;
          }

          var testShapePoints = {
            startX: +testShapePointStart.x,
            startY: +testShapePointStart.y,
            endX: +testShapePointEnd.x,
            endY: +testShapePointEnd.y
          };
          var trueShapePoints = {
            startX: +trueShapePointStart.x,
            startY: +trueShapePointStart.y,
            endX: +trueShapePointEnd.x,
            endY: +trueShapePointEnd.y
          };
          var testFunc = new _exponentFunction["default"](testShapePoints);
          var trueFunc = new _exponentFunction["default"](trueShapePoints);

          if (
            testShapePoints.startX === trueShapePoints.startX &&
            testShapePoints.startY === trueShapePoints.startY &&
            testFunc.getBC() === trueFunc.getBC()
          ) {
            return {
              id: testShape.id,
              relatedId: trueShape.id,
              result: true
            };
          }

          return negativeResult;
        }
      },
      {
        key: "compareLogarithms",
        value: function compareLogarithms(testShape, trueShape) {
          var positiveResult = {
            id: testShape.id,
            relatedId: trueShape.id,
            result: true
          };
          var negativeResult = {
            id: testShape.id,
            result: false
          };
          var testShapePointStart = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.startPoint;
          });
          var testShapePointEnd = this.testAnswer.find(function(item) {
            return item.id === testShape.subElementsIds.endPoint;
          });
          var trueShapePointStart = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.startPoint;
          });
          var trueShapePointEnd = this.trueAnswerValue.find(function(item) {
            return item.id === trueShape.subElementsIds.endPoint;
          });

          if (!this.ignoreLabels) {
            if (
              labelsAreEqual(testShape.label, trueShape.label) &&
              this.comparePoints(testShapePointStart, trueShapePointStart).result &&
              this.comparePoints(testShapePointEnd, trueShapePointEnd).result
            ) {
              return positiveResult;
            }

            return negativeResult;
          }

          var testShapePoints = {
            startX: +testShapePointStart.x,
            startY: +testShapePointStart.y,
            endX: +testShapePointEnd.x,
            endY: +testShapePointEnd.y
          };
          var trueShapePoints = {
            startX: +trueShapePointStart.x,
            startY: +trueShapePointStart.y,
            endX: +trueShapePointEnd.x,
            endY: +trueShapePointEnd.y
          };
          var testFunc = new _logarithmFunction["default"](testShapePoints);
          var trueFunc = new _logarithmFunction["default"](trueShapePoints);

          if (
            testShapePoints.startX === trueShapePoints.startX &&
            testShapePoints.startY === trueShapePoints.startY &&
            testFunc.getBC() === trueFunc.getBC()
          ) {
            return {
              id: testShape.id,
              relatedId: trueShape.id,
              result: true
            };
          }

          return negativeResult;
        }
      },
      {
        key: "comparePolynoms",
        value: function comparePolynoms(testShape, trueShape) {
          var _this2 = this;

          var positiveResult = {
            id: testShape.id,
            relatedId: trueShape.id,
            result: true
          };
          var negativeResult = {
            id: testShape.id,
            result: false
          };
          var testShapePoints = [];
          Object.getOwnPropertyNames(testShape.subElementsIds).forEach(function(value) {
            var pointId = testShape.subElementsIds[value];

            var point = _this2.testAnswer.find(function(item) {
              return item.id === pointId;
            });

            testShapePoints.push({
              x: point.x,
              y: point.y,
              label: point.label
            });
          });
          var trueShapePoints = [];
          Object.getOwnPropertyNames(trueShape.subElementsIds).forEach(function(value) {
            var pointId = trueShape.subElementsIds[value];

            var point = _this2.trueAnswerValue.find(function(item) {
              return item.id === pointId;
            });

            trueShapePoints.push({
              x: point.x,
              y: point.y,
              label: point.label
            });
          });

          if (!this.ignoreLabels) {
            if (testShapePoints.length !== trueShapePoints.length) {
              return negativeResult;
            }

            var equalCount = 0;
            testShapePoints.forEach(function(testPoint) {
              equalCount += trueShapePoints.filter(function(truePoint) {
                return (
                  testPoint.x === truePoint.x &&
                  testPoint.y === truePoint.y &&
                  labelsAreEqual(testPoint.label, truePoint.label)
                );
              }).length;
            });

            if (equalCount === trueShapePoints.length && labelsAreEqual(testShape.label, trueShape.label)) {
              return positiveResult;
            }

            return negativeResult;
          }

          var testFunc = new _polynomFunction["default"](testShapePoints);
          var trueFunc = new _polynomFunction["default"](trueShapePoints);
          var allX = testShapePoints
            .map(function(point) {
              return point.x;
            })
            .concat(
              trueShapePoints.map(function(point) {
                return point.x;
              })
            );
          var xMin = Math.min.apply(Math, (0, _toConsumableArray2["default"])(allX)) - 0.5;
          var xMax = Math.max.apply(Math, (0, _toConsumableArray2["default"])(allX)) + 0.5;
          var x = xMin;

          while (x <= xMax) {
            if (testFunc.getYbyX(x) !== trueFunc.getYbyX(x)) {
              return negativeResult;
            }

            x += 0.1;
          }

          return {
            id: testShape.id,
            relatedId: trueShape.id,
            result: true
          };
        }
      }
    ]);
    return CompareShapes;
  })();

var _default = CompareShapes;
exports["default"] = _default;
