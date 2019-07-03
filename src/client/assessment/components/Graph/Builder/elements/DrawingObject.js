import { CONSTANT } from "../config";
import {
  Point,
  Circle,
  Ellipse,
  Exponent,
  Hyperbola,
  Line,
  Logarithm,
  Parabola,
  Polygon,
  Polynom,
  Secant,
  Sin,
  Tangent,
  FroalaEditorInput
} from ".";

function onHandler(board, event) {
  const {
    drawingObject,
    parameters: {
      pointParameters: { snapSizeX, snapSizeY }
    }
  } = board;

  if (!drawingObject) {
    return;
  }

  const coords = board.getCoords(event);
  const deltaX = +snapSizeX;
  const deltaY = +snapSizeY;
  let newElement = null;

  if (drawingObject.type === CONSTANT.TOOLS.POINT) {
    newElement = Point.onHandler(board, event, drawingObject.id);
  } else {
    const points = [];
    const offsets = [[0, 0], [1, 1], [2, 0]];

    drawingObject.pointLabels.forEach((label, i) => {
      if (i > 2 && (drawingObject.type === CONSTANT.TOOLS.ELLIPSE || drawingObject.type === CONSTANT.TOOLS.HYPERBOLA)) {
        return;
      }

      let x;
      let y;
      if (i < 3) {
        x = coords.usrCoords[1] + offsets[i][0] * deltaX;
        y = coords.usrCoords[2] + offsets[i][1] * deltaY;
      } else {
        x = coords.usrCoords[1] + i * deltaX;
        y = coords.usrCoords[2] - (i - 2) * deltaY;
      }
      const point = Point.create(board, [x, y]);
      FroalaEditorInput(point, this).setLabel(label, true);
      points.push(point);
    });

    switch (drawingObject.type) {
      case CONSTANT.TOOLS.LINE:
      case CONSTANT.TOOLS.RAY:
      case CONSTANT.TOOLS.SEGMENT:
      case CONSTANT.TOOLS.VECTOR:
        newElement = Line.create(board, points, drawingObject.type, drawingObject.id);
        break;
      case CONSTANT.TOOLS.CIRCLE:
        newElement = Circle.create(board, points, drawingObject.id);
        break;
      case CONSTANT.TOOLS.SIN:
        newElement = Sin.create(board, points, drawingObject.id);
        break;
      case CONSTANT.TOOLS.TANGENT:
        newElement = Tangent.create(board, points, drawingObject.id);
        break;
      case CONSTANT.TOOLS.SECANT:
        newElement = Secant.create(board, points, drawingObject.id);
        break;
      case CONSTANT.TOOLS.PARABOLA:
        newElement = Parabola.create(board, points, drawingObject.id);
        break;
      case CONSTANT.TOOLS.ELLIPSE:
        newElement = Ellipse.create(board, points, drawingObject.id);
        break;
      case CONSTANT.TOOLS.EXPONENT:
        newElement = Exponent.create(board, points, drawingObject.id);
        break;
      case CONSTANT.TOOLS.LOGARITHM:
        newElement = Logarithm.create(board, points, drawingObject.id);
        break;
      case CONSTANT.TOOLS.HYPERBOLA:
        newElement = Hyperbola.create(board, points, drawingObject.id);
        break;
      case CONSTANT.TOOLS.POLYGON:
        newElement = Polygon.create(board, points, drawingObject.id);
        break;
      case CONSTANT.TOOLS.POLYNOM:
        newElement = Polynom.create(board, points, drawingObject.id);
        break;
      default:
        return;
    }
  }

  FroalaEditorInput(newElement, this).setLabel(drawingObject.label, true);
  return newElement;
}

export default {
  onHandler
};
