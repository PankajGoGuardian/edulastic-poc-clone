import FroalaEditorInput from "./FroalaEditorInput";

const elWeight = {
  point: 1,
  polygon: 2,
  circle: 3,
  ellipse: 4,
  hyperbola: 5,
  line: 6,
  parabola: 7,
  curve: 8
};

const allowElements = ["polygon", "point", "circle", "ellipse", "hyperbola", "line", "parabola", "curve"];

function onHandler() {
  return board => {
    const elements = board.$board.downObjects;
    const { bgElements } = board;

    const filteredElements = elements
      .filter(el => !~bgElements.findIndex(bgEl => bgEl.id === el.id || bgEl.ancestors[el.id]))
      .filter(el => ~allowElements.indexOf(el.elType))
      .sort((a, b) => elWeight[a.elType] - elWeight[b.elType]);

    const currentElement = filteredElements[0] || null;

    if (!currentElement) {
      return;
    }

    FroalaEditorInput(currentElement, board).setFocus();
  };
}

export default {
  onHandler
};
