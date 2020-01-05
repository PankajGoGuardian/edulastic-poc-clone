import JXG from "jsxgraph";
import { Point } from ".";
import { CONSTANT } from "../config";
import { getLabelParameters } from "../settings";
import { handleSnap, colorGenerator, setLabel } from "../utils";

const defaultConfig = {
  strokeWidth: 2,
  highlightStrokeWidth: 2
};

let points = [];

function getColorParams(color) {
  return {
    fillColor: "transparent",
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: "transparent"
  };
}

function create(board, object, circlePoints, settings = {}) {
  const { labelIsVisible = true, fixed = false, latex = false, result = false, pointsLabel = false } = settings;

  const { id = null, label, baseColor, priorityColor, dashed = false } = object;

  const newLine = board.$board.create("circle", circlePoints, {
    ...defaultConfig,
    ...getColorParams(priorityColor || board.priorityColor || baseColor),
    label: {
      ...getLabelParameters(JXG.OBJECT_TYPE_CIRCLE),
      visible: labelIsVisible
    },
    dash: dashed ? 2 : 0,
    fixed,
    id
  });
  newLine.labelIsVisible = object.labelIsVisible;
  newLine.baseColor = object.baseColor;
  newLine.dashed = object.dashed;

  if (latex && result) {
    newLine.type = 98;
    newLine.latex = latex;
    newLine.apiLatex = result;
    newLine.pointsLabel = pointsLabel;
  }

  if (!fixed) {
    handleSnap(newLine, Object.values(newLine.ancestors), board);
    board.handleStackedElementsMouseEvents(newLine);
  }

  if (labelIsVisible) {
    setLabel(newLine, label);
  }

  return newLine;
}

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    newPoint.isTemp = true;
    points.push(newPoint);
    if (points.length === 2) {
      points.forEach(point => {
        point.isTemp = false;
      });
      const object = {
        label: false,
        labelIsVisible: true,
        baseColor: colorGenerator(board.elements.length)
      };
      const newLine = create(board, object, points);
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

function getConfig(circle) {
  return {
    _type: circle.type,
    type: CONSTANT.TOOLS.CIRCLE,
    id: circle.id,
    label: circle.labelHTML || false,
    labelIsVisible: circle.labelIsVisible,
    baseColor: circle.baseColor,
    dashed: circle.dashed,
    points: Object.keys(circle.ancestors)
      .sort()
      .map(n => Point.getConfig(circle.ancestors[n]))
  };
}

function getTempPoints() {
  return points;
}

export default {
  onHandler,
  getConfig,
  clean,
  getTempPoints,
  create
};
