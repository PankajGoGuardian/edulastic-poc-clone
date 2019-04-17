import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { handleSnap } from "../utils";
import { getLabelParameters } from "../settings";

const jxgType = 95;

export const defaultConfig = {
  hasInnerPoints: true,
  fixed: false
};

function isStart(startPointCoords, testPointCoords) {
  return startPointCoords[1] === testPointCoords[1] && startPointCoords[2] === testPointCoords[2];
}

const makeCallback = (...points) => x => {
  let result = 0;
  for (let i = 0; i < points.length; i++) {
    let li = 1;
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        li *= (x - points[j].X()) / (points[i].X() - points[j].X());
      }
    }
    result += points[i].Y() * li;
  }

  return result;
};

let points = [];

function flatConfigPoints(pointsConfig) {
  return pointsConfig.reduce((acc, p, i) => {
    acc[i] = p;
    return acc;
  }, {});
}

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    if (!points.length) {
      newPoint.setAttribute(Colors.yellow[CONSTANT.TOOLS.POINT]);
      points.push(newPoint);
      return;
    }

    if (isStart(points[0].coords.usrCoords, newPoint.coords.usrCoords)) {
      board.$board.removeObject(newPoint);
      points[0].setAttribute(Colors.default[CONSTANT.TOOLS.POINT]);
      const newPolynom = board.$board.create("functiongraph", [makeCallback(...points)], {
        ...defaultConfig,
        ...Colors.default[CONSTANT.TOOLS.POLYNOM],
        label: getLabelParameters(jxgType)
      });
      newPolynom.type = jxgType;
      handleSnap(newPolynom, points);

      if (newPolynom) {
        newPolynom.addParents(points);
        newPolynom.ancestors = flatConfigPoints(points);
        points = [];
        return newPolynom;
      }
    }

    points.push(newPoint);
  };
}

function clean(board) {
  const result = points.length > 0;
  points.forEach(point => board.$board.removeObject(point));
  points = [];
  return result;
}

function getConfig(polynom) {
  return {
    _type: polynom.type,
    type: CONSTANT.TOOLS.POLYNOM,
    id: polynom.id,
    label: polynom.labelHTML || false,
    points: Object.keys(polynom.ancestors)
      .sort()
      .map(n => Point.getConfig(polynom.ancestors[n]))
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
  flatConfigPoints,
  getPoints
};
