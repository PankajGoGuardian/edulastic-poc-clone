import JXG from 'jsxgraph'
import striptags from 'striptags'
import { replaceLatexesWithMathHtml } from '@edulastic/common/src/utils/mathUtils'

import { calcMeasure, getClosestTick } from '../utils'
import { CONSTANT } from '../config'

const deleteIconPattern =
  '<svg id="{iconId}" class="delete-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.728 16.702">' +
  '<g id="{iconId}" transform="translate(-40.782 .5)">' +
  '<path id="{iconId}" d="M48.889.522V0H45.4v.522h-4.12v2.112h11.73V.522z" />' +
  '<path id="{iconId}" d="M57.546 80.756h8.939l.642-12.412H56.9zm5.486-9.511h1.107v6.325h-1.107zm-3.14 0H61v6.325h-1.108z"transform="translate(-14.87 -65.054)"/>' +
  '</g>' +
  '</svg>'

const snapMark = (mark, board) => {
  mark.on('up', () => {
    const {
      canvas,
      layout: { linePosition },
    } = board.numberlineSettings

    const setCoords = JXG.COORDS_BY_USER
    const [, yMeasure] = calcMeasure(
      board.$board.canvasWidth,
      board.$board.canvasHeight,
      board
    )

    const y = canvas.yMax - (yMeasure / 100) * linePosition
    let x
    if (board.numberlineSnapToTicks) {
      x = getClosestTick(mark.X(), board.numberlineAxis)
    } else {
      x = mark.X()
    }

    mark.setPosition(setCoords, [x, y])
    board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE)
  })
}

const onHandler = (board, value) => {
  const {
    canvas,
    layout: { linePosition },
  } = board.numberlineSettings

  const [, yMeasure] = calcMeasure(
    board.$board.canvasWidth,
    board.$board.canvasHeight,
    board
  )
  const lineY = canvas.yMax - (yMeasure / 100) * linePosition
  const x = value.position
  const y = lineY

  let content = replaceLatexesWithMathHtml(value.point)

  const regExp = new RegExp('<span class="input__math"', 'g')
  let title = ''
  if (!regExp.test(content)) {
    title = striptags(content)
  }

  if (!value.fixed) {
    const deleteIconId = `mark-delete-${value.id}`
    content += deleteIconPattern.replace(/{iconId}/g, deleteIconId)
  }

  content = `<div class='mark-content' title='${title}'>${content}</div>`

  const cssClass = `fr-box mark mounted ${
    value.className ? value.className : ''
  }`

  const mark = board.$board.create('text', [x, y, content], {
    id: value.fixed ? null : value.id,
    anchorX: 'middle',
    anchorY: 'bottom',
    fixed: !!value.fixed,
    cssClass,
    highlightCssClass: cssClass,
  })

  if (!value.fixed) {
    snapMark(mark, board)
  }

  mark.labelHTML = value.point

  return mark
}

const getConfig = (mark) => ({
  position: +mark.X().toFixed(4),
  point: mark.labelHTML,
  id: mark.id,
})

export default {
  onHandler,
  getConfig,
}
