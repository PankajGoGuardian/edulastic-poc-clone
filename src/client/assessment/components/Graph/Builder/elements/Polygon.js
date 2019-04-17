import { Point } from ".";
import segmentConfig from "./Segment";
import { CONSTANT, Colors } from "../config";
import { getLabelParameters } from "../settings";

export const defaultConfig = {
  hasInnerPoints: true
};

function isStart(startPointCoords, testPointCoords) {
  return startPointCoords[1] === testPointCoords[1] && startPointCoords[2] === testPointCoords[2];
}

let points = [];
let lines = [];

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    if (!points.length) {
      newPoint.setAttribute(Colors.yellow[CONSTANT.TOOLS.POINT]);
      points.push(newPoint);
      return;
    }

    if (points.length >= 3) {
      // wait 3 points
      // handle closing polygon
      if (isStart(points[0].coords.usrCoords, newPoint.coords.usrCoords)) {
        board.$board.removeObject(newPoint);
        lines.map(board.$board.removeObject.bind(board.$board));
        points[0].setAttribute(Colors.default[CONSTANT.TOOLS.POINT]);
        const newPolygon = board.$board.create("polygon", points, {
          ...defaultConfig,
          ...Colors.default[CONSTANT.TOOLS.POLYGON],
          label: getLabelParameters(window.JXG.OBJECT_TYPE_POLYGON)
        });
        points = [];
        lines = [];
        return newPolygon;
      }
    }
    if (points.length > 0) {
      lines.push(
        board.$board.create("line", [points[points.length - 1], newPoint], {
          ...segmentConfig,
          ...Colors.default[CONSTANT.TOOLS.LINE]
        })
      );
    }
    points.push(newPoint);
  };
}

function clean(board) {
  const result = points.length > 0;
  points.forEach(point => board.$board.removeObject(point));
  points = [];
  lines = [];
  return result;
}

function getConfig(polygon) {
  return {
    _type: polygon.type,
    type: CONSTANT.TOOLS.POLYGON,
    id: polygon.id,
    label: polygon.labelHTML || false,
    points: Object.keys(polygon.ancestors)
      .sort()
      .map(n => Point.getConfig(polygon.ancestors[n]))
  };
}

function flatConfigPoints(pointsConfig) {
  return pointsConfig.reduce((acc, p, i) => {
    acc[i] = p.id;
    return acc;
  }, {});
}

function parseConfig() {
  return {
    highlightFillColor: "#ccc",
    highlightStrokeColor: "#ccc",
    highlightFillOpacity: 0.3,
    fillColor: "#ccc",
    ...defaultConfig,
    label: getLabelParameters(window.JXG.OBJECT_TYPE_POLYGON)
  };
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
