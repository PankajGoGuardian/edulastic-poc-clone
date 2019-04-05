import Input from "./Input";

const elWeight = {
  point: 1,
  polygon: 2,
  circle: 3,
  ellipse: 4,
  hyperbola: 5,
  line: 6,
  curve: 7
};

const allowElements = ["polygon", "point", "circle", "ellipse", "hyperbola", "line", "curve"];

/**
 * @param {array} elements
 */
function getElementUnderMouse(elements) {
  const filteredElements = elements
    .filter(el => ~allowElements.indexOf(el.elType))
    .sort((a, b) => elWeight[a.elType] - elWeight[b.elType]);
  // todo: filter background shapes
  return filteredElements[0] || null;
}

function onHandler() {
  return board => {
    const currentElement = getElementUnderMouse(board.$board.downObjects);
    // if (!currentElement || currentElement.getAttribute("fixed") === true) {
    if (!currentElement) {
      return;
    }
    const hasLabel = currentElement.label && currentElement.label.plaintext;
    if (!hasLabel) {
      Input(currentElement).init();
    } else {
      Input(currentElement).update();
    }
  };
}

export default {
  onHandler
};
