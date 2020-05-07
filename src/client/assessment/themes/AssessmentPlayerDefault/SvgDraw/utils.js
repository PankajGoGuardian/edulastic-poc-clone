import cloneDeep from "lodash/cloneDeep";
import { drawTools } from "@edulastic/constants";
import { normalizeTouchEvent } from "../../../utils/helpers";

export const getPointsForDrawingPath = path =>
  `M ${path[0].x},${path[0].y} ${path.map((point, i) => (i !== 0 ? `L ${point.x},${point.y}` : "")).join(" ")}`;

export const getNewFigures = (e, figures, bounded, figurePros, type) => {
  normalizeTouchEvent(e);
  let newFigures = cloneDeep(figures);
  switch (type) {
    case drawTools.DRAW_CIRCLE: {
      newFigures.push({
        ...figurePros,
        rx: 50,
        ry: 50,
        cx: e.clientX - bounded.left,
        cy: e.clientY - bounded.top
      });
      break;
    }
    case drawTools.DRAW_SQUARE: {
      newFigures.push({
        ...figurePros,
        width: 50,
        height: 50,
        x: e.clientX - bounded.left,
        y: e.clientY - bounded.top
      });
      break;
    }
    case drawTools.DRAW_TRIANGLE: {
      const point = { x: e.clientX - bounded.left, y: e.clientY - bounded.top };
      newFigures.push({
        ...figurePros,
        points: `${point.x},${point.y} ${point.x + 70},${point.y + 120} ${point.x},${point.y + 120}`
      });
      break;
    }
    case drawTools.DRAW_SIMPLE_LINE:
    case drawTools.FREE_DRAW: {
      const newPoint = {
        ...figurePros,
        x: e.clientX - bounded.left,
        y: e.clientY - bounded.top
      };
      // DRAW_SIMPLE_LINE will use only two points
      if (drawTools.DRAW_SIMPLE_LINE === type && newFigures.length > 0) {
        newFigures[1] = newPoint;
      } else {
        newFigures = newFigures.concat(newPoint);
      }
      break;
    }
    case drawTools.DRAW_BREAKING_LINE: {
      const newPoint = {
        ...figurePros,
        x: e.clientX - bounded.left,
        y: e.clientY - bounded.top
      };

      if (!figurePros.modifier) {
        newFigures[newFigures.length - 1] = newPoint;
      } else {
        newFigures.push(newPoint);
      }
      break;
    }
    default:
      break;
  }
  return newFigures;
};

export const resizeFigure = (e, cursor, figure, activeIndex, type) => {
  normalizeTouchEvent(e);
  switch (type) {
    case drawTools.DRAW_CIRCLE: {
      if (activeIndex === 1 || activeIndex === 2) {
        if (e.clientX < cursor.x) {
          figure.rx -= cursor.x - e.clientX;
        } else {
          figure.rx += e.clientX - cursor.x;
        }
      } else if (e.clientX < cursor.x) {
        figure.rx += cursor.x - e.clientX;
      } else {
        figure.rx -= e.clientX - cursor.x;
      }
      if (activeIndex === 3 || activeIndex === 2) {
        if (e.clientY < cursor.y) {
          figure.ry -= cursor.y - e.clientY;
        } else {
          figure.ry += e.clientY - cursor.y;
        }
      } else if (e.clientY < cursor.y) {
        figure.cy -= (cursor.y - e.clientY) / 2;
        figure.ry += (cursor.y - e.clientY) / 2;
      } else {
        figure.cy += (e.clientY - cursor.y) / 2;
        figure.ry -= (e.clientY - cursor.y) / 2;
      }
      if (figure.rx < 20) {
        figure.rx = 20;
      }
      if (figure.ry < 20) {
        figure.ry = 20;
      }
      break;
    }
    case drawTools.DRAW_SQUARE: {
      if (activeIndex === 1 || activeIndex === 2) {
        if (e.clientX < cursor.x) {
          figure.width -= cursor.x - e.clientX;
        } else {
          figure.width += e.clientX - cursor.x;
        }
      } else if (e.clientX < cursor.x) {
        figure.x -= cursor.x - e.clientX;
        figure.width += cursor.x - e.clientX;
      } else {
        figure.x += e.clientX - cursor.x;
        figure.width -= e.clientX - cursor.x;
      }
      if (activeIndex === 3 || activeIndex === 2) {
        if (e.clientY < cursor.y) {
          figure.height -= cursor.y - e.clientY;
        } else {
          figure.height += e.clientY - cursor.y;
        }
      } else if (e.clientY < cursor.y) {
        figure.y -= cursor.y - e.clientY;
        figure.height += cursor.y - e.clientY;
      } else {
        figure.y += e.clientY - cursor.y;
        figure.height -= e.clientY - cursor.y;
      }

      if (figure.width < 20) {
        figure.width = 20;
      }
      if (figure.height < 20) {
        figure.height = 20;
      }
      break;
    }
    case drawTools.DRAW_TRIANGLE: {
      const currentPoints = figure.points.split(" ").map(item => {
        const point = item.split(",");
        return { x: Number(point[0]), y: Number(point[1]) };
      });
      currentPoints[activeIndex].x -= cursor.x - e.clientX;
      currentPoints[activeIndex].y -= cursor.y - e.clientY;
      figure.points = currentPoints.map(point => `${point.x},${point.y}`).join(" ");
      break;
    }
    default:
      break;
  }
  return figure;
};

export const moveFigure = (e, cursor, figure, type) => {
  normalizeTouchEvent(e);
  switch (type) {
    case drawTools.DRAW_CIRCLE: {
      if (e.clientX < cursor.x) {
        figure.cx -= cursor.x - e.clientX;
      } else {
        figure.cx += e.clientX - cursor.x;
      }

      if (e.clientY < cursor.y) {
        figure.cy -= cursor.y - e.clientY;
      } else {
        figure.cy += e.clientY - cursor.y;
      }
      break;
    }
    case drawTools.DRAW_SQUARE: {
      if (e.clientX < cursor.x) {
        figure.x -= cursor.x - e.clientX;
      } else {
        figure.x += e.clientX - cursor.x;
      }

      if (e.clientY < cursor.y) {
        figure.y -= cursor.y - e.clientY;
      } else {
        figure.y += e.clientY - cursor.y;
      }
      break;
    }
    case drawTools.DRAW_TRIANGLE: {
      const currentPoints = figure.points.split(" ").map(item => {
        const point = item.split(",");
        return { x: Number(point[0]), y: Number(point[1]) };
      });

      figure.points = currentPoints
        .map(point => {
          const xPoint = point.x - (cursor.x - e.clientX);
          const yPoint = point.y - (cursor.y - e.clientY);
          return `${xPoint},${yPoint}`;
        })
        .join(" ");
      break;
    }
    default:
      break;
  }
  return figure;
};
