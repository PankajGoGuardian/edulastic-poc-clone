import { CONSTANT, Colors } from '../config'

const connectlineConfig = {
  dash: 5,
  ...Colors.connectline,
}

function create(board, elements) {
  if (!elements) {
    return
  }
  const pointX = []
  const pointY = []

  elements
    .filter((e) => e.type === CONSTANT.TOOLS.POINT && !e.subElement)
    .sort((a, b) => {
      return a.x - b.x
    })
    .forEach((p) => {
      pointX.push(p.x)
      pointY.push(p.y)
    })

  if (board.connectline) {
    board.removeObject(board.connectline)
  }

  if (pointX.length > 0 && pointY.length > 0) {
    return board.create('curve', [pointX, pointY], connectlineConfig)
  }
}

function remove(board, connectline) {
  if (connectline) {
    board.removeObject(connectline)
  }
}

export default {
  remove,
  create,
}
