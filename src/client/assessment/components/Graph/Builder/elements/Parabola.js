import JXG from "jsxgraph";
import { Point } from ".";
import { CONSTANT, Colors } from "../config";
import { handleSnap } from "../utils";
import { getLabelParameters } from "../settings";

const jxgType = 97;

export const defaultConfig = {
  type: CONSTANT.TOOLS.PARABOLA,
  fixed: false
};

let tempToolPoints = [];

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

function renderElement(board, points, params) {
  const coords = getBuildElementsCoords(points);
  const dirPoint1 = board.$board.create("point", coords.dirPoint1, { visible: false });
  const dirPoint2 = board.$board.create("point", coords.dirPoint2, { visible: false });
  const directrix = board.$board.create("line", [dirPoint1, dirPoint2], { visible: false });
  const focus = board.$board.create("point", coords.focus, { visible: false });
  const newLine = board.$board.create("parabola", [focus, directrix], params);

  function updateCoords() {
    const newCoords = getBuildElementsCoords(points);
    dirPoint1.setPositionDirectly(JXG.COORDS_BY_USER, newCoords.dirPoint1);
    dirPoint2.setPositionDirectly(JXG.COORDS_BY_USER, newCoords.dirPoint2);
    focus.setPositionDirectly(JXG.COORDS_BY_USER, newCoords.focus);
  }

  points[0].on("drag", updateCoords);
  points[1].on("drag", updateCoords);

  newLine.type = jxgType;
  handleSnap(newLine, points);

  if (newLine) {
    newLine.addParents(...points, focus, dirPoint1, dirPoint2);
    newLine.ancestors = {
      [points[0].id]: points[0],
      [points[1].id]: points[1]
    };
    return newLine;
  }
}

function onHandler() {
  return (board, event) => {
    const newPoint = Point.onHandler(board, event);
    if (newPoint) {
      tempToolPoints.push(newPoint);
    }
    if (tempToolPoints.length === 2) {
      const params = {
        ...defaultConfig,
        ...Colors.default[CONSTANT.TOOLS.PARABOLA],
        label: getLabelParameters(jxgType)
      };
      const newLine = renderElement(board, tempToolPoints, params);
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
    points: Object.keys(parabola.ancestors)
      .sort()
      .map(n => Point.getConfig(parabola.ancestors[n]))
  };
}

function parseConfig() {
  return {
    ...defaultConfig,
    fillColor: "transparent",
    label: getLabelParameters(jxgType)
  };
}

function getPoints() {
  return tempToolPoints;
}

export default {
  onHandler,
  getConfig,
  clean,
  parseConfig,
  getPoints,
  renderElement
};
