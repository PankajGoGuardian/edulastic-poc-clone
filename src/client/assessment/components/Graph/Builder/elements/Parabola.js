import JXG from "jsxgraph";
import { Point } from ".";
import { CONSTANT } from "../config";
import { handleSnap, colorGenerator, setLabel } from "../utils";
import { getLabelParameters } from "../settings";

const jxgType = 97;

const defaultConfig = {
  fixed: false,
  strokeWidth: 2,
  highlightStrokeWidth: 2
};

let tempToolPoints = [];

function getColorParams(color) {
  return {
    fillColor: "transparent",
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: "transparent"
  };
}

const getBuildElementsCoords = points => {
  const coords = {
    dirPoint1: [points[0].X(), points[0].Y()],
    dirPoint2: [points[0].X(), points[0].Y()],
    focus: [points[0].X(), points[0].Y()]
  };

  const dY = points[1].Y() - points[0].Y();
  const dX = points[1].X() - points[0].X();

  if (dY * dX > 0) {
    // vertical parabola
    const p = dX ** 2 / (2 * dY);
    coords.dirPoint1 = [points[0].X() - 1, points[0].Y() - p / 2];
    coords.dirPoint2 = [points[0].X() + 1, points[0].Y() - p / 2];
    coords.focus = [points[0].X(), points[0].Y() + p / 2];
  } else if (dY * dX < 0) {
    // horizontal parabola
    const p = dY ** 2 / (2 * dX);
    coords.dirPoint1 = [points[0].X() - p / 2, points[0].Y() - 1];
    coords.dirPoint2 = [points[0].X() - p / 2, points[0].Y() + 1];
    coords.focus = [points[0].X() + p / 2, points[0].Y()];
  }

  return coords;
};

function create(board, object, parabolaPoints, settings = {}) {
  const { labelIsVisible = true, fixed = false } = settings;

  const { id = null, label, baseColor, priorityColor } = object;

  const params = {
    ...defaultConfig,
    ...getColorParams(priorityColor || board.priorityColor || baseColor),
    label: {
      ...getLabelParameters(jxgType),
      visible: labelIsVisible
    },
    fixed,
    id
  };

  const coords = getBuildElementsCoords(parabolaPoints);
  const dirPoint1 = board.$board.create("point", coords.dirPoint1, { visible: false });
  const dirPoint2 = board.$board.create("point", coords.dirPoint2, { visible: false });
  const directrix = board.$board.create("line", [dirPoint1, dirPoint2], { visible: false });
  const focus = board.$board.create("point", coords.focus, { visible: false });
  const newLine = board.$board.create("parabola", [focus, directrix], params);

  function updateCoords() {
    const newCoords = getBuildElementsCoords(parabolaPoints);
    dirPoint1.setPositionDirectly(JXG.COORDS_BY_USER, newCoords.dirPoint1);
    dirPoint2.setPositionDirectly(JXG.COORDS_BY_USER, newCoords.dirPoint2);
    focus.setPositionDirectly(JXG.COORDS_BY_USER, newCoords.focus);
  }

  newLine.type = jxgType;
  newLine.labelIsVisible = object.labelIsVisible;
  newLine.baseColor = object.baseColor;

  newLine.addParents(...parabolaPoints, focus, dirPoint1, dirPoint2);
  newLine.ancestors = {
    [parabolaPoints[0].id]: parabolaPoints[0],
    [parabolaPoints[1].id]: parabolaPoints[1]
  };

  if (!fixed) {
    handleSnap(newLine, Object.values(newLine.ancestors), board, updateCoords);
    parabolaPoints[0].on("drag", updateCoords);
    parabolaPoints[1].on("drag", updateCoords);
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
    tempToolPoints.push(newPoint);
    if (tempToolPoints.length === 2) {
      tempToolPoints.forEach(point => {
        point.isTemp = false;
      });
      const object = {
        label: false,
        labelIsVisible: true,
        baseColor: colorGenerator(board.elements.length)
      };
      const newLine = create(board, object, tempToolPoints);
      tempToolPoints = [];
      return newLine;
    }
  };
}

function clean(board) {
  const result = tempToolPoints.length > 0;
  tempToolPoints.forEach(point => board.$board.removeObject(point));
  tempToolPoints = [];
  return result;
}

function getConfig(parabola) {
  return {
    _type: parabola.type,
    type: CONSTANT.TOOLS.PARABOLA,
    id: parabola.id,
    label: parabola.labelHTML || false,
    labelIsVisible: parabola.labelIsVisible,
    baseColor: parabola.baseColor,
    points: Object.keys(parabola.ancestors)
      .sort()
      .map(n => Point.getConfig(parabola.ancestors[n]))
  };
}

function getTempPoints() {
  return tempToolPoints;
}

export default {
  jxgType,
  onHandler,
  getConfig,
  clean,
  getTempPoints,
  create,
  getColorParams
};
