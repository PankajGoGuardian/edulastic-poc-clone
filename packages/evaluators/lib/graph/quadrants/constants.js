"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IgnoreLabels = exports.IgnoreRepeatedShapes = exports.ShapeTypes = exports.FractionDigits = void 0;
var FractionDigits = 4;
exports.FractionDigits = FractionDigits;
var ShapeTypes = {
  POINT: "point",
  LINE: "line",
  RAY: "ray",
  SEGMENT: "segment",
  VECTOR: "vector",
  CIRCLE: "circle",
  PARABOLA: "parabola",
  SINE: "sine",
  TANGENT: "tangent",
  SECANT: "secant",
  POLYGON: "polygon",
  ELLIPSE: "ellipse",
  HYPERBOLA: "hyperbola",
  EXPONENT: "exponent",
  LOGARITHM: "logarithm",
  POLYNOM: "polynom"
};
exports.ShapeTypes = ShapeTypes;
var IgnoreRepeatedShapes = {
  NO: "no",
  COMPARE_BY_SLOPE: "yes",
  COMPARE_BY_POINTS: "strict"
};
exports.IgnoreRepeatedShapes = IgnoreRepeatedShapes;
var IgnoreLabels = {
  NO: "no",
  YES: "yes"
};
exports.IgnoreLabels = IgnoreLabels;
