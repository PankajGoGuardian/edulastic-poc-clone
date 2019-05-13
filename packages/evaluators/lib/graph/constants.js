"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AxisSegmentsShapeTypes = exports.GraphTypes = void 0;
var GraphTypes = {
  QUADRANTS: "quadrants",
  FIRST_QUADRANT: "firstQuadrant",
  AXIS_SEGMENTS: "axisSegments",
  AXIS_LABELS: "axisLabels"
};
exports.GraphTypes = GraphTypes;
var AxisSegmentsShapeTypes = {
  SEGMENTS_POINT: "segments_point",
  SEGMENT_BOTH_POINT_INCLUDED: "segment_both_point_included",
  SEGMENT_LEFT_POINT_HOLLOW: "segment_left_point_hollow",
  SEGMENT_RIGHT_POINT_HOLLOW: "segment_right_point_hollow",
  SEGMENT_BOTH_POINT_HOLLOW: "segment_both_points_hollow",
  RAY_LEFT_DIRECTION: "ray_left_direction",
  RAY_RIGHT_DIRECTION: "ray_right_direction",
  RAY_LEFT_DIRECTION_RIGHT_HOLLOW: "ray_left_direction_right_hollow",
  RAY_RIGHT_DIRECTION_LEFT_HOLLOW: "ray_right_direction_left_hollow"
};
exports.AxisSegmentsShapeTypes = AxisSegmentsShapeTypes;
