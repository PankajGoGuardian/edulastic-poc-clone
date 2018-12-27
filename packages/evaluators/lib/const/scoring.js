"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScoringType = void 0;
// scoring types
var ScoringType = {
  EXACT_MATCH: 'exactMatch',
  PARTIAL_MATCH: 'partialMatch',
  CONTAINS: 'contains',
  BY_LOCATION_METHOD: 'byLocation',
  BY_COUNT_METHOD: 'byCount'
};
exports.ScoringType = ScoringType;