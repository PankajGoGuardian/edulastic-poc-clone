import JXG from "jsxgraph";
import { Point, Equation } from ".";
import { getLineTypeByProp, getPropsByLineType, handleSnap, colorGenerator, setLabel } from "../utils";
import { getLabelParameters } from "../settings";

export const defaultConfig = {
  firstarrow: true,
  lastarrow: true,
  strokewidth: 2,
  highlightstrokewidth: 2
};

let points = [];

function getColorParams(color) {
  return {
    fillColor: color,
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: color
  };
}

function create(board, object, linePoints, type, settings = {}) {
  const { labelIsVisible = true, fixed = false, latex = false, result = false, pointsLabel = false } = settings;

  const { id = null, label, baseColor, priorityColor, dashed = false } = object;

  const newLine = board.$board.create("line", linePoints, {
    ...getPropsByLineType(type),
    ...getColorParams(priorityColor || board.priorityColor || baseColor),
    label: {
      ...getLabelParameters(JXG.OBJECT_TYPE_LINE),
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
    newLine.type = Equation.jxgType;
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

function onLineHandler(type) {
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
      const newLine = create(board, object, points, type);
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

function getConfig(line) {
  return {
    _type: line.type,
    type: line.type === Equation.jxgType ? "line" : getLineTypeByProp(line.getAttributes()),
    id: line.id,
    label: line.labelHTML || false,
    labelIsVisible: line.labelIsVisible,
    baseColor: line.baseColor,
    dashed: line.dashed,
    points: Object.keys(line.ancestors)
      .sort()
      .map(n => Point.getConfig(line.ancestors[n]))
  };
}

function getTempPoints() {
  return points;
}

export default {
  onHandler(type) {
    return onLineHandler(type);
  },
  getConfig,
  clean,
  getTempPoints,
  create,
  getColorParams
};
