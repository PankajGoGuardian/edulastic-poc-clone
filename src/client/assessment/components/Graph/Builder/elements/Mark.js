/* global katex */
import JXG from "jsxgraph";
import { replaceLatexesWithMathHtml } from "@edulastic/common/src/utils/mathUtils";

import { calcMeasure, getClosestTick } from "../utils";
import { AUTO_VALUE } from "../config/constants";

const deleteIconPattern =
  '<svg id="{iconId}" class="delete-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.728 16.702">' +
  '<g id="{iconId}" transform="translate(-40.782 .5)">' +
  '<path id="{iconId}" d="M48.889.522V0H45.4v.522h-4.12v2.112h11.73V.522z" />' +
  '<path id="{iconId}" d="M57.546 80.756h8.939l.642-12.412H56.9zm5.486-9.511h1.107v6.325h-1.107zm-3.14 0H61v6.325h-1.108z"transform="translate(-14.87 -65.054)"/>' +
  "</g>" +
  "</svg>";

const snapMark = (mark, board) => {
  mark.on("up", () => {
    const {
      canvas,
      layout: { linePosition, pointBoxPosition },
      setValue
    } = board.numberlineSettings;

    const setCoords = JXG.COORDS_BY_USER;
    let x;
    let y;

    const [, yMeasure] = calcMeasure(board.$board.canvasWidth, board.$board.canvasHeight, board);
    const lineY = canvas.yMax - (yMeasure / 100) * linePosition;
    const containerY = canvas.yMax - (yMeasure / 100) * pointBoxPosition;

    if (mark.Y() >= containerY && mark.X() < canvas.xMin) {
      y = lineY;
      x = getClosestTick(mark.X(), board.numberlineAxis);
    } else if (mark.Y() >= containerY && mark.X() > canvas.xMax) {
      y = lineY;
      x = getClosestTick(mark.X(), board.numberlineAxis);
    } else if (mark.Y() >= containerY && mark.X() < canvas.xMax && mark.X() > canvas.xMin) {
      y = lineY;
      if (board.numberlineSnapToTicks) {
        x = getClosestTick(mark.X(), board.numberlineAxis);
      } else {
        x = mark.X();
      }
    } else {
      y = mark.Y();
      x = mark.X();
    }

    let cssClass = mark.visProp.cssclass;
    cssClass = cssClass.replace(" mounted", "");
    if (mark.Y() >= containerY) {
      cssClass += " mounted";
    }
    mark.setAttribute({
      cssClass,
      highlightCssClass: cssClass
    });

    mark.setPosition(setCoords, [x, y]);

    setValue();
  });
};

const onHandler = (board, coords, data) => {
  const {
    canvas,
    layout: { linePosition, pointBoxPosition }
  } = board.numberlineSettings;

  const [, yMeasure] = calcMeasure(board.$board.canvasWidth, board.$board.canvasHeight, board);
  const lineY = canvas.yMax - (yMeasure / 100) * linePosition;
  const containerY = canvas.yMax - (yMeasure / 100) * pointBoxPosition;
  const [xMin, , , yMin] = board.$board.getBoundingBox();
  let x = xMin;
  let y = yMin;
  if (coords) {
    x = coords.position;
    y = lineY;
  }

  let content = replaceLatexesWithMathHtml(data.text, latex => {
    if (!katex) return latex;
    return katex.renderToString(latex);
  });

  if (!coords || !coords.fixed) {
    const deleteIconId = `mark-delete-${data.id}`;
    content += deleteIconPattern.replace(/{iconId}/g, deleteIconId);
  }

  content = `<div class='mark-content'>${content}</div>`;

  const mark = board.$board.create("text", [x, y, content], {
    id: coords && coords.fixed ? null : data.id,
    anchorX: "middle",
    anchorY: "bottom",
    fixed: coords && coords.fixed
  });

  if (!coords || !coords.fixed) {
    snapMark(mark, board);
  }

  let cssClass = `fr-box mark ${coords && coords.className ? coords.className : ""}`;
  if (mark.Y() >= containerY) {
    cssClass += " mounted";
  }

  mark.setAttribute({
    cssClass,
    highlightCssClass: cssClass
  });

  mark.labelHTML = data.text;

  return mark;
};

const renderMarksContainer = (board, xMin, xMax, containerSettings) => {
  const [, yMeasure] = calcMeasure(board.$board.canvasWidth, board.$board.canvasHeight, board);
  const containerY = containerSettings.yMax - (yMeasure / 100) * containerSettings.position;

  const polygonCoords = [[xMin, containerY], [xMin, -1.75], [xMax, -1.75], [xMax, containerY]];
  return board.$board.create("polygon", polygonCoords, {
    fixed: true,
    withLines: false,
    fillOpacity: 1,
    fillColor: "#efefef",
    vertices: {
      visible: false
    }
  });
};

const updateMarksContainer = (board, xMin, xMax, containerSettings) => {
  board.$board.removeObject(board.marksContainer);
  board.marksContainer = renderMarksContainer(board, xMin, xMax, containerSettings);
};

const getConfig = mark => ({
  mounted: mark.visProp.cssclass.includes("mounted"),
  position: +mark.X().toFixed(4),
  point: mark.labelHTML,
  id: mark.id
});

const alignMarks = board => {
  const {
    numberlineAxis: { separationDistanceX, separationDistanceY },
    canvas,
    layout: { linePosition, pointBoxPosition, height: layoutHeight },
    setCalculatedHeight
  } = board.numberlineSettings;

  const [, yMeasure] = calcMeasure(board.$board.canvasWidth, board.$board.canvasHeight, board);
  const lineY = canvas.yMax - (yMeasure / 100) * linePosition;
  const containerY = canvas.yMax - (yMeasure / 100) * pointBoxPosition;

  const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox();
  const pxInUnitX = board.$board.canvasWidth / (xMax - xMin);
  const pxInUnitY = board.$board.canvasHeight / (yMax - yMin);
  const marginLeft = separationDistanceX / pxInUnitX;
  const marginTop = separationDistanceY / pxInUnitY;

  let offsetX = xMin; // right side of previous mark
  let offsetY = containerY; // bottom side of previous marks line
  let minY = 10; // y position of lowest mark
  board.elements.forEach(mark => {
    if (mark.Y() === lineY) {
      return;
    }

    const rect = mark.rendNode.getBoundingClientRect();
    const height = rect.height / pxInUnitY;
    const width = rect.width / pxInUnitX;
    const setCoords = JXG.COORDS_BY_USER;

    if (offsetX + marginLeft + width > xMax) {
      offsetX = xMin;
      offsetY -= marginTop + height;
    }

    const x = offsetX + marginLeft + width / 2;
    const y = offsetY - (marginTop + height);
    minY = Math.min(y, minY);
    mark.setPosition(setCoords, [x, y]);
    mark.setAttribute({
      cssClass: "fr-box mark",
      highlightCssClass: "fr-box mark"
    });

    offsetX = x + width / 2;
  });

  // set auto calculated height if needed
  if (layoutHeight !== AUTO_VALUE) {
    return;
  }

  const extraHeight = (yMin - minY) * pxInUnitY;
  if (extraHeight <= 0) {
    return;
  }

  const containerHeight = (board.$board.canvasHeight * (100 - pointBoxPosition)) / 100;
  const newContainerHeight = containerHeight + extraHeight + separationDistanceY;
  const newHeight = +((newContainerHeight * 100) / (100 - pointBoxPosition) + 3).toFixed(4);
  setCalculatedHeight(newHeight);
};

export default {
  onHandler,
  updateMarksContainer,
  getConfig,
  alignMarks
};
