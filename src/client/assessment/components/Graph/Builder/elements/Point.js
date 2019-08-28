import JXG from "jsxgraph";
import { CONSTANT, Colors } from "../config";
import { defaultPointParameters, getLabelParameters } from "../settings";
import EditButton from "./EditButton";
import { setLabel, nameGen, colorGenerator } from "../utils";

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

function create(board, usrCoords, id = null) {
  const baseColor = colorGenerator(board.elements.length);
  const point = board.$board.create("point", usrCoords, {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    ...Colors.default[CONSTANT.TOOLS.POINT],
    ...chooseColor(board.coloredElements, baseColor, false, true, null),
    label: getLabelParameters(JXG.OBJECT_TYPE_POINT),
    id
  });

  point.pointIsVisible = true;
  point.labelIsVisible = true;
  point.baseColor = baseColor;

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
    EditButton.cleanButton(board, point);
  });

  point.on("mouseover", event => board.handleElementMouseOver(point, event));
  point.on("mouseout", () => board.handleElementMouseOut(point));

  if (board.drawingObject === null) {
    setLabel(point, nameGen(board.elements.concat(board.getTempPoints())));
  }

  return point;
}

function chooseColor(coloredElements, color, bgShapes, pointIsVisible, priorityColor = null) {
  let elementColor;

  if (bgShapes && !pointIsVisible) {
    elementColor = "transparent";
  } else if (priorityColor && priorityColor.length > 0 && !bgShapes) {
    elementColor = priorityColor;
  } else if (coloredElements && !bgShapes) {
    elementColor = color && color.length > 0 ? color : "#00b2ff";
  } else if (!priorityColor && pointIsVisible && !coloredElements && !bgShapes) {
    elementColor = "#00b2ff";
  } else if (bgShapes && pointIsVisible) {
    elementColor = "#ccc";
  }

  return {
    highlightFillColor: elementColor,
    highlightStrokeColor: elementColor,
    fillColor: elementColor,
    strokeColor: elementColor
  };
}

function onHandler(board, event, id = null) {
  const coords = board.getCoords(event);
  return create(board, coords.usrCoords, id);
}

function getConfig(point) {
  return {
    _type: point.type,
    type: CONSTANT.TOOLS.POINT,
    x: point.coords.usrCoords[1],
    y: point.coords.usrCoords[2],
    id: point.id,
    label: point.labelHTML || false,
    labelIsVisible: point.labelIsVisible,
    pointIsVisible: point.pointIsVisible,
    baseColor: point.baseColor || "#00b2ff"
  };
}

function parseConfig(config, pointParameters) {
  return [
    "point",
    [config.x, config.y],
    {
      ...Colors.default[CONSTANT.TOOLS.POINT],
      ...(pointParameters || defaultPointParameters()),
      visible: config.pointIsVisible,
      label: {
        ...getLabelParameters(JXG.OBJECT_TYPE_POINT),
        visible: config.labelIsVisible
      },
      baseColor: config.baseColor
    }
  ];
}

export default {
  onHandler,
  getConfig,
  parseConfig,
  roundCoords,
  findPoint,
  create,
  chooseColor
};
