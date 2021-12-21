import Jsx from 'jsxgraph'
import { CONSTANT } from '../config'
import { getAllObjectsUnderMouse } from '../utils'

function onHandler() {
  return (board, evt, elements) => {
    const underPoint = getAllObjectsUnderMouse(board, evt)
    const point = underPoint.find(
      (x) => x.type === Jsx.OBJECT_TYPE_POINT && x.subElement
    )
    if (point) {
      const child = elements.find((el) => el.parents?.includes(point.id))
      if (child && child.elType === 'line') {
        if (
          !child.visProp.straightfirst &&
          child.visProp.straightlast &&
          !child.visProp.firstarrow &&
          child.visProp.lastarrow &&
          child.parents[0] === point.id // allow only first
        ) {
          // Ray Object
          point.opened = !point.opened
          board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_UPDATE)
        } else if (
          !child.visProp.straightfirst &&
          !child.visProp.straightlast &&
          !child.visProp.firstarrow &&
          !child.visProp.lastarrow
        ) {
          // Segment Object
          point.opened = !point.opened
          board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_UPDATE)
        }
      }
    }
  }
}

export default {
  onHandler,
}
