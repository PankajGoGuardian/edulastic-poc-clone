import JXG from "jsxgraph";
import { CONSTANT } from "./config";
import { defaultConfig as lineConfig } from "./elements/Line";
import rayConfig from "./elements/Ray";
import segmentConfig from "./elements/Segment";
import vectorConfig from "./elements/Vector";
import Polygon from "./elements/Polygon";

// Calculate amount of units in chosen amount of pixels
export const calcMeasure = (x, y, board) => [x / board.$board.unitX, y / board.$board.unitY];

export const findAvailableStackedSegmentPosition = board => {
  const [, y] = calcMeasure(board.$board.canvasWidth, board.$board.canvasHeight, board);
  const [, yMeasure] = calcMeasure(0, board.stackResponsesSpacing, board);
  const lineY = 0.5 - (y / 100) * 75;
  const calcedYPosition = lineY + yMeasure;

  for (let i = 0; i <= board.elements.length; i++) {
    const yPosition = +(lineY + yMeasure * (i + 1)).toFixed(2);
    let isPositionAvailable = true;

    board.elements.forEach(segment => {
      if (segment.elType === "point") {
        if (segment.Y() === yPosition) {
          isPositionAvailable = false;
        }
      } else if (segment.point2.coords.usrCoords[2] === yPosition) {
        isPositionAvailable = false;
      }
    });

    if (isPositionAvailable) {
      return yPosition;
    }
  }

  return calcedYPosition;
};

export const lineLabelCoord = (firstPoint, secondPoint) => {
  if (firstPoint === secondPoint) {
    return firstPoint;
  }
  if (firstPoint < secondPoint) {
    const segmentLength = -firstPoint + secondPoint;
    return secondPoint - segmentLength / 2;
  }
  const segmentLength = -secondPoint + firstPoint;
  return firstPoint - segmentLength / 2;
};

// Calculate position between two points for line
export const calcLineLabelPosition = line => {
  const finalXCoord = lineLabelCoord(line.point1.coords.usrCoords[1], line.point2.coords.usrCoords[1]);
  const finalYCoord = lineLabelCoord(line.point1.coords.usrCoords[2], line.point2.coords.usrCoords[2]);
  return [finalXCoord, finalYCoord];
};

const fractionsNumber = number =>
  number.toString().includes(".")
    ? number
        .toString()
        .split(".")
        .pop().length
    : 0;

// Calculate point rounded to ticksDistance value
export const calcRoundedToTicksDistance = (x, ticksDistance) => {
  if (fractionsNumber(ticksDistance) === 0) {
    if (x % ticksDistance >= ticksDistance / 2) {
      // closer to the biggest value
      let distanceDiff = x;
      do {
        distanceDiff = Math.ceil(distanceDiff + 0.0001);
      } while (distanceDiff % ticksDistance !== 0);

      return x + (distanceDiff - x);
    }
    // closer to the smallest value
    return Math.round(x - (x % ticksDistance));
  }
  let ticksRounded = ticksDistance;
  let iterationsCount = 0;
  let xRounded = x;

  do {
    xRounded *= 10;
    ticksRounded *= 10;
    iterationsCount += 1;
  } while (fractionsNumber(ticksRounded) !== 0);

  xRounded = Math.floor(xRounded);

  let roundedCoord = calcRoundedToTicksDistance(xRounded, ticksRounded);

  do {
    roundedCoord /= 10;
    iterationsCount -= 1;
  } while (iterationsCount !== 0);

  return roundedCoord;
};

// Calculate unitX
export const calcUnitX = (xMin, xMax, layoutWidth) => {
  const unitLength = -xMin + xMax;
  return !layoutWidth ? 1 : layoutWidth / unitLength;
};

function compareKeys(config, props) {
  return Object.keys(config).every(k => !!props[k] === !!config[k]);
}

function numberWithCommas(x) {
  x = x.toString();
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) {
    x = x.replace(pattern, "$1,$2");
  }
  return x;
}

function getPointsFromFlatConfig(type, pointIds, config) {
  if (!pointIds) {
    return null;
  }
  switch (type) {
    case CONSTANT.TOOLS.POLYGON:
    case CONSTANT.TOOLS.ELLIPSE:
    case CONSTANT.TOOLS.HYPERBOLA:
    case CONSTANT.TOOLS.POLYNOM:
      return Object.keys(pointIds)
        .sort()
        .map(k => config.find(element => element.id === pointIds[k]));
    default:
      return [
        config.find(element => element.id === pointIds.startPoint),
        config.find(element => element.id === pointIds.endPoint)
      ];
  }
}

export const handleSnap = (line, points, board, beforeEmitMoveEventCallback = () => {}) => {
  line.on("up", () => {
    if (line.dragged) {
      points.forEach(point => point.snapToGrid());
      beforeEmitMoveEventCallback();
      line.dragged = false;
      board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
    }
  });
  line.on("drag", e => {
    if (e.movementX === 0 && e.movementY === 0) {
      return;
    }
    line.dragged = true;
    board.dragged = true;
  });

  points.forEach(point => {
    point.on("up", () => {
      if (point.dragged) {
        beforeEmitMoveEventCallback();
        point.dragged = false;
        board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
      }
    });
    point.on("drag", e => {
      if (e.movementX === 0 && e.movementY === 0) {
        return;
      }
      point.dragged = true;
      board.dragged = true;
    });
  });
};

export function getLineTypeByProp(props) {
  if (compareKeys(lineConfig, props)) {
    return CONSTANT.TOOLS.LINE;
  }
  if (compareKeys(rayConfig, props)) {
    return CONSTANT.TOOLS.RAY;
  }
  if (compareKeys(segmentConfig, props)) {
    return CONSTANT.TOOLS.SEGMENT;
  }
  if (compareKeys(vectorConfig, props)) {
    return CONSTANT.TOOLS.VECTOR;
  }
  throw new Error("Unknown line", props);
}

export function getPropsByLineType(type) {
  switch (type) {
    case "line":
      return lineConfig;
    case "ray":
      return rayConfig;
    case "segment":
      return segmentConfig;
    case "vector":
      return vectorConfig;
    default:
      throw new Error("Unknown line type:", type);
  }
}

export function tickLabel(axe, withComma = true, distance = 0) {
  return coords => {
    const label = axe === "x" ? coords.usrCoords[1] : coords.usrCoords[2];
    if (axe === "x" && label === 0) {
      // offset fix for zero label
      return "0&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;";
    }
    if (axe === "y" && label === 0) {
      return "";
    }
    return withComma ? numberWithCommas(label.toFixed(distance)) : label;
  };
}

export function updatePointParameters(elements, attr, isSwitchToGrid) {
  if (!elements) {
    return;
  }

  Object.keys(elements).forEach(key => {
    const el = elements[key];
    if (el.type === JXG.OBJECT_TYPE_POINT) {
      el.setAttribute(attr);
      if (isSwitchToGrid) {
        el.snapToGrid();
      }
    } else {
      updatePointParameters(Object.values(el.ancestors || {}), attr, isSwitchToGrid);
    }
  });
}

export function updateAxe(line, parameters, axe) {
  if ("ticksDistance" in parameters) {
    line.ticks[0].setAttribute({ ticksDistance: parameters.ticksDistance });
  }
  if ("showTicks" in parameters) {
    line.ticks[0].setAttribute({ majorHeight: parameters.showTicks ? 25 : 0 });
  }
  if ("drawLabels" in parameters) {
    line.ticks[0].setAttribute({ drawLabels: parameters.drawLabels });
  }
  if ("name" in parameters && line.name !== parameters.name) {
    if (!parameters.name) {
      line.setAttribute({ withLabel: false, name: "" });
    } else {
      line.setAttribute({ withLabel: true, name: parameters.name });
    }
  }
  if ("minArrow" in parameters || "maxArrow" in parameters) {
    line.setArrow(
      parameters.minArrow === true ? { size: 8 } : false,
      parameters.maxArrow === true ? { size: 8 } : false
    );
  }
  if ("commaInLabel" in parameters) {
    line.ticks[0].generateLabelText = tickLabel(axe, parameters.commaInLabel);
  }
  if ("drawZero" in parameters) {
    line.ticks[0].setAttribute({ drawZero: parameters.drawZero });
  }
  if ("showAxis" in parameters) {
    line.setAttribute({ visible: parameters.showAxis });
    line.ticks[0].setAttribute({ visible: parameters.showAxis });
  }
}

export function updateGrid(grids, parameters) {
  const grid = grids[0];
  if (!grid) {
    return;
  }
  grid.setAttribute({
    gridX: parameters.gridX,
    gridY: parameters.gridY,
    visible: parameters.showGrid
  });
}

/**
 *
 * @param {object} boardParameters
 * @param {object} image
 * @requires Array [[left corner] ,[W,H]]
 */
export function getImageCoordsByPercent(boardParameters, bgImageParameters) {
  const { graphParameters } = boardParameters;
  const { size, coords } = bgImageParameters;
  const xSize = Math.abs(graphParameters.xMin) + Math.abs(graphParameters.xMax);
  const ySize = Math.abs(graphParameters.yMin) + Math.abs(graphParameters.yMax);
  const imageSize = [Math.round((xSize / 100) * size[0]), Math.round((ySize / 100) * size[1])];
  const leftCorner = [coords[0] - imageSize[0] / 2, coords[1] - imageSize[1] / 2];
  return [leftCorner, imageSize];
}

export function flatConfig(config, accArg = {}, isSub = false) {
  return config.reduce((acc, element) => {
    const { id, type, points, latex, subType } = element;
    if (type === CONSTANT.TOOLS.POINT || type === CONSTANT.TOOLS.ANNOTATION || type === CONSTANT.TOOLS.AREA) {
      if (!acc[id]) {
        acc[id] = element;
      }
      if (isSub) {
        acc[id].subElement = true;
      }
      return acc;
    }
    acc[id] = {
      type,
      _type: element._type,
      id: element.id,
      label: element.label,
      labelIsVisible: element.labelIsVisible
    };
    if (type === CONSTANT.TOOLS.EQUATION) {
      acc[id].latex = latex;
      acc[id].subType = subType;
      if (points && points[0] && points[1]) {
        acc[id].subElementsIds = {
          startPoint: points[0].id,
          endPoint: points[1].id
        };
      } else {
        acc[id].subElementsIds = null;
        return acc;
      }
    } else if (
      type !== CONSTANT.TOOLS.POLYGON &&
      type !== CONSTANT.TOOLS.ELLIPSE &&
      type !== CONSTANT.TOOLS.HYPERBOLA &&
      type !== CONSTANT.TOOLS.POLYNOM
    ) {
      acc[id].subElementsIds = {
        startPoint: points[0].id,
        endPoint: points[1].id
      };
    } else {
      acc[id].subElementsIds = Polygon.flatConfigPoints(points);
    }
    return flatConfig(points, acc, true);
  }, accArg);
}

export function flat2nestedConfig(config) {
  return Object.values(
    config.reduce((acc, element) => {
      const { id, type, subElement = false, latex = null, subType = null, points } = element;

      if (!acc[id] && !subElement) {
        acc[id] = {
          id,
          type,
          _type: element._type,
          colors: element.colors || null,
          label: element.label,
          labelIsVisible: element.labelIsVisible,
          latex,
          subType
        };
        if (type === CONSTANT.TOOLS.AREA) {
          acc[id].points = points;
        } else if (type === CONSTANT.TOOLS.POINT || type === CONSTANT.TOOLS.ANNOTATION) {
          acc[id].x = element.x;
          acc[id].y = element.y;
          if (type === CONSTANT.TOOLS.POINT) {
            acc[id].pointIsVisible = element.pointIsVisible;
            acc[id].labelIsVisible = element.labelIsVisible;
          }
        } else {
          acc[id].points = getPointsFromFlatConfig(type, element.subElementsIds, config);
        }
      }
      return acc;
    }, {})
  );
}

export default getLineTypeByProp;

/**
 * Returns array of ticks
 * @param {object} axis - jsxgraph axis object with special ticks
 * @return {array} array of number(s)
 * */
function getSpecialTicks(axis) {
  const ticks = axis.ticks.filter(t => t.fixedTicks !== null);
  let fixedTicks = [];
  ticks.forEach(t => {
    fixedTicks = fixedTicks.concat(t.fixedTicks);
  });
  return fixedTicks;
}

/**
 * Returns closest number from array "ticks" to given number "pointX"
 * @param {number} pointX - any number
 * @param {object} axis - jsxgraph axis object with special ticks
 * */
export function getClosestTick(pointX, axis) {
  const ticks = getSpecialTicks(axis);

  function dist(x, t) {
    return Math.abs(x - t);
  }

  let minDist = dist(pointX, ticks[0]);
  let closestTick = ticks[0];
  for (let i = 1; i < ticks.length; i++) {
    const tmpDist = dist(pointX, ticks[i]);
    if (tmpDist < minDist) {
      minDist = tmpDist;
      closestTick = ticks[i];
    }
  }
  return closestTick;
}

export function getAvailablePositions(board, element, isStacked) {
  const result = [{ start: board.numberlineAxis.point1.X() }];

  if (!isStacked) {
    const otherElements = element !== null ? board.elements.filter(item => item.id !== element.id) : board.elements;

    const notAvailablePositions = otherElements
      .map(item =>
        item.elType === "point"
          ? item.X()
          : item.point1.X() < item.point2.X()
          ? [item.point1.X(), item.point2.X()]
          : [item.point2.X(), item.point1.X()]
      )
      .sort((a, b) => {
        const val1 = Array.isArray(a) ? a[0] : a;
        const val2 = Array.isArray(b) ? b[0] : b;
        return val1 - val2;
      });

    notAvailablePositions.forEach((item, i) => {
      if (Array.isArray(item)) {
        result[i].end = item[0];
        result.push({ start: item[1] });
      } else {
        result[i].end = item;
        result.push({ start: item });
      }
    });
  }

  result[result.length - 1].end = board.numberlineAxis.point2.X();

  return result;
}

export function fixLatex(latex) {
  return latex
    .trim()
    .replace(/\\frac{([^}]+)}{([^}]+)}/g, "($1)/($2)") // fractions
    .replace(/\\left\(/g, "(") // open parenthesis
    .replace(/\\right\)/g, ")") // close parenthesis
    .replace(/\\cdot/g, "*")
    .replace(/[^\(](floor|ceil|(sin|cos|tan|sec|csc|cot)h?)\(([^\(\)]+)\)[^\)]/g, "($&)") // functions
    .replace(/([^(floor|ceil|(sin|cos|tan|sec|csc|cot)h?|\+|\-|\*|\/)])\(/g, "$1*(")
    .replace(/\)([\w])/g, ")*$1")
    .replace(/([0-9])([A-Za-z])/g, "$1*$2")
    .replace("\\", "");
}

export function isInPolygon(testPoint, vertices) {
  if (vertices.length < 3) {
    return false;
  }

  function isBetween(x, a, b) {
    return (x - a) * (x - b) < 0;
  }

  let result = false;
  let lastVertex = vertices[vertices.length - 1];
  vertices.forEach(vertex => {
    if (isBetween(testPoint.y, lastVertex.y, vertex.y)) {
      const t = (testPoint.y - lastVertex.y) / (vertex.y - lastVertex.y);
      const x = t * (vertex.x - lastVertex.x) + lastVertex.x;
      if (x >= testPoint.x) {
        result = !result;
      }
    } else {
      if (testPoint.y === lastVertex.y && testPoint.x < lastVertex.x && vertex.y > testPoint.y) {
        result = !result;
      }
      if (testPoint.y === vertex.y && testPoint.x < vertex.x && lastVertex.y > testPoint.y) {
        result = !result;
      }
    }
    lastVertex = vertex;
  });

  return result;
}

/**
 * usage:
 *    let gen = nameGenerator();
 *    gen.next().value  => 'A'
 *    gen.next().value  => 'B'
 *    ...
 *    gen.next().value  => 'AA'
 *    gen.next().value  => 'AB'
 * reset
 *    gen.next(true).value  => 'A'
 *    gen.next().value  => 'B'
 */
export function* nameGenerator() {
  const charCodes = [];
  const firstChar = "A";
  const lastChar = "Z";
  const firstCharCode = firstChar.charCodeAt(0);
  const lastCharCode = lastChar.charCodeAt(0);
  let reset = false;
  let tmpReset = false;

  while (true) {
    let index = charCodes.length - 1;
    let overflow = false;

    while (index >= -1) {
      if (index + 1 === charCodes.length || overflow) {
        overflow = false;
        if (charCodes[index] >= firstCharCode && charCodes[index] < lastCharCode) {
          charCodes[index]++;
        } else if (charCodes[index] === lastCharCode) {
          charCodes[index] = firstCharCode;
          overflow = true;
          if (index === 0) {
            charCodes.unshift(firstCharCode);
          }
        } else if (charCodes.length === 0) {
          charCodes.push(firstCharCode);
        }
      }

      --index;
    }
    reset = tmpReset;
    tmpReset = yield String.fromCharCode(...charCodes);
    if (reset) {
      charCodes.splice(0, charCodes.length);
      if (typeof reset === "string") {
        const code = reset.charCodeAt(0);
        if (code >= firstCharCode && code < lastCharCode) {
          charCodes.push(code);
        }
      }
      reset = false;
      tmpReset = false;
    }
  }
}

export function objectLabelComparator(a, b) {
  if (typeof a.label === "string" && typeof b.label === "string") {
    if (a.label.length > b.label.length) {
      return -1;
    }
    if (a.label.length < b.label.length) {
      return 1;
    }
  }
  if (a.label > b.label) {
    return -1;
  }
  if (a.label < b.label) {
    return 1;
  }
  return 0;
}
