import Input from "./Input";

const elWeight = {
  point: 1,
  polygon: 2,
  circle: 3,
  line: 4,
  curve: 5
};

const allowElements = ["polygon", "point", "circle", "line", "curve"];

/**
 * @param {array} elements
 */
function getElementUnderMouse(elements) {
  const filteredElements = elements
    .filter(el => ~allowElements.indexOf(el.elType))
    .sort((a, b) => elWeight[a.elType] - elWeight[b.elType]);
  let element;
  if (filteredElements[0] && filteredElements[0].elType === "point") {
    return (element = filteredElements[0]);
  } else if (filteredElements[0] && filteredElements[0].ancestors) {
    Object.values(filteredElements[0].ancestors).forEach(ancestor => {
      if (!ancestor.hasLabel || (ancestor.label && ancestor.label.plaintext.length === 0)) {
        return (element = ancestor);
      }
    });
  } else {
    return (element = null);
  }

  return element;
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
