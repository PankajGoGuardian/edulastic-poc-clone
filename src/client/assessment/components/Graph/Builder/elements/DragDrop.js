import { replaceLatexesWithMathHtml } from "@edulastic/common/src/utils/mathUtils";

import { IconCloseTextFormat } from "@edulastic/icons";
import { IconCorrectTextFormat } from "@edulastic/icons";

import { CONSTANT } from "../config";
import { defaultPointParameters } from "../settings";
import { Point } from ".";

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
let pointElemForDrag = null;

function drawPoint(board, object, settings) {
  if (pointElemForDrag) {
    board.$board.removeObject(pointElemForDrag);
    pointElemForDrag = null;
  }
  const { fixed = false } = settings;
  const { x, y, priorityColor } = object;

  const point = board.$board.create("point", [x, y], {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    ...Point.getColorParams(priorityColor || board.priorityColor),
    fixed
  });

  return point;
}

function create(board, object, settings) {
  const { fixed = false } = settings;

  const { id = null, x, y, text, customOptions = {} } = object;

  const point = drawPoint(board, object, settings);

  let content = replaceLatexesWithMathHtml(text);

  if (!fixed) {
    const deleteIconId = `drag-drop-delete-${id}`;
    content += deleteIconPattern.replace(/{iconId}/g, deleteIconId);
  }

  content = `<div class='drag-drop-content ${
    customOptions.isCorrect
      ? "drag-drop-content-correct"
      : customOptions.isCorrect === false
      ? "drag-drop-content-incorrect"
      : ""
  }'>${content}${customOptions.isCorrect ? IconCorrect : customOptions.isCorrect === false ? IconClose : ""}</div>`;

  const cssClass = "fr-box drag-drop";

  const mark = board.$board.create("text", [x, y, content], {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    anchorX: "middle", // this setting cause offset flickering
    anchorY: "top",
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
    newElement.dragged = true;
    board.dragged = true;
  };

  const upHandler = () => {
    if (newElement.dragged) {
      newElement.dragged = false;
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

  return newElement;
}

function moveElement(board, object, settings) {
  if (!pointElemForDrag) {
    pointElemForDrag = drawPoint(board, object, settings);
  } else {
    const { x, y } = object;
    pointElemForDrag.moveTo([x, y]);
  }
}

function getConfig(dragDrop) {
  return {
    _type: dragDrop.type,
    type: CONSTANT.TOOLS.DRAG_DROP,
    x: dragDrop.coords[dragDrop.parents[0]].usrCoords[1],
    y: dragDrop.coords[dragDrop.parents[0]].usrCoords[2],
    id: dragDrop.id,
    text: dragDrop.labelHTML,
    label: false
  };
}

export default {
  jxgType,
  create,
  moveElement,
  getConfig
};
