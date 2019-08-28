import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { handleSnap, colorGenerator } from "../utils";
import { getLabelParameters } from "../settings";

const jxgType = 92;

export const defaultConfig = {
  type: CONSTANT.TOOLS.SECANT,
  fixed: false,
  strokeWidth: 2,
  highlightStrokeWidth: 2
};

const makeCallback = (p1, p2) => x => {
  const a = p1.Y();
  const b = p2.Y() - p1.Y();
  const c = 1 / ((p2.X() - p1.X()) / (Math.PI / 2));
  const d = 0 - (p1.X() * Math.PI) / (2 * (p2.X() - p1.X()));
  return a + b / Math.cos(x * c + d);
};

let points = [];

function create(board, secantPoints, id = null) {
  const baseColor = colorGenerator(board.elements.length);
  const newLine = board.$board.create("functiongraph", [makeCallback(...secantPoints)], {
    ...defaultConfig,
    ...Colors.default[CONSTANT.TOOLS.SECANT],
    ...chooseColor(board.coloredElements, baseColor, null),
    label: getLabelParameters(jxgType),
    id
  });
  newLine.labelIsVisible = true;
  newLine.baseColor = baseColor;
  newLine.type = jxgType;
  newLine.addParents(secantPoints);
  newLine.ancestors = {
    [secantPoints[0].id]: secantPoints[0],
    [secantPoints[1].id]: secantPoints[1]
  };
  handleSnap(newLine, Object.values(newLine.ancestors), board);
  board.handleStackedElementsMouseEvents(newLine);

  return newLine;
}

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    if (newPoint) {
      points.push(newPoint);
    }
    if (points.length === 2) {
      const newLine = create(board, points);
      points = [];
      return newLine;
    }
  };
}

function clean(board) {
  const result = points.length > 0;
  points.forEach(point => board.$board.removeObject(point));
  points = [];
  return result;
}

function getConfig(secant) {
  return {
    _type: secant.type,
    type: CONSTANT.TOOLS.SECANT,
    id: secant.id,
    label: secant.labelHTML || false,
    labelIsVisible: secant.labelIsVisible,
    baseColor: secant.baseColor,
    points: Object.keys(secant.ancestors)
      .sort()
      .map(n => Point.getConfig(secant.ancestors[n]))
  };
}

function parseConfig(pointsConfig) {
  return [
    "functiongraph",
    [pointsArgument => makeCallback(...pointsArgument), pointsConfig],
    {
      ...defaultConfig,
      ...Colors.default[CONSTANT.TOOLS.SECANT],
      label: getLabelParameters(jxgType)
    }
  ];
}

function chooseColor(coloredElements, color, bgShapes, priorityColor = null) {
  let elementColor;

  if (priorityColor && priorityColor.length > 0) {
    elementColor = priorityColor;
  } else if (!priorityColor && coloredElements && !bgShapes) {
    elementColor = color && color.length > 0 ? color : "#00b2ff";
  } else if (!priorityColor && !coloredElements && !bgShapes) {
    elementColor = "#00b2ff";
  } else if (bgShapes) {
    elementColor = "#ccc";
  }

  return {
    strokeColor: elementColor,
    highlightStrokeColor: elementColor
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
  getPoints,
  create,
  chooseColor
};
