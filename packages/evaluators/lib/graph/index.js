"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _constants = require("./constants");

var _quadrants = _interopRequireDefault(require("./quadrants"));

var _axisLabels = _interopRequireDefault(require("./axisLabels"));

var _axisSegments = _interopRequireDefault(require("./axisSegments"));

var evaluator = /*#__PURE__*/ (function() {
  var _ref2 = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/ _regenerator["default"].mark(function _callee(_ref) {
      var _ref$userResponse, userResponse, validation, graphType;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              (_ref$userResponse = _ref.userResponse),
                (userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse),
                (validation = _ref.validation);
              graphType = validation.graphType;
              _context.t0 = graphType;
              _context.next =
                _context.t0 === _constants.GraphTypes.AXIS_LABELS
                  ? 5
                  : _context.t0 === _constants.GraphTypes.AXIS_SEGMENTS
                  ? 6
                  : _context.t0 === _constants.GraphTypes.NUMBERLINE_PLOT
                  ? 6
                  : _context.t0 === _constants.GraphTypes.QUADRANTS
                  ? 7
                  : _context.t0 === _constants.GraphTypes.FIRST_QUADRANT
                  ? 7
                  : 7;
              break;

            case 5:
              return _context.abrupt(
                "return",
                (0, _axisLabels["default"])({
                  userResponse: userResponse,
                  validation: validation
                })
              );

            case 6:
              return _context.abrupt(
                "return",
                (0, _axisSegments["default"])({
                  userResponse: userResponse,
                  validation: validation
                })
              );

            case 7:
              _context.next = 9;
              return (0, _quadrants["default"])({
                userResponse: userResponse,
                validation: validation
              });

            case 9:
              return _context.abrupt("return", _context.sent);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })
  );

  return function evaluator(_x) {
    return _ref2.apply(this, arguments);
  };
})();

var _default = evaluator;
exports["default"] = _default;
