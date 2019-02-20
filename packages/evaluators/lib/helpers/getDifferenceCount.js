"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var getDifferenceCount = function getDifferenceCount(answerArray, validationArray) {
  var count = 0;
  answerArray.forEach(function (answer, i) {
    if (answer !== validationArray[i]) {
      count++;
    }
  });
  return count;
};

var _default = getDifferenceCount;
exports.default = _default;