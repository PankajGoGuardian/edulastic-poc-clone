import JXG from 'jsxgraph'

const editButtonPattern =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.078 16">' +
  '<g transform="translate(0 -1.289)">' +
  '<path d="M10 3.959l3.269 3.271-8.279 8.279-3.269-3.271zm5.752-.789l-1.46-1.458a1.447 1.447 0 0 0-2.045 0l-1.4 1.4 3.271 3.271 1.63-1.63a1.115 1.115 0 0 0 .003-1.583zM.01 16.835a.372.372 0 0 0 .45.443l3.64-.884-3.264-3.27z" />' +
  '</g>' +
  '</svg>'

let buttonIsVisible = false
let currentElement = null
let timeoutId = null

function createButton(board, menuHandler) {
  const editButton = board.$board.create('text', [-3, 3, editButtonPattern], {
    fixed: true,
    snapToGrid: false,
    visible: false,
    anchorX: 'middle',
    anchorY: 'middle',
    cssClass: 'edit-button',
    highlightCssClass: 'edit-button',
    highlightFillOpacity: 1,
  })

  editButton.on('over', () => {
    if (buttonIsVisible) {
      window.clearTimeout(timeoutId)
    }
  })

  editButton.on('out', () => {
    if (buttonIsVisible) {
      board.editButton.setAttribute({ visible: false })
      buttonIsVisible = false

      if (currentElement.label) {
        currentElement.label.setAttribute({ visible: true })
      }
    }
  })

  editButton.on('down', () => {
    board.creatingHandlerIsDisabled = true
  })

  editButton.on('up', () => {
    menuHandler(currentElement.id)
    board.creatingHandlerIsDisabled = false
    window.clearTimeout(timeoutId)
    board.editButton.setAttribute({ visible: false })
    buttonIsVisible = false

    if (currentElement.label) {
      currentElement.label.setAttribute({ visible: true })
    }
  })

  return editButton
}

function moveButton(board, coords, element) {
  window.clearTimeout(timeoutId)

  if (
    currentElement !== null &&
    currentElement.id !== element.id &&
    buttonIsVisible &&
    timeoutId
  ) {
    if (currentElement.label) {
      currentElement.label.setAttribute({ visible: true })
    }
  }

  const x = parseFloat(
    (coords.usrCoords[1] + 22.5 / board.$board.unitX).toFixed(3)
  )
  const y = parseFloat(
    (coords.usrCoords[2] + 20 / board.$board.unitY).toFixed(3)
  )
  board.editButton.setPosition(JXG.COORDS_BY_USER, [x, y])

  if (element.label) {
    element.label.setAttribute({ visible: false })
  }

  board.editButton.setAttribute({ visible: true })
  buttonIsVisible = true
  currentElement = element
  board.$board.fullUpdate()
}

function hideButton(board, element) {
  timeoutId = window.setTimeout(() => {
    if (buttonIsVisible) {
      if (element.label) {
        element.label.setAttribute({ visible: true })
      }

      buttonIsVisible = false
      board.editButton.setAttribute({ visible: false })
    }
  }, 1500)
}

function cleanButton(board, element) {
  window.clearTimeout(timeoutId)
  buttonIsVisible = false
  board.editButton.setAttribute({ visible: false })

  if (element.label) {
    element.label.setAttribute({ visible: true })
  }
}

export default {
  createButton,
  moveButton,
  hideButton,
  cleanButton,
}
