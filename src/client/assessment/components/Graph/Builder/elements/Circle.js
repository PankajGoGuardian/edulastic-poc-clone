import JXG from "jsxgraph";
import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { getLabelParameters } from "../settings";
import { handleSnap } from "../utils";

export const defaultConfig = {
  strokeWidth: 2,
  highlightStrokeWidth: 2
};

let points = [];

function create(board, circlePoints, id = null) {
  const newLine = board.$board.create("circle", circlePoints, {
    ...defaultConfig,
    ...Colors.default[CONSTANT.TOOLS.CIRCLE],
    label: getLabelParameters(JXG.OBJECT_TYPE_CIRCLE),
    id
  });
  newLine.labelIsVisible = true;
  newLine.baseColor = "#00b2ff";
  handleSnap(newLine, Object.values(newLine.ancestors), board);
  board.handleStackedElementsMouseEvents(newLine);

  return newLine;
}

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    newPoint.isTemp = true;
    points.push(newPoint);
    if (points.length === 2) {
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

function getConfig(circle) {
  return {
    _type: circle.type,
    type: CONSTANT.TOOLS.CIRCLE,
    id: circle.id,
    label: circle.labelHTML || false,
    labelIsVisible: circle.labelIsVisible,
    baseColor: circle.baseColor || "#00b2ff",
    points: Object.keys(circle.ancestors)
      .sort()
      .map(n => Point.getConfig(circle.ancestors[n]))
  };
}

function parseConfig() {
  return {
    ...defaultConfig,
    ...Colors.default[CONSTANT.TOOLS.CIRCLE],
    label: getLabelParameters(JXG.OBJECT_TYPE_CIRCLE)
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
