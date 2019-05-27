import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { handleSnap } from "../utils";
import { getLabelParameters } from "../settings";

const jxgType = 90;

export const defaultConfig = { fixed: false };

let points = [];

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    newPoint.isTemp = true;
    points.push(newPoint);
    if (points.length === 3) {
      points.forEach(point => {
        point.isTemp = false;
      });
      const newLine = board.$board.create("hyperbola", points, {
        ...defaultConfig,
        ...Colors.default[CONSTANT.TOOLS.HYPERBOLA],
        label: getLabelParameters(jxgType)
      });
      newLine.type = jxgType;
      handleSnap(newLine, Object.values(newLine.ancestors), board);
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

function getConfig(hyperbola) {
  return {
    _type: hyperbola.type,
    type: CONSTANT.TOOLS.HYPERBOLA,
    id: hyperbola.id,
    label: hyperbola.labelHTML || false,
    points: Object.keys(hyperbola.ancestors)
      .sort()
      .map(n => Point.getConfig(hyperbola.ancestors[n]))
  };
}

function parseConfig() {
  return {
    fillColor: "transparent",
    highlightFillColor: "transparent",
    label: getLabelParameters(jxgType)
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
