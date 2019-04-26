import JXG from "jsxgraph";
import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { getLabelParameters } from "../settings";

export const defaultConfig = {};

let points = [];

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    if (newPoint) {
      points.push(newPoint);
    }
    if (points.length === 2) {
      const newLine = board.$board.create("circle", points, {
        ...defaultConfig,
        ...Colors.default[CONSTANT.TOOLS.CIRCLE],
        label: getLabelParameters(JXG.OBJECT_TYPE_CIRCLE)
      });
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

function getConfig(circle) {
  return {
    _type: circle.type,
    type: CONSTANT.TOOLS.CIRCLE,
    id: circle.id,
    label: circle.labelHTML || false,
    points: Object.keys(circle.ancestors)
      .sort()
      .map(n => Point.getConfig(circle.ancestors[n]))
  };
}

function parseConfig() {
  return {
    fillColor: "transparent",
    highlightFillColor: "transparent",
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
  getPoints
};
