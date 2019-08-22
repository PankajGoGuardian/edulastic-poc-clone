import JXG from "jsxgraph";
import { Point } from ".";
import { getLineTypeByProp, getPropsByLineType, handleSnap } from "../utils";
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
  const newLine = board.$board.create("line", linePoints, {
    ...getPropsByLineType(type),
    ...Colors.default[CONSTANT.TOOLS.LINE],
    label: getLabelParameters(JXG.OBJECT_TYPE_LINE),
    id
  });
  newLine.labelIsVisible = true;
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
  create
};
