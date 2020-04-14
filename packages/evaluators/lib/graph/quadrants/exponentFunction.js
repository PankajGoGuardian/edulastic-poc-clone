"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _constants = require("./constants");

var ExponentFunction = /*#__PURE__*/ (function() {
  function ExponentFunction(points) {
    (0, _classCallCheck2["default"])(this, ExponentFunction);
    this.startX = +points.startX;
    this.startY = +points.startY;
    this.endX = +points.endX;
    this.endY = +points.endY;
  }

  (0, _createClass2["default"])(ExponentFunction, [
    {
      key: "getBC",
      value: function getBC() {
        var b = this.endY - this.startY;
        var c = this.endX - this.startX >= 0 ? this.endX - this.startX : 1 / (this.startX - this.endX);
        return (b / c).toFixed(_constants.FractionDigits);
      }
    }
  ]);
  return ExponentFunction;
})();

var _default = ExponentFunction;
exports["default"] = _default;
