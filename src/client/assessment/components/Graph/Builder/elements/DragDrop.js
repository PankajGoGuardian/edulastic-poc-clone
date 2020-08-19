import { replaceLatexesWithMathHtml } from "@edulastic/common/src/utils/mathUtils";
import { IconCloseTextFormat, IconCorrectTextFormat } from "@edulastic/icons";

import { clamp } from "lodash";
import { CONSTANT } from "../config";
import { defaultPointParameters } from "../settings";
import { Point } from ".";
import { disableSnapToGrid, enableSnapToGrid } from "../utils";
import { MIN_SNAP_SIZE } from "../config/constants";

const deleteIconPattern =
  '<svg id="{iconId}" class="delete-drag-drop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.728 16.702">' +
  '<g id="{iconId}" transform="translate(-40.782 .5)">' +
  '<path id="{iconId}" d="M48.889.522V0H45.4v.522h-4.12v2.112h11.73V.522z" />' +
  '<path id="{iconId}" d="M57.546 80.756h8.939l.642-12.412H56.9zm5.486-9.511h1.107v6.325h-1.107zm-3.14 0H61v6.325h-1.108z"transform="translate(-14.87 -65.054)"/>' +
  "</g>" +
  "</svg>";

const IconClose = `<svg class="drag-drop-icon drag-drop-icon-incorrect" ${IconCloseTextFormat.substring(5)}`;
const IconCorrect = `<svg class="drag-drop-icon drag-drop-icon-correct" ${IconCorrectTextFormat.substring(5)}`;

const jxgType = 101;

/**
 * this point will show while dragging value over the board
 * and then will get removed after release the value from the board
 */
let pointForDrag = null;

function drawPoint(board, object, settings) {
  const pointParams = board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters();

  const { fixed = false, snapSizeX = pointParams.snapSizeX, snapSizeY = pointParams.snapSizeY } = settings;
  const { x, y, priorityColor } = object;

  const point = board.$board.create("point", [x, y], {
    ...pointParams,
    ...Point.getColorParams(priorityColor || board.priorityColor),
    fixed,
    snapSizeX,
    snapSizeY
  });

  return point;
}

function create(board, object, settings) {
  const { fixed = false } = settings;

  const { id = null, x, y, text, customOptions = {}, dimensions = {} } = object;
  const { width = 110, height = 32 } = dimensions;

  const point = drawPoint(board, object, settings);

  let content = replaceLatexesWithMathHtml(text);

  if (!fixed) {
    const deleteIconId = `drag-drop-delete-${id}`;
    content += deleteIconPattern.replace(/{iconId}/g, deleteIconId);
  }

  let cssClass = "fr-box drag-drop";
  let conentClassName = "drag-drop-content";
  let icon = "";
  if (customOptions.isCorrect) {
    conentClassName += " drag-drop-content-correct";
    cssClass += " correct";
    icon = IconCorrect;
  } else if (customOptions.isCorrect === false) {
    conentClassName += " drag-drop-content-incorrect";
    cssClass += " incorrect";
    icon = IconClose;
  }

  conentClassName = `class="${conentClassName}"`;

  const contentStyle = `style="
    width: ${width}px;
    height: ${height}px;
  "`;

  const triangle = "<div class='drag-drop-content-triangle'></div";

  content = `<div ${contentStyle} ${conentClassName}>${content}${icon}${triangle}</div>`;

  const mark = board.$board.create("text", [x, y, content], {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    anchorX: "left", // this setting cause offset flickering
    anchorY: "bottom",
    cssClass,
    highlightCssClass: cssClass,
    fixed
  });

  // fix offset flickering
  setTimeout(() => {
    mark.rendNode.childNodes[0].style.opacity = 1;
  });

  const newElement = board.$board.create("group", [point, mark], {
    id
  });

  const dragHandler = e => {
    if (e.movementX === 0 && e.movementY === 0) {
      return;
    }
    disableSnapToGrid(point);
    disableSnapToGrid(mark);
    newElement.dragged = true;
    board.dragged = true;
  };

  const upHandler = () => {
    if (newElement.dragged) {
      newElement.dragged = false;
      enableSnapToGrid(board, point);
      enableSnapToGrid(board, mark);
      board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
    }
  };

  if (!fixed) {
    point.on("up", upHandler);
    point.on("drag", dragHandler);
    mark.on("up", upHandler);
    mark.on("drag", dragHandler);
  }

  newElement.type = jxgType;
  newElement.labelHTML = text;
  newElement.dimensions = dimensions;

  return newElement;
}

function movePointForDrag(board, object) {
  if (!pointForDrag) {
    pointForDrag = drawPoint(board, object, {
      snapSizeX: MIN_SNAP_SIZE,
      snapSizeY: MIN_SNAP_SIZE
    });
  } else {
    const { x, y } = object;
    pointForDrag.moveTo([x, y]);
  }
}

function removePointForDrag(board) {
  if (pointForDrag) {
    board.$board.removeObject(pointForDrag);
    pointForDrag = null;
  }
}

const getClampedCoords = (value, bounds) => clamp(value, bounds[0], bounds[1]);

function getConfig(element) {
  const bounds = element.board.getBoundingBox();
  const p = element.parents[0];
  const x = element.coords[p].usrCoords[1];
  const y = element.coords[p].usrCoords[2];

  const clampedX = (bounds && getClampedCoords(x, [bounds[0], bounds[1]])) || x;
  const clampedY = (bounds && getClampedCoords(y, [bounds[3], bounds[2]])) || y;

  if (clampedX !== x || clampedY !== y) {
    element.translationPoints[0].moveTo([clampedX, clampedY]);
    element.translationPoints[1].moveTo([clampedX, clampedY]);
  }
  const { dimensions = { height: 32, width: 110 } } = element;
  return {
    _type: element.type,
    type: CONSTANT.TOOLS.DRAG_DROP,
    x: clampedX,
    y: clampedY,
    id: element.id,
    text: element.labelHTML,
    label: false,
    dimensions
  };
}

export default {
  jxgType,
  create,
  movePointForDrag,
  removePointForDrag,
  getConfig
};
