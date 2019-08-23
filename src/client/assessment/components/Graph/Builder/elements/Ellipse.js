import JXG from "jsxgraph";
import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { handleSnap } from "../utils";
import { getLabelParameters } from "../settings";

export const defaultConfig = { fixed: false };

let points = [];

function create(board, ellipsePoints, id = null) {
  const newLine = board.$board.create("ellipse", ellipsePoints, {
    ...defaultConfig,
    ...Colors.default[CONSTANT.TOOLS.CIRCLE],
    label: getLabelParameters(JXG.OBJECT_TYPE_CONIC),
    id
  });
  newLine.labelIsVisible = true;
  newLine.color = "";
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

function getConfig(ellipse) {
  return {
    _type: ellipse.type,
    type: CONSTANT.TOOLS.ELLIPSE,
    id: ellipse.id,
    label: ellipse.labelHTML || false,
    labelIsVisible: ellipse.labelIsVisible,
    color: ellipse.color || "",
    points: Object.keys(ellipse.ancestors)
      .sort()
      .map(n => Point.getConfig(ellipse.ancestors[n]))
  };
}

function parseConfig() {
  return {
    ...defaultConfig,
    ...Colors.default[CONSTANT.TOOLS.CIRCLE],
    label: getLabelParameters(JXG.OBJECT_TYPE_CONIC)
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
  create
};
