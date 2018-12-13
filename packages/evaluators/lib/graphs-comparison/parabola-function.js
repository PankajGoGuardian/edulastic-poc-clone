

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

const _classCallCheck2 = _interopRequireDefault(require('@babel/runtime/helpers/classCallCheck'));

const _createClass2 = _interopRequireDefault(require('@babel/runtime/helpers/createClass'));

const fractionDigits = require('./constants/fraction-digits'); // import fractionDigits from './constants/fraction-digits';


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
      return ((this.endY - this.startY) / ((this.endX - this.startX) * (this.endX - this.startX))).toFixed(fractionDigits);
    }
  }]);
  return ParabolaFunction;
}());

module.exports = ParabolaFunction; // export default ParabolaFunction;
