"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _constants = require("./constants");

var ParabolaFunction = /*#__PURE__*/function () {
  function ParabolaFunction(points) {
    (0, _classCallCheck2["default"])(this, ParabolaFunction);
    this.startX = +points.startX;
    this.startY = +points.startY;
    this.endX = +points.endX;
    this.endY = +points.endY;
  }

  (0, _createClass2["default"])(ParabolaFunction, [{
    key: "getKoefA",
    value: function getKoefA() {
      return ((this.endY - this.startY) / ((this.endX - this.startX) * (this.endX - this.startX))).toFixed(_constants.FractionDigits);
    }
  }, {
    key: "getDirection",
    value: function getDirection() {
      var comp = (this.endY - this.startY) * (this.endX - this.startX);
      return comp > 0 ? 1 : comp < 0 ? -1 : 0;
    }
  }]);
  return ParabolaFunction;
}();

var _default = ParabolaFunction;
exports["default"] = _default;