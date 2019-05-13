"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _constants = require("./constants");

var PolynomFunction =
  /*#__PURE__*/
  (function() {
    function PolynomFunction(points) {
      (0, _classCallCheck2["default"])(this, PolynomFunction);
      this.points = points;
    }

    (0, _createClass2["default"])(PolynomFunction, [
      {
        key: "getYbyX",
        value: function getYbyX(x) {
          var result = 0;

          for (var i = 0; i < this.points.length; i++) {
            var li = 1;

            for (var j = 0; j < this.points.length; j++) {
              if (i !== j) {
                li *= (x - this.points[j].x) / (this.points[i].x - this.points[j].x);
              }
            }

            result += this.points[i].y * li;
          }

          return result.toFixed(_constants.FractionDigits);
        }
      }
    ]);
    return PolynomFunction;
  })();

var _default = PolynomFunction;
exports["default"] = _default;
