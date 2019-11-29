"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _constants = require("./constants");

var _quadrants = _interopRequireDefault(require("./quadrants"));

var _axisLabels = _interopRequireDefault(require("./axisLabels"));

var _axisSegments = _interopRequireDefault(require("./axisSegments"));

var evaluator = function evaluator(_ref) {
  var _ref$userResponse, userResponse, validation, graphType;

  return _regenerator["default"].async(function evaluator$(_context) {
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
          return _regenerator["default"].awrap(
            (0, _quadrants["default"])({
              userResponse: userResponse,
              validation: validation
            })
          );

        case 9:
          return _context.abrupt("return", _context.sent);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};

var _default = evaluator;
exports["default"] = _default;
