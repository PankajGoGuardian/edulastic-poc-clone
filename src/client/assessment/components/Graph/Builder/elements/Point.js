import JXG from "jsxgraph";
import { CONSTANT } from "../config";
import { defaultPointParameters, getLabelParameters } from "../settings";
import EditButton from "./EditButton";
import { setLabel, nameGen, colorGenerator } from "../utils";
import { Area } from ".";

function getColorParams(color) {
  return {
    fillColor: color,
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: color
  };
}

function create(board, object, settings = {}) {
  const {
    labelIsVisible = true,
    pointIsVisible = true,
    fixed = false,
    snapToGrid = true,
    latex = false,
    result = false
  } = settings;

  const { x, y, id = null, label, baseColor, priorityColor } = object;

  const hideColor = pointIsVisible ? null : "transparent";

  const point = board.$board.create("point", [x, y], {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    ...getColorParams(hideColor || priorityColor || board.priorityColor || baseColor),
    label: {
      ...getLabelParameters(JXG.OBJECT_TYPE_POINT),
      visible: labelIsVisible
    },
    fixed,
    snapToGrid,
    id
  });

  point.pointIsVisible = object.pointIsVisible;
  point.labelIsVisible = object.labelIsVisible;
  point.baseColor = baseColor;

  if (!fixed) {
    point.on("up", () => {
      if (point.dragged) {
        point.dragged = false;
        if (!point.isTemp) {
          Area.updateShadingsForAreaPoints(board, board.elements);
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
  }

  if (labelIsVisible) {
    setLabel(point, label);
  }

  if (latex != false && result != false) {
    point.type = 98;
    point.latex = latex;
    point.apiLatex = result;
  }

  return point;
}

function onHandler(board, event, id = null) {
  const coords = board.getCoords(event).usrCoords;
  const elements = board.elements.concat(board.getTempPoints(), board.bgElements);
  const object = {
    x: coords[1],
    y: coords[2],
    label: nameGen(elements),
    labelIsVisible: true,
    pointIsVisible: true,
    baseColor: colorGenerator(board.elements.length),
    id
  };
  return create(board, object);
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
    baseColor: point.baseColor
  };
}

export default {
  onHandler,
  getConfig,
  create,
  getColorParams
};
