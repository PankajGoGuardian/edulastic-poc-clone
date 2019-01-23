
const removeObject = (board, elementsUnderMouse) => {
  let elementToDelete = elementsUnderMouse.find(element => element.elType === 'segment');

  if (elementToDelete) {
    elementToDelete.inherits.forEach(point => board.$board.removeObject(point));
    board.$board.removeObject(elementToDelete);
    board.elements = board.elements.filter(element => element.id !== elementToDelete.id);
  }

  elementToDelete = elementsUnderMouse.find(element => element.elType === 'point');

  if (elementToDelete) {
    board.$board.removeObject(elementToDelete);
    board.elements = board.elements.filter(element => element.id !== elementToDelete.id);
  }
};

export default {
  removeObject
};
