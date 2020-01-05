import JXG from "jsxgraph";
import { Point } from ".";
import { CONSTANT } from "../config";
import { handleSnap, colorGenerator, setLabel } from "../utils";
import { getLabelParameters } from "../settings";

const jxgType = 90;

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

function create(board, object, hypPoints, settings = {}) {
  const { labelIsVisible = true, fixed = false, latex = false, result = false, pointsLabel = false } = settings;

  const { id = null, label, baseColor, priorityColor, dashed = false } = object;

  const newLine = board.$board.create("hyperbola", hypPoints, {
    ...defaultConfig,
    ...getColorParams(priorityColor || board.priorityColor || baseColor),
    label: {
      ...getLabelParameters(jxgType),
      visible: labelIsVisible
    },
    dash: dashed ? 2 : 0,
    fixed,
    id
  });
  newLine.type = jxgType;
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

function getConfig(hyperbola) {
  return {
    _type: hyperbola.type,
    type: CONSTANT.TOOLS.HYPERBOLA,
    id: hyperbola.id,
    label: hyperbola.labelHTML || false,
    labelIsVisible: hyperbola.labelIsVisible,
    baseColor: hyperbola.baseColor,
    dashed: hyperbola.dashed,
    points: Object.values(hyperbola.ancestors)
      .filter(a => a.type === JXG.OBJECT_TYPE_POINT)
      .sort((a, b) => a.id > b.id)
      .map(point => Point.getConfig(point))
  };
}

function getTempPoints() {
  return points;
}

export default {
  jxgType,
  onHandler,
  getConfig,
  clean,
  getTempPoints,
  create
};
