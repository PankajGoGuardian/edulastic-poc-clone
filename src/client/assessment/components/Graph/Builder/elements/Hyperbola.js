import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { handleSnap, colorGenerator } from "../utils";
import { getLabelParameters } from "../settings";

const jxgType = 90;

export const defaultConfig = {
  fixed: false,
  strokeWidth: 2,
  highlightStrokeWidth: 2
};

let points = [];

function create(board, hypPoints, id = null) {
  const baseColor = colorGenerator(board.elements.length);
  const newLine = board.$board.create("hyperbola", hypPoints, {
    ...defaultConfig,
    ...Colors.default[CONSTANT.TOOLS.HYPERBOLA],
    ...chooseColor(board.coloredElements, baseColor, null),
    label: getLabelParameters(jxgType),
    id
  });
  newLine.type = jxgType;
  newLine.labelIsVisible = true;
  newLine.baseColor = baseColor;
  handleSnap(newLine, Object.values(newLine.ancestors), board);
  board.handleStackedElementsMouseEvents(newLine);

  return newLine;
}

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    newPoint.isTemp = true;
    points.push(newPoint);
    if (points.length === 3) {
      points.forEach(point => {
        point.isTemp = false;
      });
      const newLine = create(board, points);
      points = [];
      return newLine;
    }
  };
}

function clean(board) {
  const result = points.length > 0;
  points.forEach(point => board.$board.removeObject(point));
  points = [];
  return result;
}

function getConfig(hyperbola) {
  return {
    _type: hyperbola.type,
    type: CONSTANT.TOOLS.HYPERBOLA,
    id: hyperbola.id,
    label: hyperbola.labelHTML || false,
    labelIsVisible: hyperbola.labelIsVisible,
    baseColor: hyperbola.baseColor,
    points: Object.keys(hyperbola.ancestors)
      .sort()
      .map(n => Point.getConfig(hyperbola.ancestors[n]))
  };
}

function parseConfig() {
  return {
    ...defaultConfig,
    ...Colors.default[CONSTANT.TOOLS.HYPERBOLA],
    label: getLabelParameters(jxgType)
  };
}

function chooseColor(coloredElements, color, bgShapes, priorityColor = null) {
  let elementColor;

  if (priorityColor && priorityColor.length > 0) {
    elementColor = priorityColor;
  } else if (!priorityColor && coloredElements && !bgShapes) {
    elementColor = color && color.length > 0 ? color : "#00b2ff";
  } else if (!priorityColor && !coloredElements && !bgShapes) {
    elementColor = "#00b2ff";
  } else if (bgShapes) {
    elementColor = "#ccc";
  }

  return {
    strokeColor: elementColor,
    highlightStrokeColor: elementColor
  };
}

function getPoints() {
  return points;
}

export default {
  onHandler,
  getConfig,
  clean,
  parseConfig,
  getPoints,
  create,
  chooseColor
};
