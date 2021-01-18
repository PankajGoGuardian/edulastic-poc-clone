import { round } from 'lodash'
import { getMathHtml } from '@edulastic/common'
import { updateAxe } from '../utils'

const generateTicks = (min, max, ticksDistance, useRadians) => {
  let ticks = []
  if (useRadians) {
    ticks = generateTicks(min, max, Math.PI / (ticksDistance || 1))
  } else if (ticksDistance === 0) {
    ticks.push(min)
    ticks.push(max)
  } else {
    ticks.push(min)
    let startPoint = 0
    if (min > 0) {
      startPoint = min
      let i = startPoint
      while (i < max) {
        ticks.push(i)
        i += ticksDistance
      }
    } else if (max < 0) {
      do {
        startPoint -= ticksDistance
      } while (startPoint > max)

      let i = startPoint
      while (i > min) {
        ticks.push(i)
        i -= ticksDistance
      }
    } else {
      // startPoint === 0
      let i = startPoint
      while (i < max) {
        ticks.push(i)
        i += ticksDistance
      }
      i = startPoint
      i -= ticksDistance
      while (i > min) {
        ticks.push(i)
        i -= ticksDistance
      }
    }
    ticks.push(max)
  }

  ticks.forEach((val, index) => {
    ticks[index] = round(val, 2)
  })

  return ticks.filter((x) => x)
}

const generateLabels = (ticks, distance) => {
  return ticks.map((t) => {
    const tick = round(t * (distance / Math.PI))
    const sign = tick < 0 ? '-' : ''

    if (tick === 0) {
      return ''
    }
    if (tick % distance === 0) {
      const quo = round(tick / distance)
      if (quo === 1) {
        return getMathHtml(`\\pi`)
      }
      return getMathHtml(`${quo}\\pi`)
    }

    if (Math.abs(tick) === 1) {
      return getMathHtml(`${sign}\\frac{\\pi}{${distance}}`)
    }
    return getMathHtml(`${sign}\\frac{${Math.abs(tick)}}{${distance}}\\pi`)
  })
}

const createAxisTicks = (board, axis, params, axe) => {
  updateAxe(axis, params, axe)

  axis.removeAllTicks()

  const isHorizontal = axe === 'x'
  const [xMin, yMax, xMax, yMin] = board.getBoundingBox()
  const { ticksDistance, useRadians } = params

  const ticks = generateTicks(
    isHorizontal ? xMin : yMin,
    isHorizontal ? xMax : yMax,
    ticksDistance,
    useRadians
  )

  const ticksOptions = {
    drawLabels: params.drawLabels,
    majorHeight: params.showTicks ? 10 : 0,
    strokeColor: '#434B5D',
    highlightStrokeColor: '#434B5D',
    label: {
      display: 'html',
      offset: isHorizontal ? [0, -5] : [-10, 0],
      anchorX: isHorizontal ? 'middle' : 'right',
      anchorY: isHorizontal ? 'top' : 'middle',
    },
  }

  if (useRadians) {
    ticksOptions.label.offset = isHorizontal ? [0, -10] : [-10, 0]
    ticksOptions.labels = generateLabels(ticks, ticksDistance)
    ticksOptions.generateLabelText = (a, b, l) => l
  }

  board.create('ticks', [axis, ticks], ticksOptions)
}

export default {
  create: createAxisTicks,
}
