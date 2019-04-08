import { Point } from ".";
import { getLineTypeByProp, getPropsByLineType } from "../utils";
import { Colors, CONSTANT } from "../config";
import { getLabelParameters } from "../settings";

export const defaultConfig = {
  firstarrow: true,
  lastarrow: true
};

let points = [];

function onLineHandler(type) {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    if (newPoint) {
      points.push(newPoint);
    }
    if (points.length === 2) {
      const newLine = board.$board.create("line", points, {
        ...getPropsByLineType(type),
        ...Colors.default[CONSTANT.TOOLS.LINE],
        label: getLabelParameters(window.JXG.OBJECT_TYPE_LINE)
      });
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

function getConfig(line) {
  return {
    _type: line.type,
    type: getLineTypeByProp(line.getAttributes()),
    id: line.id,
    label: line.hasLabel ? line.label.plaintext : false,
    points: Object.keys(line.ancestors)
      .sort()
      .map(n => Point.getConfig(line.ancestors[n]))
  };
}

function parseConfig(type) {
  return {
    ...getPropsByLineType(type),
    label: getLabelParameters(window.JXG.OBJECT_TYPE_LINE)
  };
}

function abort(cb) {
  cb(points);
  points = [];
}

export default {
  onHandler(type) {
    return onLineHandler(type);
  },
  getConfig,
  parseConfig,
  cleanPoints,
  abort
};
