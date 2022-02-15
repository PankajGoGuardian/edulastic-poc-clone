import Jsx from 'jsxgraph'
import { CONSTANT } from '../config'
import { getAllObjectsUnderMouse } from '../utils'
import { PiecewiseLine, PiecewiseParabola } from '.'

const TYPES = [PiecewiseLine.jxgType, PiecewiseParabola.jxgType]

function getCreatePoint(type) {
  switch (type) {
    case PiecewiseLine.jxgType:
      return PiecewiseLine.createPiecewisePoint
    case PiecewiseParabola.jxgType:
      return PiecewiseParabola.createPiecewisePoint
    default:
      return () => null
  }
}

function onHandler() {
  return (board, event) => {
    const elements = getAllObjectsUnderMouse(board, event)
    const piecewise = elements.find(
      (x) => x.type === Jsx.OBJECT_TYPE_POINT && x.piecewise
    )
    const elementsToUpdate = board.elements.filter(
      (el) =>
        TYPES.includes(el.type) &&
        elements.findIndex((eum) => eum.id === el.id) > -1
    )

    let needToUpdate = false
    if (piecewise) {
      piecewise.closed = !piecewise.closed
    } else if (elementsToUpdate.length > 0) {
      elementsToUpdate.forEach((el) => {
        const createPoint = getCreatePoint(el.type)
        const coords = board.getCoords(event).usrCoords
        const newPoint = createPoint(board, { x: coords[1], y: coords[2] }, el)
        if (newPoint) {
          needToUpdate = true
          el.addParents([newPoint])
          el.ancestors[newPoint.id] = newPoint
        }
      })
    }

    if (needToUpdate) {
      board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_UPDATE)
    }
  }
}

export default { onHandler }
