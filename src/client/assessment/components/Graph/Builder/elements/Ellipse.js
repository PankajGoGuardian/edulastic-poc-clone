import JXG from "jsxgraph";
import { Point } from ".";
import { CONSTANT } from "../config";
import { handleSnap, colorGenerator, setLabel } from "../utils";
import { getLabelParameters } from "../settings";

const defaultConfig = {
  fixed: false,
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

function create(board, object, ellipsePoints, settings = {}) {
  const { labelIsVisible = true, fixed = false, latex = false, result = false, pointsLabel = false } = settings;

  const { id = null, label, baseColor, priorityColor, dashed = false } = object;

  const newLine = board.$board.create("ellipse", ellipsePoints, {
    ...defaultConfig,
    ...getColorParams(priorityColor || board.priorityColor || baseColor),
    label: {
      ...getLabelParameters(JXG.OBJECT_TYPE_CONIC),
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
    if (points.length === 3) {
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

function getConfig(ellipse) {
  return {
    _type: ellipse.type,
    type: CONSTANT.TOOLS.ELLIPSE,
    id: ellipse.id,
    label: ellipse.labelHTML || false,
    labelIsVisible: ellipse.labelIsVisible,
    baseColor: ellipse.baseColor,
    dashed: ellipse.dashed,
    points: Object.values(ellipse.ancestors)
      .filter(a => a.type === JXG.OBJECT_TYPE_POINT)
      .sort((a, b) => a.id > b.id)
      .map(point => Point.getConfig(point))
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
