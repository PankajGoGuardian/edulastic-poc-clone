import JXG from 'jsxgraph'
import { isObject, round } from 'lodash'
import { tickLabel, radianTickLabel } from './utils'
import {
  Tangent,
  Logarithm,
  Sin,
  Cos,
  Parabola,
  Parabola2,
  PiecewiseLine,
} from './elements'

/**
 * Graph parameters
 * [x1, y1, x2, y2]
 * @see https://jsxgraph.org/docs/symbols/JXG.Board.html#boundingbox
 */

const graphParameters = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
}

const pointParameters = {
  /**
   * @see https://jsxgraph.org/docs/symbols/Point.html#showInfobox
   */
  showInfoBox: false,
  /**
   * @see https://jsxgraph.org/docs/symbols/Point.html#snapToGrid
   */
  snapToGrid: true,
  /**
   * @see https://jsxgraph.org/docs/symbols/JXG.GeometryElement.html#withLabel
   */
  withLabel: false,
  /**
   * @see https://jsxgraph.org/docs/symbols/Point.html#snapSizeX
   */
  snapSizeX: 1,
  /**
   * @see https://jsxgraph.org/docs/symbols/Point.html#snapSizeY
   */
  snapSizeY: 1,
}

const axesParameters = {
  /**
   * @see https://jsxgraph.org/docs/symbols/Ticks.html#ticksDistance
   */
  ticksDistance: 1,
  name: '',
  /**
   * @see https://jsxgraph.org/docs/symbols/Ticks.html#majorHeight
   */
  showTicks: true,
  /**
   * @see https://jsxgraph.org/docs/symbols/Ticks.html#drawLabels
   */
  drawLabels: true,
  /**
   * @see https://jsxgraph.org/docs/symbols/Line.html#firstArrow
   * @see https://jsxgraph.org/docs/symbols/JXG.GeometryElement.html#setArrow
   */
  maxArrow: true,
  /**
   * @see https://jsxgraph.org/docs/symbols/Line.html#lastArrow
   * @see https://jsxgraph.org/docs/symbols/JXG.GeometryElement.html#setArrow
   */
  minArrow: true,
  /**
   * @see https://jsxgraph.org/docs/symbols/Ticks.html#generateLabelText
   */
  commaInLabel: false,
  /**
   * @see https://jsxgraph.org/docs/symbols/Ticks.html#drawZero
   */
  drawZero: true,

  showAxis: true,
}

const gridParameters = {
  /**
   * special grid options
   * @see https://jsxgraph.org/docs/symbols/src/src_options.js.html
   */
  gridX: 1,
  /**
   * special grid options
   * @see https://jsxgraph.org/docs/symbols/src/src_options.js.html
   */
  gridY: 1,

  showGrid: true,
}

const bgImageParameters = {
  urlImg: '',
  coords: [0, 0],
  size: [100, 100],
  opacity: 0.5,
}

export const labelParameters = {
  cssClass: 'graph-shape-label',
  highlightCssClass: 'graph-shape-label',
}

const textParameters = {
  display: 'html',
  fontSize: 12,
  cssClass: 'mark',
  highlightCssClass: 'mark',
  parse: false,
}

export const getLabelPositionParameters = (elementType) => {
  switch (elementType) {
    case JXG.OBJECT_TYPE_POINT:
      return {
        position: 'top',
        offset: [0, 8],
        anchorX: 'left',
        anchorY: 'middle',
      }
    case Sin.jxgType:
      return {
        position: 'lft',
        offset: [10, 0],
        anchorX: 'left',
        anchorY: 'middle',
      }
    case Cos.jxgType:
      return {
        position: 'lft',
        offset: [10, 0],
        anchorX: 'left',
        anchorY: 'middle',
      }
    case Parabola.jxgType:
    case Parabola2.jxgType:
      return {
        position: 'top',
        offset: [0, -10],
        anchorX: 'middle',
        anchorY: 'top',
      }
    case Logarithm.jxgType:
      return {
        position: 'rt',
        offset: [-10, 0],
        anchorX: 'right',
        anchorY: 'middle',
      }
    case Tangent.jxgType:
      return {
        position: 'top',
        offset: [0, -10],
        anchorX: 'middle',
        anchorY: 'middle',
      }
    case PiecewiseLine.jxgType:
      return {
        position: 'lft',
        offset: [10, 0],
        anchorX: 'left',
        anchorY: 'middle',
      }
    default:
      return {
        position: 'top',
        offset: [0, 8],
        anchorX: 'middle',
        anchorY: 'middle',
      }
  }
}

export const getLabelParameters = (elementType) => ({
  ...labelParameters,
  ...getLabelPositionParameters(elementType),
})

export const defaultTextParameters = () => ({ ...textParameters })

export const defaultBgImageParameters = () => ({ ...bgImageParameters })

export const graphParameters2Boundingbox = (p) => [
  p.xMin || 0,
  p.yMax || 0,
  p.xMax || 0,
  p.yMin || 0,
]

export const numberlineGraphParametersToBoundingbox = (
  coords,
  xMargin,
  yMargin = 0
) => [
  coords.xMin - xMargin,
  coords.yMax + yMargin,
  coords.xMax + xMargin,
  coords.yMin - yMargin,
]

export const defaultAxesParameters = () => ({ ...axesParameters })

export const defaultGraphParameters = () => ({ ...graphParameters })

export const defaultPointParameters = () => ({ ...pointParameters })

export const defaultGridParameters = () => ({ ...gridParameters })

function mergeAxesParameters(target, parameters) {
  if (parameters.x.ticksDistance) {
    let xTickDistance = parseFloat(parameters.x.ticksDistance)
    if (parameters.x.useRadians) {
      xTickDistance = round(Math.PI / xTickDistance, 2)
    }
    target.x.ticks.ticksDistance = xTickDistance
  }
  if (parameters.y.ticksDistance) {
    let yTickDistance = parseFloat(parameters.y.ticksDistance)
    if (parameters.y.useRadians) {
      yTickDistance = round(Math.PI / yTickDistance, 2)
    }
    target.y.ticks.ticksDistance = yTickDistance
  }
  if (parameters.x.name) {
    target.x.withLabel = true
    target.x.name = parameters.x.name
  }
  if (parameters.y.name) {
    target.y.withLabel = true
    target.y.name = parameters.y.name
  }

  if ('showAxis' in parameters.x) {
    target.x.visible = parameters.x.showAxis
  }
  if ('showAxis' in parameters.y) {
    target.y.visible = parameters.y.showAxis
  }

  if ('showTicks' in parameters.x && parameters.x.showTicks === false) {
    target.x.ticks.majorHeight = 0
  }
  if ('showTicks' in parameters.y && parameters.y.showTicks === false) {
    target.y.ticks.majorHeight = 0
  }
  if ('drawLabels' in parameters.x) {
    target.x.ticks.drawLabels = parameters.x.drawLabels
  }
  if ('drawLabels' in parameters.y) {
    target.y.ticks.drawLabels = parameters.y.drawLabels
  }
  if ('minArrow' in parameters.x && parameters.x.minArrow === false) {
    target.x.firstArrow = false
  }
  if ('minArrow' in parameters.y && parameters.y.minArrow === false) {
    target.y.firstArrow = false
  }
  if ('maxArrow' in parameters.x && parameters.x.maxArrow === false) {
    target.x.lastArrow = false
  }
  if ('maxArrow' in parameters.y && parameters.y.maxArrow === false) {
    target.y.lastArrow = false
  }
  if ('gridX' in parameters) {
    target.grid.gridX = parameters.gridX
  }
  if ('gridY' in parameters) {
    target.grid.gridY = parameters.gridY
  }

  if (parameters.x.useRadians) {
    target.x.ticks.generateLabelText = radianTickLabel(
      'x',
      parameters.x.drawZero,
      parameters.x.ticksDistance
    )
  } else {
    target.x.ticks.generateLabelText = tickLabel(
      'x',
      parameters.x.commaInLabel,
      parameters.x.drawZero
    )
  }

  if (parameters.y.useRadians) {
    target.y.ticks.generateLabelText = radianTickLabel(
      'y',
      parameters.y.drawZero,
      parameters.y.ticksDistance
    )
  } else {
    target.y.ticks.generateLabelText = tickLabel(
      'y',
      parameters.y.commaInLabel,
      parameters.y.drawZero
    )
  }
}

export function mergeParams(defaultConfig, userConfig) {
  if (userConfig.graphParameters) {
    defaultConfig.boundingbox = graphParameters2Boundingbox(
      userConfig.graphParameters
    )
  }
  if (userConfig.axesParameters) {
    mergeAxesParameters(defaultConfig.defaultaxes, userConfig.axesParameters)
  }
  if ('gridParameters' in userConfig) {
    const { gridParameters: userGridPrams } = userConfig
    if ('gridX' in userGridPrams) {
      defaultConfig.grid.gridX = userGridPrams.gridX
    }
    if ('gridY' in userGridPrams) {
      defaultConfig.grid.gridY = userGridPrams.gridY
    }
    if ('showGrid' in userGridPrams) {
      defaultConfig.grid.visible = userGridPrams.showGrid
    }
  }
  return defaultConfig
}

export function fillConfigDefaultParameters(config) {
  if (!isObject(config.graphParameters)) {
    config.graphParameters = defaultGraphParameters()
  } else {
    config.graphParameters = {
      ...defaultGraphParameters(),
      ...config.graphParameters,
    }
  }

  if (!isObject(config.pointParameters)) {
    config.pointParameters = defaultPointParameters()
  } else {
    config.pointParameters = {
      ...defaultPointParameters(),
      ...config.pointParameters,
    }
  }

  if (!isObject(config.axesParameters)) {
    config.axesParameters = {
      x: defaultAxesParameters(),
      y: defaultAxesParameters(),
    }
  } else {
    config.axesParameters = {
      x: {
        ...defaultAxesParameters(),
        ...(config.axesParameters.x || {}),
      },
      y: {
        ...defaultAxesParameters(),
        ...(config.axesParameters.y || {}),
      },
    }
  }

  if (!isObject(config.gridParameters)) {
    config.gridParameters = defaultGridParameters()
  } else {
    config.gridParameters = {
      ...defaultGridParameters(),
      ...config.gridParameters,
    }
  }

  return config
}
