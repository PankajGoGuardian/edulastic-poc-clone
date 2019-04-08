import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { handleSnap } from "../utils";
import { getLabelParameters } from "../settings";

const jxgType = 96;

export const defaultConfig = {
  type: CONSTANT.TOOLS.SIN,
  fixed: false
};

const makeCallback = (p1, p2) => x => {
  const a = p1.Y();
  const b = p2.Y() - p1.Y();
  const c = 1 / ((p2.X() - p1.X()) / (Math.PI / 2));
  const d = 0 - (p1.X() * Math.PI) / (2 * (p2.X() - p1.X()));
  return a + b * Math.sin(x * c + d);
};

let points = [];

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    if (newPoint) {
      points.push(newPoint);
    }
    if (points.length === 2) {
      const newLine = board.$board.create("functiongraph", [makeCallback(...points)], {
        ...defaultConfig,
        ...Colors.default[CONSTANT.TOOLS.SIN],
        label: getLabelParameters(jxgType)
      });
      newLine.type = jxgType;
      handleSnap(newLine, points);

      if (newLine) {
        newLine.addParents(points);
        newLine.ancestors = {
          [points[0].id]: points[0],
          [points[1].id]: points[1]
        };
        points = [];
        return newLine;
      }
    }
  };
}

function getConfig(sine) {
  return {
    _type: sine.type,
    type: CONSTANT.TOOLS.SIN,
    id: sine.id,
    label: sine.hasLabel ? sine.label.plaintext : false,
    points: Object.keys(sine.ancestors)
      .sort()
      .map(n => Point.getConfig(sine.ancestors[n]))
  };
}

function parseConfig(pointsConfig) {
  return [
    "functiongraph",
    [pointsArgument => makeCallback(...pointsArgument), pointsConfig],
    {
      ...defaultConfig,
      fillColor: "transparent",
      label: getLabelParameters(jxgType)
    }
  ];
}

function abort(cb) {
  cb(points);
  points = [];
}

export default {
  onHandler,
  getConfig,
  parseConfig,
  abort
};
