import JXG from "jsxgraph";
import { Point } from ".";
import { getLineTypeByProp, getPropsByLineType, handleSnap, colorGenerator, setLabel } from "../utils";
import { getLabelParameters } from "../settings";

export const defaultConfig = {
  firstarrow: true,
  lastarrow: true,
  strokewidth: 2,
  highlightstrokewidth: 2
};

let points = [];

function getColorParams(color) {
  return {
    fillColor: color,
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: color
  };
}

function create(board, object, linePoints, type, settings = {}) {
  const { labelIsVisible = true, fixed = false } = settings;

  const { id = null, label, baseColor, priorityColor } = object;

  const newLine = board.$board.create("line", linePoints, {
    ...getPropsByLineType(type),
    ...getColorParams(priorityColor || board.priorityColor || baseColor),
    label: {
      ...getLabelParameters(JXG.OBJECT_TYPE_LINE),
      visible: labelIsVisible
    },
    fixed,
    id
  });
  newLine.labelIsVisible = object.labelIsVisible;
  newLine.baseColor = object.baseColor;

  if (!fixed) {
    handleSnap(newLine, Object.values(newLine.ancestors), board);
    board.handleStackedElementsMouseEvents(newLine);
  }

  if (labelIsVisible) {
    setLabel(newLine, label);
  }

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
      const object = {
        label: false,
        labelIsVisible: true,
        baseColor: colorGenerator(board.elements.length)
      };
      const newLine = create(board, object, points, type);
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

function getTempPoints() {
  return points;
}

export default {
  onHandler(type) {
    return onLineHandler(type);
  },
  getConfig,
  clean,
  getTempPoints,
  create,
  getColorParams
};
