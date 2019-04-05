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
    if (newPoint) {
      points.push(newPoint);
    }
    if (points.length === 3) {
      const newLine = board.$board.create("hyperbola", points, {
        ...defaultConfig,
        ...Colors.default[CONSTANT.TOOLS.HYPERBOLA],
        label: getLabelParameters(jxgType)
      });
      newLine.type = jxgType;
      handleSnap(newLine, points.filter(point => point.elType === "point"));
      if (newLine) {
        points = [];
        return newLine;
      }
    }
  };
}

const cleanPoints = board => {
  points.forEach(point => board.$board.removeObject(point));
  points = [];
};

function getConfig(hyperbola) {
  return {
    _type: hyperbola.type,
    type: CONSTANT.TOOLS.HYPERBOLA,
    id: hyperbola.id,
    label: hyperbola.hasLabel ? hyperbola.label.plaintext : false,
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

function abort(cb) {
  cb(points);
  points = [];
}

export default {
  onHandler,
  getConfig,
  cleanPoints,
  parseConfig,
  abort
};
