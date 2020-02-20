import JXG from "jsxgraph";
import { Point, Line } from ".";
import { CONSTANT } from "../config";
import { getLabelParameters } from "../settings";
import { handleSnap, colorGenerator, setLabel } from "../utils";

const defaultConfig = {
  fillOpacity: 0.3,
  highlightFillOpacity: 0.3,
  hasInnerPoints: true
};

const bordersDefaultConfig = {
  strokeWidth: 2,
  highlightStrokeWidth: 2
};

function getColorParams(color) {
  return {
    fillColor: color,
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: color
  };
}

function isStart(startPointCoords, testPointCoords) {
  return startPointCoords[1] === testPointCoords[1] && startPointCoords[2] === testPointCoords[2];
}

let points = [];
let lines = [];

function create(board, object, polygonPoints, settings = {}) {
  const { labelIsVisible = true, fixed = false } = settings;

  const { id = null, label, baseColor, priorityColor, dashed = false } = object;

  const newPolygon = board.$board.create("polygon", polygonPoints, {
    ...defaultConfig,
    ...getColorParams(priorityColor || board.priorityColor || baseColor),
    label: {
      ...getLabelParameters(JXG.OBJECT_TYPE_POLYGON),
      visible: labelIsVisible
    },
    borders: {
      ...bordersDefaultConfig,
      ...getColorParams(priorityColor || board.priorityColor || baseColor),
      dash: dashed ? 2 : 0
    },
    fixed,
    id
  });
  newPolygon.labelIsVisible = object.labelIsVisible;
  newPolygon.baseColor = object.baseColor;
  newPolygon.dashed = object.dashed;

  if (!fixed) {
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
  }

  if (labelIsVisible) {
    setLabel(newPolygon, label);
  }

  return newPolygon;
}

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    newPoint.isTemp = true;
    if (!points.length) {
      newPoint.setAttribute(Point.getColorParams("#000"));
      points.push(newPoint);
      return;
    }

    for (let i = 1; i < points.length; i++) {
      if (isStart(points[i].coords.usrCoords, newPoint.coords.usrCoords)) {
        board.$board.removeObject(newPoint);
        return;
      }
    }

    if (points.length >= 3) {
      // wait 3 points
      // handle closing polygon
      if (isStart(points[0].coords.usrCoords, newPoint.coords.usrCoords)) {
        board.$board.removeObject(newPoint);
        lines.map(board.$board.removeObject.bind(board.$board));

        const baseColor = colorGenerator(board.elements.length);
        points[0].setAttribute(Point.getColorParams(board.priorityColor || baseColor));
        points.forEach(point => {
          point.isTemp = false;
        });
        const object = {
          label: false,
          labelIsVisible: true,
          baseColor
        };
        const newPolygon = create(board, object, points);
        points = [];
        lines = [];
        return newPolygon;
      }
    }
    if (points.length > 0) {
      lines.push(
        Line.create(
          board,
          {
            label: false,
            labelIsVisible: true,
            baseColor: colorGenerator(board.elements.length)
          },
          [points[points.length - 1], newPoint],
          CONSTANT.TOOLS.SEGMENT,
          {
            fixed: true
          }
        )
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
    baseColor: polygon.baseColor,
    dashed: polygon.dashed,
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

function getTempPoints() {
  return points;
}

export default {
  onHandler,
  getConfig,
  clean,
  flatConfigPoints,
  getTempPoints,
  create
};
