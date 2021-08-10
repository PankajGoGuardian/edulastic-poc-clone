const GRAPH_TOOLS = {
  // Pickable

  POINT: 'point',
  LINE: 'line',
  RAY: 'ray',
  SEGMENT: 'segment',
  VECTOR: 'vector',
  CIRCLE: 'circle',
  SIN: 'sine',
  COS: 'cos',
  TANGENT: 'tangent',
  SECANT: 'secant',
  EXPONENT: 'exp',
  EXPONENTIAL2: 'exponential2',
  LOGARITHM: 'logarithm',
  POLYNOM: 'polynom',
  POLYGON: 'polygon',
  PARABOLA: 'parabola',
  PARABOLA2: 'parabola2',
  HYPERBOLA: 'hyperbola',
  ELLIPSE: 'ellipse',
  SEGMENTS_POINT: 'segments_point',
  NUMBERLINE_PLOT_POINT: 'numberline_plot_point',
  SEGMENT_BOTH_POINT_INCLUDED: 'segment_both_point_included',
  SEGMENT_LEFT_POINT_HOLLOW: 'segment_left_point_hollow',
  SEGMENT_RIGHT_POINT_HOLLOW: 'segment_right_point_hollow',
  SEGMENT_BOTH_POINT_HOLLOW: 'segment_both_points_hollow',
  RAY_LEFT_DIRECTION: 'ray_left_direction',
  RAY_RIGHT_DIRECTION: 'ray_right_direction',
  RAY_LEFT_DIRECTION_RIGHT_HOLLOW: 'ray_left_direction_right_hollow',
  RAY_RIGHT_DIRECTION_LEFT_HOLLOW: 'ray_right_direction_left_hollow',
  TRASH: 'trash',
  DELETE: 'delete',
  EQUATION: 'equation',
  AREA: 'area',
  AREA2: 'area2',
  DASHED: 'dashed',
  PIECEWISE: 'piecewise',
  NO_SOLUTION: 'no_solution',

  // Default
  RESET: 'reset',

  DRAG_DROP: 'drag_drop',
}

const EVENT_NAMES = {
  // jsx
  UP: 'up',
  DOWN: 'down',

  // local
  CHANGE_NEW: 'change.new',
  CHANGE_MOVE: 'change.move',
  CHANGE_UPDATE: 'change.update',
  CHANGE_DELETE: 'change.delete',
}

module.exports = {
  GRAPH_TOOLS,
  EVENT_NAMES,
}
