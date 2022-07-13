import JXG from 'jsxgraph'
import { notification } from '@edulastic/common'
import {
  Exponent,
  Hyperbola,
  Logarithm,
  Parabola,
  Parabola2,
  Polynom,
  Secant,
  Sin,
  Cos,
  Tangent,
  Exponent2,
  Cardioid,
  Rose,
} from '.'
import PiecewiseLine from './PiecewiseLine'
import { CONSTANT } from '../config'
import { getAllObjectsUnderMouse } from '../utils'

const availableTypes = [
  JXG.OBJECT_TYPE_CIRCLE,
  JXG.OBJECT_TYPE_CONIC,
  JXG.OBJECT_TYPE_LINE,
  JXG.OBJECT_TYPE_POLYGON,
  Exponent.jxgType,
  Exponent2.jxgType,
  Hyperbola.jxgType,
  Logarithm.jxgType,
  Parabola.jxgType,
  Parabola2.jxgType,
  Polynom.jxgType,
  Sin.jxgType,
  Cos.jxgType,
  PiecewiseLine.jxgType,
  Cardioid.jxgType,
  Rose.jxgType,
]

function onHandler() {
  return (board, event) => {
    const elementsUnderMouse = getAllObjectsUnderMouse(board, event)
    const hasTanget = elementsUnderMouse.some(
      (el) => el.type === Tangent.jxgType
    )
    if (hasTanget) {
      notification({
        msg: 'Cannot use Dashed with Tangent',
        type: 'warning',
      })
      return
    }
    const hasSecant = elementsUnderMouse.some(
      (el) => el.type === Secant.jxgType
    )
    if (hasSecant) {
      notification({
        msg: 'Cannot use Dashed with Secant',
        type: 'warning',
      })
      return
    }
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
