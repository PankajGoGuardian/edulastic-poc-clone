

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

const _classCallCheck2 = _interopRequireDefault(require('@babel/runtime/helpers/classCallCheck'));

const _createClass2 = _interopRequireDefault(require('@babel/runtime/helpers/createClass'));

const fractionDigits = require('./constants/fraction-digits'); // import fractionDigits from './constants/fraction-digits';


const LineFunction =
/* #__PURE__ */
(function () {
  function LineFunction(points) {
    (0, _classCallCheck2.default)(this, LineFunction);
    this.x1 = +points.x1;
    this.y1 = +points.y1;
    this.x2 = +points.x2;
    this.y2 = +points.y2;
  }

  (0, _createClass2.default)(LineFunction, [{
    key: 'getKoefA',
    value: function getKoefA() {
      if (this.x1 === this.x2) {
        return 'NaN';
      }

      const koefA = (this.y2 - this.y1) / (this.x2 - this.x1);
      return koefA.toFixed(fractionDigits);
    }
  }, {
    key: 'getKoefB',
    value: function getKoefB() {
      if (this.x1 === this.x2) {
        return 'NaN';
      }

      const koefB = (this.y2 * this.x1 - this.y1 * this.x2) / (this.x1 - this.x2);
      return koefB.toFixed(fractionDigits);
    }
  }]);
  return LineFunction;
}());

module.exports = LineFunction; // export default LineFunction;
