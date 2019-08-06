import { replaceLatexesWithMathHtml } from "@edulastic/common/src/utils/mathUtils";

import { CONSTANT, Colors } from "../config";
import { defaultPointParameters } from "../settings";

const deleteIconPattern =
  '<svg id="{iconId}" class="delete-drag-drop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.728 16.702">' +
  '<g id="{iconId}" transform="translate(-40.782 .5)">' +
  '<path id="{iconId}" d="M48.889.522V0H45.4v.522h-4.12v2.112h11.73V.522z" />' +
  '<path id="{iconId}" d="M57.546 80.756h8.939l.642-12.412H56.9zm5.486-9.511h1.107v6.325h-1.107zm-3.14 0H61v6.325h-1.108z"transform="translate(-14.87 -65.054)"/>' +
  "</g>" +
  "</svg>";

const jxgType = 101;

function renderElement(board, element) {
  const { id, text, x, y, fixed, colors } = element;

  const point = board.$board.create("point", [x, y], {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    ...Colors.default[CONSTANT.TOOLS.POINT],
    ...colors,
    fixed
  });

  let content = replaceLatexesWithMathHtml(text);

  if (!fixed) {
    const deleteIconId = `drag-drop-delete-${id}`;
    content += deleteIconPattern.replace(/{iconId}/g, deleteIconId);
  }

  content = `<div class='drag-drop-content'>${content}</div>`;
  const cssClass = "fr-box drag-drop";

  const mark = board.$board.create("text", [x, y, content], {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    anchorX: "middle",
    anchorY: "top",
    cssClass,
    highlightCssClass: cssClass,
    fixed
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

  point.on("up", upHandler);
  point.on("drag", dragHandler);
  mark.on("up", upHandler);
  mark.on("drag", dragHandler);

  newElement.type = jxgType;
  newElement.labelHTML = text;

  return newElement;
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
  renderElement,
  getConfig
};
