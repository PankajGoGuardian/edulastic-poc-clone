import JXG from "jsxgraph";
import { CONSTANT, Colors } from "../config";
import { defaultPointParameters, getLabelParameters } from "../settings";

function roundCoords(coords) {
  return [Math.round(coords[1]), Math.round(coords[2])];
}

export function findPoint(elements, coords) {
  const [x, y] = roundCoords(coords);
  let result = null;
  let found = false;

  if (!elements) {
    return null;
  }

  Object.keys(elements).forEach(key => {
    if (found) {
      return;
    }

    if (JXG.isPoint(elements[key])) {
      if (elements[key].coords.usrCoords[1] === x && elements[key].coords.usrCoords[2] === y) {
        result = elements[key];
        found = true;
      }
    } else if (elements[key].ancestors) {
      const point = findPoint(elements[key].ancestors, coords);
      if (point) {
        result = point;
        found = true;
      }
    }
  });

  return result;
}

function onHandler(board, event) {
  const coords = board.getCoords(event);
  const point = board.$board.create("point", coords.usrCoords, {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    ...Colors.default[CONSTANT.TOOLS.POINT],
    label: getLabelParameters(JXG.OBJECT_TYPE_POINT)
  });

  point.on("up", () => {
    if (point.dragged) {
      point.dragged = false;
      if (!point.isTemp) {
        board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
      }
    }
  });
  point.on("drag", e => {
    if (e.movementX === 0 && e.movementY === 0) {
      return;
    }
    point.dragged = true;
    board.dragged = true;
  });

  return point;
}

function getConfig(point) {
  return {
    _type: point.type,
    type: CONSTANT.TOOLS.POINT,
    x: point.coords.usrCoords[1],
    y: point.coords.usrCoords[2],
    id: point.id,
    label: point.labelHTML || false
  };
}

function parseConfig(config, pointParameters) {
  return [
    "point",
    [config.x, config.y],
    {
      ...(pointParameters || defaultPointParameters()),
      label: getLabelParameters(JXG.OBJECT_TYPE_POINT)
    }
  ];
}

export default {
  onHandler,
  getConfig,
  parseConfig,
  roundCoords,
  findPoint
};
