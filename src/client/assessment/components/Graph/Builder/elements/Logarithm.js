import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { handleSnap } from "../utils";
import { getLabelParameters } from "../settings";

const jxgType = 94;

export const defaultConfig = {
  type: CONSTANT.TOOLS.LOGARITHM,
  fixed: false
};

export const getLogarithmLabelParameters = () => ({
  offset: [0, 0],
  position: "top",
  anchorX: "middle",
  anchorY: "middle",
  cssClass: "myLabel",
  highlightCssClass: "myLabel"
});

const makeCallback = (p1, p2) => x => {
  const a = p1.Y();
  const b = p2.Y() - p1.Y();
  const c = p2.X() - p1.X() >= 0 ? p2.X() - p1.X() : 1 / (p1.X() - p2.X());
  const d = -p1.X();
  return a + (b / c) * Math.log(x + d);
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
        ...Colors.default[CONSTANT.TOOLS.LOGARITHM],
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

function clean(board) {
  const result = points.length > 0;
  points.forEach(point => board.$board.removeObject(point));
  points = [];
  return result;
}
function getConfig(logarithm) {
  return {
    _type: logarithm.type,
    type: CONSTANT.TOOLS.LOGARITHM,
    id: logarithm.id,
    label: logarithm.labelHTML || false,
    points: Object.keys(logarithm.ancestors)
      .sort()
      .map(n => Point.getConfig(logarithm.ancestors[n]))
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

function getPoints() {
  return points;
}

export default {
  onHandler,
  getConfig,
  parseConfig,
  clean,
  getPoints
};
