const jxgType = 106

function drawRose(board, obj) {
  const f = 4
  const k = 2
  const l = 2
  const c = board.$board.create(
    'curve',
    [(phi) => f * Math.cos(k * phi), [obj.x, obj.y], 0, () => l * Math.PI],
    {
      curveType: 'polar',
      strokewidth: 2,
      fixed: false,
    }
  )

  c.on('drag', () => {
    board.dragged = true
  })
}

function onHandler(board, event) {
  const coords = board.getCoords(event).usrCoords
  const object = {
    x: coords[1],
    y: coords[2],
  }

  drawRose(board, object)
}

function getConfig() {}

export default { jxgType, onHandler, getConfig }
