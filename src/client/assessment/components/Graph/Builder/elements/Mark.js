import JXG from "jsxgraph";
import { Quill } from "react-quill";
import { calcMeasure, getClosestTick } from "../utils";

const snapMark = (mark, graphParameters, setValue, lineSettings, containerSettings, board) => {
  mark.on("up", () => {
    const setCoords = JXG.COORDS_BY_USER;
    let x;
    let y;

    const [, yMeasure] = calcMeasure(board.$board.canvasWidth, board.$board.canvasHeight, board);
    const lineY = lineSettings.yMax - (yMeasure / 100) * lineSettings.position;
    const containerY = containerSettings.yMax - (yMeasure / 100) * containerSettings.position;

    if (mark.Y() >= containerY && mark.X() < graphParameters.xMin) {
      y = lineY;
      x = getClosestTick(mark.X(), board.numberlineAxis);
    } else if (mark.Y() >= containerY && mark.X() > graphParameters.xMax) {
      y = lineY;
      x = getClosestTick(mark.X(), board.numberlineAxis);
    } else if (mark.Y() >= containerY && mark.X() < graphParameters.xMax && mark.X() > graphParameters.xMin) {
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

const onHandler = (board, coords, data, graphParameters, setValue, lineSettings, containerSettings) => {
  const [, yMeasure] = calcMeasure(board.$board.canvasWidth, board.$board.canvasHeight, board);
  const lineY = lineSettings.yMax - (yMeasure / 100) * lineSettings.position;
  const containerY = containerSettings.yMax - (yMeasure / 100) * containerSettings.position;
  const [xMin, , , yMin] = board.$board.getBoundingBox();
  let x = xMin;
  let y = yMin;
  if (coords) {
    x = coords.position;
    y = Number.isNaN(Number.parseFloat(coords.y)) ? lineY : coords.y;
  }

  const mark = board.$board.create("text", [x, y, ""], {
    id: coords && coords.fixed ? null : data.id,
    anchorX: "middle",
    anchorY: "bottom",
    fixed: coords && coords.fixed
  });

  const selector = `[id*=${mark.id}]`;
  mark.quillInput = new Quill(selector, {
    theme: "bubble",
    readOnly: true,
    modules: {
      toolbar: false
    }
  });

  mark.quillInput.clipboard.matchers = mark.quillInput.clipboard.matchers.filter(
    matcher => matcher[1].name !== "matchNewline"
  );

  mark.quillInput.clipboard.dangerouslyPasteHTML(0, data.text);
  mark.labelHTML = data.text;

  if (!coords || !coords.fixed) {
    snapMark(mark, graphParameters, setValue, lineSettings, containerSettings, board);
  }

  let cssClass = `mark ${coords && coords.className ? coords.className : ""}`;
  if (mark.Y() >= containerY) {
    cssClass += " mounted";
  }

  mark.setAttribute({
    cssClass,
    highlightCssClass: cssClass
  });

  return mark;
};

const renderMarksContainer = (board, xMin, xMax, containerSettings) => {
  const [, yMeasure] = calcMeasure(board.$board.canvasWidth, board.$board.canvasHeight, board);
  const containerY = containerSettings.yMax - (yMeasure / 100) * containerSettings.position;

  const polygonCoords = [[xMin, containerY], [xMin, -1.75], [xMax, -1.75], [xMax, containerY]];
  const polygon = board.$board.create("polygon", polygonCoords, {
    fixed: true,
    withLines: false,
    fillOpacity: 1,
    fillColor: "#efefef",
    vertices: {
      visible: false
    }
  });
  return polygon;
};

const updateMarksContainer = (board, xMin, xMax, containerSettings) => {
  board.$board.removeObject(board.marksContainer);
  board.marksContainer = renderMarksContainer(board, xMin, xMax, containerSettings);
};

const getConfig = mark => ({
  position: mark.X(),
  y: mark.Y(),
  point: mark.labelHTML,
  id: mark.id
});

const alignMarks = (board, settings, containerSettings, lineSettings) => {
  const [, yMeasure] = calcMeasure(board.$board.canvasWidth, board.$board.canvasHeight, board);
  const lineY = lineSettings.yMax - (yMeasure / 100) * lineSettings.position;
  const containerY = containerSettings.yMax - (yMeasure / 100) * containerSettings.position;

  const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox();
  const pxInUnitX = board.$board.canvasWidth / (xMax - xMin);
  const pxInUnitY = board.$board.canvasHeight / (yMax - yMin);
  const marginLeft = settings.separationDistanceX / pxInUnitX;
  const marginTop = settings.separationDistanceY / pxInUnitY;

  let offsetX = xMin; // right side of previous mark
  let offsetY = containerY; // bottom side of previous marks line
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
    mark.setPosition(setCoords, [x, y]);
    mark.setAttribute({
      cssClass: "mark",
      highlightCssClass: "mark"
    });

    offsetX = x + width / 2;
  });
};

export default {
  onHandler,
  updateMarksContainer,
  getConfig,
  alignMarks
};
