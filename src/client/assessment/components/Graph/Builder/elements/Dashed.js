import JXG from 'jsxgraph'
import {
  Exponent,
  Hyperbola,
  Logarithm,
  Parabola,
  Parabola2,
  Polynom,
  Secant,
  Sin,
  Tangent,
} from '.'
import { CONSTANT } from '../config'
import { getAllObjectsUnderMouse } from '../utils'

const availableTypes = [
  JXG.OBJECT_TYPE_CIRCLE,
  JXG.OBJECT_TYPE_CONIC,
  JXG.OBJECT_TYPE_LINE,
  JXG.OBJECT_TYPE_POLYGON,
  Exponent.jxgType,
  Hyperbola.jxgType,
  Logarithm.jxgType,
  Parabola.jxgType,
  Parabola2.jxgType,
  Polynom.jxgType,
  Secant.jxgType,
  Sin.jxgType,
  Tangent.jxgType,
]

function onHandler() {
  return (board, event) => {
    const elementsUnderMouse = getAllObjectsUnderMouse(board, event)
    const elementsToUpdate = board.elements.filter(
      (el) =>
        availableTypes.includes(el.type) &&
        elementsUnderMouse.findIndex((eum) => eum.id === el.id) > -1
    )
    if (elementsToUpdate.length === 0) {
      return
    }

    elementsToUpdate.forEach((el) => {
      el.dashed = !el.dashed
      if (el.type === JXG.OBJECT_TYPE_POLYGON) {
        el.borders.forEach((b) => b.setAttribute({ dash: el.dashed ? 2 : 0 }))
      } else {
        el.setAttribute({ dash: el.dashed ? 2 : 0 })
      }
    })

    board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_UPDATE)
  }
}

export default {
  onHandler,
}
