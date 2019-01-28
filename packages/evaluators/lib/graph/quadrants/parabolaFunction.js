

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

const _classCallCheck2 = _interopRequireDefault(require('@babel/runtime/helpers/classCallCheck'));

const _createClass2 = _interopRequireDefault(require('@babel/runtime/helpers/createClass'));

const _fractionDigits = require('./constants/fractionDigits');

const ParabolaFunction =
/* #__PURE__ */
(function () {
  function ParabolaFunction(points) {
    (0, _classCallCheck2.default)(this, ParabolaFunction);
    this.startX = +points.startX;
    this.startY = +points.startY;
    this.endX = +points.endX;
    this.endY = +points.endY;
  }

  (0, _createClass2.default)(ParabolaFunction, [{
    key: 'getKoefA',
    value: function getKoefA() {
      return ((this.endY - this.startY) / ((this.endX - this.startX) * (this.endX - this.startX))).toFixed(_fractionDigits.FractionDigits);
    }
  }]);
  return ParabolaFunction;
}());

const _default = ParabolaFunction;
exports.default = _default;
