import JXG from "jsxgraph";
import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { handleSnap } from "../utils";
import { getLabelParameters } from "../settings";

export const defaultConfig = { fixed: false };

let points = [];

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    if (newPoint) {
      points.push(newPoint);
    }
    if (points.length === 3) {
      const newLine = board.$board.create("ellipse", points, {
        ...defaultConfig,
        ...Colors.default[CONSTANT.TOOLS.CIRCLE],
        label: getLabelParameters(JXG.OBJECT_TYPE_CONIC)
      });
      handleSnap(newLine, points.filter(point => point.elType === "point"));
      if (newLine) {
        points = [];
        return newLine;
      }
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
    points: Object.keys(ellipse.ancestors)
      .sort()
      .map(n => Point.getConfig(ellipse.ancestors[n]))
  };
}

function parseConfig() {
  return {
    fillColor: "transparent",
    highlightFillColor: "transparent",
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
  getPoints
};
