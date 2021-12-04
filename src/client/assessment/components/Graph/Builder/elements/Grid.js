import { isEmpty, range, cloneDeep } from 'lodash'
import { greyThemeDark1, someGreyColor1 } from '@edulastic/colors'
import { getMathHtml } from '@edulastic/common'
import { angleAxesParams } from '../settings'
import { CONSTANT } from '../config'

const xAxis = [0, 180]
const yAxis = [90, 270]

const labelOpts = {
  0: {
    offset: [8, -10],
    anchorX: 'middle',
    anchorY: 'middle',
  },
  90: {
    offset: [-8, 6],
    anchorX: 'right',
    anchorY: 'middle',
  },
  180: {
    offset: [-8, -10],
    anchorX: 'middle',
    anchorY: 'middle',
  },
  270: {
    offset: [-8, -6],
    anchorX: 'right',
    anchorY: 'middle',
  },
}

const THETA_IN_RADIANS = {
  15: '\\frac{\\pi}{12}',
  30: '\\frac{\\pi}{6}',
  45: '\\frac{\\pi}{4}',
  60: '\\frac{\\pi}{3}',
  75: '\\frac{5}{12}\\pi',
  90: '\\frac{\\pi}{2}',
  105: '\\frac{7}{12}\\pi',
  120: '\\frac{2}{3}\\pi',
  135: '\\frac{3}{4}\\pi',
  150: '\\frac{5}{6}\\pi',
  165: '\\frac{11}{12}\\pi',
  180: '\\pi',
  195: '\\frac{13}{12}\\pi',
  210: '\\frac{7}{6}\\pi',
  225: '\\frac{5}{4}\\pi',
  240: '\\frac{4}{3}\\pi',
  255: '\\frac{17}{12}\\pi',
  270: '\\frac{3}{2}\\pi',
  285: '\\frac{19}{12}\\pi',
  300: '\\frac{5}{3}\\pi',
  315: '\\frac{7}{4}\\pi',
  330: '\\frac{11}{6}\\pi',
  345: '\\frac{23}{12}\\pi',
}

const angleDelta = 0.8

const mergeAngleAxisParams = (options = {}) => {
  const params = cloneDeep(angleAxesParams)
  // if ('drawZero' in yAxisParams) {
  //   params.ticks.drawZero = yAxisParams.drawZero
  // }
  const { tShowAxis = true } = options
  params.visible = tShowAxis

  return params
}

const generatePolarLabel = (theta, tRadians) => {
  return () => {
    if (theta === 0) {
      if (tRadians) {
        return getMathHtml(`0\\,\\&\\,2\\pi`)
      }
      return getMathHtml(`0\\degree/\\,360\\degree`)
    }
    if (tRadians) {
      return getMathHtml(THETA_IN_RADIANS[theta])
    }
    return getMathHtml(`${theta}\\degree`)
  }
}

function drawTheta(board, theta, gridParams, radiusArr) {
  const {
    rMax = 10,
    rDrawLabel = true,
    tDrawLabel = true,
    tRadians,
  } = gridParams

  const params = mergeAngleAxisParams(gridParams)
  const p1 = [0, 0]
  const p2 = [0, 0]
  const thetaRadian = (theta * Math.PI) / 180
  const x = Math.cos(thetaRadian)
  const y = Math.sin(thetaRadian)

  p2[0] = x * Math.abs(rMax + angleDelta)
  p2[1] = y * Math.abs(rMax + angleDelta)

  let flag = true
  if (theta > 90 && theta < 275) {
    flag = false
  }
  const points = flag ? [p1, p2] : [p2, p1]

  let offset = [10 + x, 10 + y]
  if (theta > 90 && theta <= 180) {
    offset = [-10 - x, 10 + y]
  }
  if (theta > 180 && theta <= 270) {
    offset = [-10 - x, -10 - y]
  }
  if (theta > 270 && theta < 360) {
    offset = [10 + x, -10 - y]
  }

  if (params && (xAxis.includes(theta) || yAxis.includes(theta))) {
    params.strokeWidth = 1.5
    params.strokeColor = greyThemeDark1
    params.highlightStrokeColor = greyThemeDark1
  }

  const axis = board.create('axis', points, params)

  if (tDrawLabel) {
    const ticks = flag ? [rMax + angleDelta] : [-rMax - angleDelta]
    board.create('ticks', [axis, ticks], {
      strokeColor: '#ff0000',
      majorHeight: 0,
      drawLabels: true,
      includeBoundaries: true,
      generateLabelText: generatePolarLabel(theta, tRadians),
      label: {
        offset,
        anchorX: 'middle',
        anchorY: 'middle',
      },
    })
  }

  if (rDrawLabel && (xAxis.includes(theta) || yAxis.includes(theta))) {
    const rTickts = theta <= 90 ? radiusArr : radiusArr.map((r) => -r)
    board.create('ticks', [axis, rTickts], {
      strokeColor: '#ff0000',
      majorHeight: 0,
      drawLabels: true, // TODO: add option setting
      label: labelOpts[theta],
    })
    if (theta == 90) {
      board.create('ticks', [axis, [0]], {
        strokeColor: '#ff0000',
        majorHeight: 0,
        drawLabels: true, // TODO: add option setting
        label: {
          offset: [-8, -10],
          anchorX: 'right',
          anchorY: 'middle',
        },
      })
    }
  }

  return axis
}

function drawCircle(board, radius) {
  const p1 = [0, 0]
  let p2 = [0, 0]

  p2 = board.create('point', [radius, 0], {
    showInfoBox: false,
    withLabel: false,
    fixed: true,
    visible: false,
  })

  const circle = board.create('circle', [p1, p2], {
    strokeColor: someGreyColor1,
    highlightStrokeColor: someGreyColor1,
    strokeWidth: 1,
  })
  return circle
}

/**
 *
 * @param {object} board jsxgraph instance
 * @param {object} gridParams grid parameters
 * @returns an array of axes
 */
function addPolarGrid(board, gridParams = {}) {
  const {
    tMin = 0,
    tMax = 360,
    tDist = 30,
    rMin = 0,
    rMax = 10,
    rDist = 1,
    rShowAxis = true,
  } = gridParams

  // make the board to square shape always
  board.setBoundingBox([-rMax - 2.5, rMax + 2.5, rMax + 2.5, -rMax - 2.5])

  // drawing angle axes based on theta
  const thetaArr = range(tMin, tMax, tDist)
  const radiusArr = range(rMin + rDist, rMax + rDist, rDist)

  const circles = rShowAxis ? radiusArr.map((r) => drawCircle(board, r)) : []
  const angleAxes = thetaArr.map((theta) =>
    drawTheta(board, theta, gridParams, radiusArr)
  )
  return [...angleAxes, ...circles]
}

function switchGrid(gridParams) {
  // TODO: performance issue still exist here
  if (!isEmpty(this.polarGrid)) {
    // https://jsxgraph.uni-bayreuth.de/docs/symbols/JXG.Board.html#suspendUpdate
    this.$board.suspendUpdate()
    this.polarGrid.forEach((el) => {
      this.$board.removeObject(el)
    })
    this.polarGrid = null
    // https://jsxgraph.uni-bayreuth.de/docs/symbols/JXG.Board.html#unsuspendUpdate
    this.$board.unsuspendUpdate()
  }
  const axes = this.$board.defaultAxes

  switch (this.gridType) {
    case CONSTANT.POLAR_GRID:
      this.$board.removeGrids()
      axes.x.setAttribute({ visible: false })
      axes.y.setAttribute({ visible: false })
      axes.x.ticks[0].setAttribute({ visible: false })
      axes.y.ticks[0].setAttribute({ visible: false })
      this.polarGrid = addPolarGrid(this.$board, gridParams)
      break
    case CONSTANT.RECT_GRID: {
      this.$board.addGrid()
      axes.x.setAttribute({ visible: true })
      axes.y.setAttribute({ visible: true })
      axes.x.ticks[0].setAttribute({ visible: true })
      axes.y.ticks[0].setAttribute({ visible: true })
      this.setGraphParameters(this.parameters.graphParameters)
      break
    }
    default:
      break
  }
}

export default {
  switchGrid,
}
