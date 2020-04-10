"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterEmptyAnswers = filterEmptyAnswers;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _immer = _interopRequireDefault(require("immer"));

var filterEmptyResponses = {
  maths: function maths() {
    var _maths = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // do not mutate the original answers
    // return a new copy
    return (0, _immer["default"])(_maths, function(draft) {
      for (var _i = 0, _Object$entries = Object.entries(draft); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = (0, _slicedToArray2["default"])(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];

        if (value.value === "") {
          delete draft[key];
        }
      }
    });
  },
  mathWithUnits: function mathWithUnits() {
    var mathUnits = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // do not mutate the original answers
    // return a new copy
    return (0, _immer["default"])(mathUnits, function(draft) {
      for (var _i2 = 0, _Object$entries2 = Object.entries(draft); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = (0, _slicedToArray2["default"])(_Object$entries2[_i2], 2),
          key = _Object$entries2$_i[0],
          value = _Object$entries2$_i[1];

        if (value.value === "" && !value.unit) {
          delete draft[key];
        }
      }
    });
  }
};
/**
 * This function filters out empty responses given by user
 * Ideally, We should not evaluate the empty responses
 *
 * @param {Object} userAnswers (answers given by user)
 * @param {String} type  (type of the question)
 */

function filterEmptyAnswers(_ref) {
  var userAnswers = _ref.userAnswers,
    type = _ref.type;

  if (filterEmptyResponses[type]) {
    return filterEmptyResponses[type](userAnswers);
  }

  return userAnswers;
}
