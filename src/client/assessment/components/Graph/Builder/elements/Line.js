import JXG from "jsxgraph";
import { Point } from ".";
import { getLineTypeByProp, getPropsByLineType, handleSnap, colorGenerator } from "../utils";
import { Colors, CONSTANT } from "../config";
import { getLabelParameters } from "../settings";

export const defaultConfig = {
  firstarrow: true,
  lastarrow: true,
  strokewidth: 2,
  highlightstrokewidth: 2
};

let points = [];

function create(board, linePoints, type, id = null) {
  const baseColor = colorGenerator(board.elements.length);
  const newLine = board.$board.create("line", linePoints, {
    ...getPropsByLineType(type),
    ...Colors.default[CONSTANT.TOOLS.LINE],
    ...chooseColor(board.coloredElements, baseColor, null),
    label: getLabelParameters(JXG.OBJECT_TYPE_LINE),
    id
  });
  newLine.labelIsVisible = true;
  newLine.baseColor = baseColor;
  handleSnap(newLine, Object.values(newLine.ancestors), board);
  board.handleStackedElementsMouseEvents(newLine);

  return newLine;
}

function onLineHandler(type) {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    newPoint.isTemp = true;
    points.push(newPoint);
    if (points.length === 2) {
      points.forEach(point => {
        point.isTemp = false;
      });
      const newLine = create(board, points, type);
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

function getConfig(line) {
  return {
    _type: line.type,
    type: getLineTypeByProp(line.getAttributes()),
    id: line.id,
    label: line.labelHTML || false,
    labelIsVisible: line.labelIsVisible,
    baseColor: line.baseColor,
    points: Object.keys(line.ancestors)
      .sort()
      .map(n => Point.getConfig(line.ancestors[n]))
  };
}

function parseConfig(type) {
  return {
    ...getPropsByLineType(type),
    ...Colors.default[CONSTANT.TOOLS.LINE],
    label: getLabelParameters(JXG.OBJECT_TYPE_LINE)
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
  onHandler(type) {
    return onLineHandler(type);
  },
  getConfig,
  parseConfig,
  clean,
  getPoints,
  create,
  chooseColor
};
