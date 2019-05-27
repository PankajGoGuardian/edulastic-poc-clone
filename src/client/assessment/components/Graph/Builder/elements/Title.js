import JXG from "jsxgraph";
import { calcMeasure, lineLabelCoord } from "../utils";
import { defaultTextParameters } from "../settings";

const renderTitle = (board, title) => {
  const [x, y] = calcMeasure(board.$board.canvasWidth, board.$board.canvasHeight, board);
  const calcY = title.yMax - (y / 100) * title.position;
  const point = board.$board.create("point", [lineLabelCoord(title.xMin, title.xMax), calcY], {
    visible: false,
    fixed: true
  });
  point.elType = "title";
  point.setLabel(title.title);
  point.label.setAttribute({
    ...defaultTextParameters(),
    cssClass: "title",
    highlightCssClass: "title",
    visible: true
  });
  point.label.setPosition(JXG.COORDS_BY_USER, [board.$board.plainBB[0], calcY]);
  return point;
};

export default {
  renderTitle
};
