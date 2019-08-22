import JXG from "jsxgraph";
import { Point } from ".";
import segmentConfig from "./Segment";
import { CONSTANT, Colors } from "../config";
import { getLabelParameters } from "../settings";
import { handleSnap } from "../utils";

export const defaultConfig = {
  hasInnerPoints: true
};

const bordersDefaultConfig = {
  strokeWidth: 2,
  highlightStrokeWidth: 2
};

function isStart(startPointCoords, testPointCoords) {
  return startPointCoords[1] === testPointCoords[1] && startPointCoords[2] === testPointCoords[2];
}

let points = [];
let lines = [];

function create(board, polygonPoints, id = null) {
  const attrs = {
    ...defaultConfig,
    ...Colors.default[CONSTANT.TOOLS.POLYGON],
    label: getLabelParameters(JXG.OBJECT_TYPE_POLYGON),
    id
  };
  attrs.borders = {
    ...bordersDefaultConfig,
    ...attrs.borders
  };
  const newPolygon = board.$board.create("polygon", polygonPoints, attrs);
  newPolygon.labelIsVisible = true;
  handleSnap(newPolygon, Object.values(newPolygon.ancestors), board);
  newPolygon.borders.forEach(border => {
    border.on("up", () => {
      if (border.dragged) {
        border.dragged = false;
        board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
      }
    });
    border.on("drag", e => {
      if (e.movementX === 0 && e.movementY === 0) {
        return;
      }
      border.dragged = true;
      board.dragged = true;
    });
  });

  board.handleStackedElementsMouseEvents(newPolygon);

  return newPolygon;
}

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    newPoint.isTemp = true;
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
        points.forEach(point => {
          point.isTemp = false;
        });
        const newPolygon = create(board, points);
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
    labelIsVisible: polygon.labelIsVisible,
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
  const attrs = {
    highlightFillOpacity: 0.3,
    ...defaultConfig,
    ...Colors.default[CONSTANT.TOOLS.POLYGON],
    label: getLabelParameters(JXG.OBJECT_TYPE_POLYGON)
  };
  attrs.borders = {
    ...bordersDefaultConfig,
    ...attrs.borders
  };
  return attrs;
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
  getPoints,
  create
};
