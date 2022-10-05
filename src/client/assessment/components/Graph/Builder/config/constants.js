import { graph } from '@edulastic/constants'

const { GRAPH_TOOLS } = graph

export default {
  TOOLS: graph.GRAPH_TOOLS,
  EVENT_NAMES: graph.EVENT_NAMES,
  RECT_GRID: graph.RECT_GRID,
  POLAR_GRID: graph.POLAR_GRID,
  COMPLEX_GRID: graph.COMPLEX_GRID,
}

export const RENDERING_BASE = {
  ZERO_BASED: 'zero-based',
  LINE_MINIMUM_VALUE: 'min-value-based',
}

export const MIN_SNAP_SIZE = 0.0000001

export const ALL_CONTROLS = [
  GRAPH_TOOLS.EDIT_LABEL,
  GRAPH_TOOLS.UNDO,
  GRAPH_TOOLS.REDO,
  GRAPH_TOOLS.RESET,
  GRAPH_TOOLS.DELETE,
]

export const ALL_TOLLS = {
  [graph.RECT_GRID]: [
    GRAPH_TOOLS.POINT,
    GRAPH_TOOLS.SEGMENT,
    GRAPH_TOOLS.POLYGON,
    GRAPH_TOOLS.RAY,
    GRAPH_TOOLS.VECTOR,
    GRAPH_TOOLS.LINE,
    GRAPH_TOOLS.CIRCLE,
    GRAPH_TOOLS.ELLIPSE,
    GRAPH_TOOLS.PARABOLA,
    GRAPH_TOOLS.PARABOLA2,
    GRAPH_TOOLS.HYPERBOLA,
    GRAPH_TOOLS.SIN,
    GRAPH_TOOLS.COS,
    GRAPH_TOOLS.TANGENT,
    GRAPH_TOOLS.SECANT,
    GRAPH_TOOLS.POLYNOM,
    GRAPH_TOOLS.EXPONENT,
    GRAPH_TOOLS.EXPONENTIAL2,
    GRAPH_TOOLS.LOGARITHM,
    GRAPH_TOOLS.AREA,
    GRAPH_TOOLS.AREA2,
    GRAPH_TOOLS.DASHED,
    GRAPH_TOOLS.PIECEWISE_LINE,
    // GRAPH_TOOLS.PIECEWISE_POINT, // used to make segment to piecewise
    GRAPH_TOOLS.LINE_CUT,
    // GRAPH_TOOLS.NO_SOLUTION, // not implemented yet
  ],
  [graph.POLAR_GRID]: [
    GRAPH_TOOLS.POINT,
    GRAPH_TOOLS.LINE,
    GRAPH_TOOLS.SEGMENT,
    GRAPH_TOOLS.CIRCLE,
    GRAPH_TOOLS.RAY,
    GRAPH_TOOLS.ROSE,
    GRAPH_TOOLS.CARDIOID,
    GRAPH_TOOLS.AREA,
    GRAPH_TOOLS.DASHED,
  ],
  // [graph.COMPLEX_GRID]: [],
}

export const TOOLS_BY_GROUP = {
  [graph.RECT_GRID]: [
    {
      title: 'Basic object',
      items: [
        GRAPH_TOOLS.POINT,
        GRAPH_TOOLS.SEGMENT,
        GRAPH_TOOLS.POLYGON,
        GRAPH_TOOLS.RAY,
        GRAPH_TOOLS.VECTOR,
        GRAPH_TOOLS.LINE,
      ],
    },
    {
      title: 'Conics',
      items: [
        GRAPH_TOOLS.CIRCLE,
        GRAPH_TOOLS.ELLIPSE,
        GRAPH_TOOLS.PARABOLA,
        GRAPH_TOOLS.PARABOLA2,
        GRAPH_TOOLS.HYPERBOLA,
      ],
    },
    {
      title: 'Trigonometry',
      items: [
        GRAPH_TOOLS.SIN,
        GRAPH_TOOLS.COS,
        GRAPH_TOOLS.TANGENT,
        GRAPH_TOOLS.SECANT,
      ],
    },
    {
      title: 'Miscellaneous',
      items: [
        GRAPH_TOOLS.POLYNOM,
        GRAPH_TOOLS.EXPONENT,
        GRAPH_TOOLS.EXPONENTIAL2,
        GRAPH_TOOLS.LOGARITHM,
        GRAPH_TOOLS.AREA,
        GRAPH_TOOLS.AREA2,
        GRAPH_TOOLS.DASHED,
        GRAPH_TOOLS.PIECEWISE_LINE,
        // GRAPH_TOOLS.PIECEWISE_POINT, // used to make segment to piecewise
        GRAPH_TOOLS.LINE_CUT,
        // GRAPH_TOOLS.NO_SOLUTION, // not implemented yet
      ],
    },
  ],
  [graph.POLAR_GRID]: [
    {
      title: 'Basic object',
      items: [
        GRAPH_TOOLS.POINT,
        GRAPH_TOOLS.LINE,
        GRAPH_TOOLS.SEGMENT,
        GRAPH_TOOLS.CIRCLE,
        GRAPH_TOOLS.RAY,
        GRAPH_TOOLS.ROSE,
        GRAPH_TOOLS.CARDIOID,
      ],
    },
    {
      title: 'Miscellaneous',
      items: [GRAPH_TOOLS.AREA, GRAPH_TOOLS.DASHED],
    },
  ],
  // [graph.COMPLEX_GRID]: [],
}

export const getToolOptsByGrid = (gridType = graph.RECT_GRID, bgShapes) => {
  if (bgShapes) {
    return ALL_TOLLS[gridType] || ALL_TOLLS[graph.RECT_GRID]
  }
  return TOOLS_BY_GROUP[gridType] || TOOLS_BY_GROUP[graph.RECT_GRID]
}
