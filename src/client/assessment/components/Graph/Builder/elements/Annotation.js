import { CONSTANT } from "../config";
import QuillInput from "./QuillInput";
import { getLabelPositionParameters } from "../settings";

const jxgType = 99;

const moveIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.669 16" style="width:16px; height:16px;"><path d="M18.669 8l-3.5-3v2H10.5V3h2.334l-3.5-3-3.5 3h2.334v4H3.5V5L0 8l3.5 3V9h4.668v4H5.834l3.5 3 3.5-3H10.5V9h4.667v2z" /></svg>';

function renderElement(board, params, attrs = {}) {
  const newElem = board.$board.create("text", [params.x, params.y, attrs.fixed ? "" : moveIcon], {
    isLabel: true,
    color: "transparent",
    highlightColor: "transparent",
    cssClass: "graph-annotation",
    highlightCssClass: "graph-annotation",
    label: {
      cssClass: "graph-annotation-label",
      highlightCssClass: "graph-annotation-label",
      ...getLabelPositionParameters(jxgType)
    },
    ...attrs
  });
  newElem.type = jxgType;
  newElem.on("up", () => {
    if (newElem.dragged) {
      newElem.dragged = false;
      board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
    }
  });
  newElem.on("drag", e => {
    if (e.movementX === 0 && e.movementY === 0) {
      return;
    }
    newElem.dragged = true;
    board.dragged = true;
  });

  return newElem;
}

function onHandler() {
  return (board, event) => {
    const coords = board.getCoords(event);

    const newElement = renderElement(board, {
      x: coords.usrCoords[1],
      y: coords.usrCoords[2]
    });

    QuillInput(newElement, board).setFocus();
  };
}

function getConfig(annotation) {
  return {
    _type: annotation.type,
    type: CONSTANT.TOOLS.ANNOTATION,
    id: annotation.id,
    label: annotation.labelHTML || false,
    x: annotation.coords.usrCoords[1],
    y: annotation.coords.usrCoords[2]
  };
}

export default {
  onHandler,
  getConfig,
  renderElement
};
