import { measureText } from "@edulastic/common";
import { drawTools } from "@edulastic/constants";
import { maxBy, minBy, cloneDeep } from "lodash";

export const resizeHandlerSize = 10;
export const activatedAreaBorder = "1px dashed";
export const resizeHandlerStyles = {
  top: {
    top: 0,
    height: resizeHandlerSize
  },
  left: {
    left: 0,
    width: resizeHandlerSize
  },
  bottom: {
    bottom: 0,
    height: resizeHandlerSize
  },
  right: {
    right: 0,
    width: resizeHandlerSize
  },
  topLeft: {
    top: -1,
    left: -1,
    height: resizeHandlerSize,
    width: resizeHandlerSize,
    border: activatedAreaBorder
  },
  bottomLeft: {
    bottom: -1,
    left: -1,
    height: resizeHandlerSize,
    width: resizeHandlerSize,
    border: activatedAreaBorder
  },
  bottomRight: {
    bottom: -1,
    right: -1,
    height: resizeHandlerSize,
    width: resizeHandlerSize,
    border: activatedAreaBorder
  },
  topRight: {
    top: -1,
    right: -1,
    height: resizeHandlerSize,
    width: resizeHandlerSize,
    border: activatedAreaBorder
  }
};

/**
 * @param {String} points is a string of points, "32,43 42,53 23,59"
 * @returns {Array} array of points.
 */
export const getPointsFromTriangle = points => {
  const coordinates = points.split(" ").map(point => {
    const [pointX, pointY] = point.split(",");
    return { x: parseInt(pointX, 10), y: parseInt(pointY, 10) };
  });
  return coordinates;
};
/**
 * calculate bouding rect of selection.
 * @param {Object} point1
 * @param {Object} point2
 * @returns {Object} bounding rect of selection
 */
export const getStyle = (point1, point2) => {
  const width = Math.abs(point1.x - point2.x);
  const height = Math.abs(point1.y - point2.y);
  const top = point2.y - point1.y < 0 ? point2.y : point1.y;
  const left = point2.x - point1.x < 0 ? point2.x : point1.x;
  return { top, left, height, width };
};

/**
 * calculate bounding Rect based on Text.
 * this would be used for Math and Text.
 * @param {Object} obj
 */
export const getRectFromText = obj => {
  const { x, y, value, lineWidth } = obj;
  const { width, height } = measureText(value, { fontSize: `${lineWidth * 3}px` });
  return { width, height, x, y };
};

/**
 * calcualte bounding Rect based on points.
 * This would be used for Paths and triangle.
 * @param {Array} points
 * @return {Object} bounding Rect
 */
export const getRectFromPointArr = points => {
  const minX = minBy(points, point => point.x)?.x;
  const maxX = maxBy(points, point => point.x)?.x;
  const minY = minBy(points, point => point.y)?.y;
  const maxY = maxBy(points, point => point.y)?.y;
  return { width: maxX - minX, height: maxY - minY, x: minX, y: minY };
};

/**
 * check if clicked point is in the selected area
 * @param {rect} selection selected area (top, left, width, height)
 * @param {rect} point new point (x, y)
 *
 * @returns {boolean}
 */
export const isPointInSelection = (rect, point) =>
  point.y >= rect.top && point.y <= rect.top + rect.height && point.x >= rect.left && point.x <= rect.left + rect.width;

/**
 * get rect of rectangle | triangle | circle | text | math.
 * default is rectangle and circle
 * @param {object} figure rectangle | triangle | circle | text | math
 * @returns {object} bound rect
 */
export const getRect = figure => {
  const { width, height, x, y, rx, ry, cx, cy, points } = figure;
  if (rx && ry && cx && cy) {
    // the figure is a circle
    return {
      x: cx - rx,
      y: cy - ry,
      width: 2 * rx,
      height: 2 * ry
    };
  }
  if (points) {
    // the figure is a triangle
    const coordinates = getPointsFromTriangle(points);
    return getRectFromPointArr(coordinates);
  }
  return { width, height, x, y };
};

const removePrevActivate = obj => {
  const newData = cloneDeep(obj);
  delete newData.activatedPathes;
  for (const [key, figures] of Object.entries(newData)) {
    newData[key] = figures.map(f => {
      delete f.activated;
      return f;
    });
  }
  return newData;
};

/**
 * check if the figure is in the selection area.
 * will return updated user workHistory
 * @param {Object} obj user workHistoy
 * @param {Object} rect  bounding rect of current selection
 * @returns {Object}
 */
export const getFiguresInSelection = (obj, rect) => {
  const selected = {};
  const newData = removePrevActivate(obj);
  for (const [key, figures] of Object.entries(newData)) {
    const activatedIndex = [];
    selected[key] = figures.map((f, i) => {
      let rect2 = {};
      if (key === "pathes") {
        rect2 = getRectFromPointArr(f);
      } else if (key === "curved") {
        // TODO get bounding box of curved line
      } else if (key === "texts" || key === "maths") {
        rect2 = getRectFromText(f);
      } else {
        rect2 = getRect(f);
      }
      if (
        rect.left + rect.width > rect2.x + rect2.width &&
        rect.left < rect2.x &&
        rect.top + rect.height > rect2.y + rect2.height &&
        rect.top < rect2.y
      ) {
        if (key === "pathes") {
          activatedIndex.push(i);
          return f;
        }
        return { ...f, activated: true };
      }
      return f;
    });
    if (key === "pathes") {
      selected.activatedPathes = activatedIndex;
    }
  }
  return selected;
};

/**
 * resize current selection by bounding boxes on mouse up.
 * return updated bouding box of selection.
 * @param {Object} obj selected figures insdie bounding boxes
 * @param {Number} lineWidth border width of figures.
 * @returns {object | null}
 */
export const resizeSelection = (obj, lineWidth) => {
  let bounds = [];
  for (const [key, figures] of Object.entries(obj)) {
    const _bounds = figures
      .map((f, i) => {
        let rect = null;
        if (key === "pathes" && obj?.activatedPathes?.includes(i)) {
          rect = getRectFromPointArr(f);
        } else if (key === "curved" && f.activated) {
          // TODO get bounding box of curved line
        } else if ((key === "texts" || key === "maths") && f.activated) {
          rect = getRectFromText(f);
        } else if (f.activated) {
          rect = getRect(f);
        }
        return rect;
      })
      .filter(b => !!b);
    bounds = bounds.concat(_bounds);
  }

  // resize selection
  const minX = minBy(bounds, bound => bound.x);
  const maxX = maxBy(bounds, bound => bound.x + bound.width);
  const minY = minBy(bounds, bound => bound.y);
  const maxY = maxBy(bounds, bound => bound.y + bound.height);

  if (minX && maxX && minY && maxY) {
    return {
      left: minX.x - lineWidth,
      top: minY.y - lineWidth,
      width: maxX.x - minX.x + maxX.width + lineWidth * 2,
      height: maxY.y - minY.y + maxY.height + lineWidth * 2
    };
  }
  return null;
};

/**
 * move selected figures by difference.
 * will return moved user workHistory.
 * @param {Object} diff difference when the user drag selection (left, top)
 * @param {Object} obj this is user workHistory
 * @returns {Object} moved figures
 */
export const moveSelectedFigures = (diff, obj) => {
  const updatedFigures = {};
  for (const [key, figures] of Object.entries(obj)) {
    updatedFigures[key] = figures.map(f => {
      if (f.activated && f.width && f.height && f.x && f.y && key === "figures") {
        // the figure is rectangle
        return {
          ...f,
          x: diff.left + f.x,
          y: diff.top + f.y
        };
      }
      return f;
    });
  }
  return updatedFigures;
};

/**
 * resize selected figures when resize selection.
 * @param {Object} diff
 * @param {Object} obj
 * @param {Object} p bouding rect of previous selection
 * @param {Object} n updated rect of updated selection
 * @returns {Object} resized figures
 */
export const resizeSelectedFigures = (diff, obj, p, n) => {
  const updatedFigures = {};
  for (const [key, figures] of Object.entries(obj)) {
    updatedFigures[key] = figures.map(f => {
      if (f.activated && f.width && f.height && f.x && f.y && key === "figures") {
        // the figure is rectangle
        return {
          ...f,
          x: ((f.x - f.strokeWidth - p.left) * n.width) / p.width + n.left + f.strokeWidth,
          y: ((f.y - f.strokeWidth - p.top) * n.height) / p.height + n.top + f.strokeWidth,
          width: diff.width * f.width,
          height: diff.height * f.height
        };
      }
      return f;
    });
  }
  return updatedFigures;
};

/**
 * handle copy/paste/cut/move behind/move forward
 * @param {Object} copiedObj is copied figures
 * @param {Object} obj is user work history
 * @param {String} toolMode is current tool mode. can be copy/paste/cut/moveBehind/moveForward
 * @returns {Object} will return copied figures and updated user workHistory.
 */
export const editFigures = (copiedObj, obj, toolMode) => {
  let newData = cloneDeep(obj);
  const newCopied = {};

  switch (toolMode) {
    case drawTools.COPY:
    case drawTools.CUT: {
      for (const [key, figures] of Object.entries(obj)) {
        if (key === "activatedPathes") {
          newCopied[key] = obj[key];
        } else {
          newCopied[key] = figures.filter(
            (f, i) => f.activated || (key === "pathes" && obj?.activatedPathes?.includes(i))
          );
        }
        if (toolMode === drawTools.CUT && key !== "activatedPathes") {
          newData[key] = figures.filter(
            (f, i) => (key !== "pathes" && !f.activated) || (key === "pathes" && !obj?.activatedPathes?.includes(i))
          );
        }
      }
      return {
        figures: newData,
        copiedObj: newCopied
      };
    }
    case drawTools.PASTE: {
      newData = removePrevActivate(obj);
      for (const [key] of Object.entries(newData)) {
        if (key !== "pathes" && key !== "activatedPathes") {
          if (copiedObj[key]) {
            if (!newData[key]) newData[key] = [];
            newCopied[key] = copiedObj[key].map(f => {
              if (f.x && f.y) {
                // this is a Rectangle, text and math
                f.x += 10;
                f.y += 10;
              }
              if (f.index !== undefined) {
                // text and math has an index for editing it and the indexes should be updated
                f.index = newData[key].length;
              }
              if (f.points) {
                // this is a triangle
                const points = getPointsFromTriangle(f.points)
                  .map(point => {
                    point.x += 10;
                    point.y += 10;
                    return `${point.x},${point.y}`;
                  })
                  .join(" ");
                f.points = points;
              }
              if (f.cx && f.cy) {
                // this is a circle
                f.cx += 10;
                f.cy += 10;
              }
              f.activated = true;
              newData[key].push(f);
              return f;
            });
          }
        }
        if (key === "pathes" && copiedObj?.activatedPathes) {
          // paste line, freeline, and breaking line.
          if (copiedObj[key]) {
            newCopied.activatedPathes = [];
            newCopied[key] = copiedObj[key].map(points => {
              const updated = points.map(p => {
                p.x += 10;
                p.y += 10;
                return p;
              });
              newData[key].push(updated);
              newCopied.activatedPathes.push(newData[key].length - 1);
              return updated;
            });
          }
          newData.activatedPathes = newCopied.activatedPathes;
        }
        if (key === "curved") {
          // TODO: paste curved line
        }
      }
      return {
        figures: newData,
        copiedObj: newCopied
      };
    }
    default:
      return {};
  }
};
