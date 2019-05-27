import JXG from "jsxgraph";
import { parse, derivative } from "mathjs";
import { CONSTANT, Colors } from "../config";
import { defaultPointParameters, getLabelParameters } from "../settings";
import { Point } from ".";
import { fixLatex, getPropsByLineType, handleSnap } from "../utils";

const jxgType = 98;

const defaultConfig = {
  fixed: null
};

function isLine(xMin, xMax, equationLeft, equationRight) {
  // check vertical line
  if (equationLeft === "x" && !Number.isNaN(Number.parseFloat(equationRight))) {
    return true;
  }

  // check horizontal line
  if (equationLeft === "y" && !Number.isNaN(Number.parseFloat(equationRight))) {
    return true;
  }

  const func = parse(equationRight);
  const step = (xMax - xMin) / 5;
  for (let i = 0; i < 3; i++) {
    const x1 = xMin + step * i;
    const x2 = xMin + step * (i + 1);
    const x3 = xMin + step * (i + 2);
    const y1 = func.eval({ x: x1 });
    const y2 = func.eval({ x: x2 });
    const y3 = func.eval({ x: x3 });
    const left = (y1 - y2) / (x1 - x2);
    const right = (y1 - y3) / (x1 - x3);
    if (left.toFixed(3) !== right.toFixed(3)) {
      return false;
    }
  }
  return true;
}

function isParabola(equationRight) {
  return (
    (equationRight.match(/x/gi) || []).length === 1 &&
    equationRight.match(/(\([0-9\+\-\*\.]*x[0-9\+\-\*\.]*\)\^2)|(x\^2)/gi)
  );
}

function calculateNewLineLatex(line, points) {
  return () => {
    const x1 = points[0].coords.usrCoords[1];
    const y1 = points[0].coords.usrCoords[2];
    const x2 = points[1].coords.usrCoords[1];
    const y2 = points[1].coords.usrCoords[2];

    // vertical line
    if (x1 === x2) {
      line.latex = `x=${x1}`;
      return;
    }

    const a = (y2 - y1) / (x2 - x1);
    const c = (x2 * y1 - x1 * y2) / (x2 - x1);
    const part1 = a === 1 ? "x" : a === 0 ? "" : `${a}x`;
    const part2 = c === 0 ? "" : c > 0 && part1.length !== 0 ? `+${c}` : c;

    const right = `${part1}${part2}`;
    line.latex = `y=${right.length !== 0 ? right : 0}`;
  };
}

function calculateNewParabolaLatex(line, points) {
  return () => {
    const x1 = points[0].coords.usrCoords[1];
    const y1 = points[0].coords.usrCoords[2];
    const x2 = points[1].coords.usrCoords[1];
    const y2 = points[1].coords.usrCoords[2];

    if (x1 === x2) {
      line.latex = "error";
      return;
    }

    const koefX = (y2 - y1) / (x2 - x1) ** 2;
    const base = x1 === 0 ? "x" : Math.sign(x1) > 0 ? `(x-${Math.abs(x1)})` : `(x+${Math.abs(x1)})`;
    const offsetAbs = Math.abs(y1);
    const offsetSign = Math.sign(y1) < 0 ? "-" : Math.sign(y1) > 0 ? "+" : "";

    line.latex =
      koefX === 0
        ? `y=${offsetSign === "+" ? "" : offsetSign}${offsetAbs}`
        : `y=${koefX === 1 ? "" : koefX === -1 ? "-" : koefX}${base}^2${offsetSign}${offsetAbs === 0 ? "" : offsetAbs}`;
  };
}

function createPoint(board, coords, params) {
  return board.$board.create("point", coords, {
    ...(board.getParameters(CONSTANT.TOOLS.POINT) || defaultPointParameters()),
    ...Colors.default[CONSTANT.TOOLS.POINT],
    ...params,
    fillColor: params.strokeColor,
    highlightFillColor: params.highlightStrokeColor,
    label: getLabelParameters(JXG.OBJECT_TYPE_POINT),
    fixed: params.fixed === null ? false : params.fixed
  });
}

function createLine(board, points, params) {
  const newLine = board.$board.create("line", points, {
    ...getPropsByLineType(CONSTANT.TOOLS.LINE),
    ...Colors.default[CONSTANT.TOOLS.EQUATION],
    ...params,
    label: getLabelParameters(JXG.OBJECT_TYPE_LINE),
    fixed: params.fixed === null ? false : params.fixed
  });

  handleSnap(
    newLine,
    Object.values(newLine.ancestors),
    board,
    calculateNewLineLatex(newLine, Object.values(newLine.ancestors))
  );

  return newLine;
}

function createParabola(board, points, params) {
  const makeCallback = (p1, p2) => x => {
    const a = (1 / (p2.X() - p1.X()) ** 2) * (p2.Y() - p1.Y());
    return a * (x - p1.X()) ** 2 + p1.Y();
  };

  const newLine = board.$board.create("functiongraph", [makeCallback(...points)], {
    ...Colors.default[CONSTANT.TOOLS.EQUATION],
    ...params,
    label: getLabelParameters(97),
    fixed: params.fixed === null ? false : params.fixed
  });

  newLine.addParents(points);
  newLine.ancestors = {
    [points[0].id]: points[0],
    [points[1].id]: points[1]
  };

  handleSnap(
    newLine,
    Object.values(newLine.ancestors),
    board,
    calculateNewParabolaLatex(newLine, Object.values(newLine.ancestors))
  );

  return newLine;
}

function findLinePointsCoords(gridParams, equationLeft, equationRight) {
  const { xMin, yMax, xMax, yMin, stepX, stepY } = gridParams;

  const rightNumber = Number.parseFloat(equationRight);
  // vertical line
  if (equationLeft === "x" && !Number.isNaN(rightNumber) && rightNumber % stepX === 0) {
    return [[rightNumber, yMin + stepY], [rightNumber, yMax - stepY]];
  }
  // horizontal line
  if (equationLeft === "y" && !Number.isNaN(rightNumber) && rightNumber % stepY === 0) {
    return [[xMin + stepX, rightNumber], [xMax - stepX, rightNumber]];
  }

  const func = parse(equationRight);
  const result = [];

  let x = xMin + stepX;
  while (x < xMax) {
    const y = func.eval({ x });
    if (y < yMax && y > yMin && y % stepY === 0) {
      result.push([x, y]);
      break;
    }
    x += stepX;
  }

  x = xMax - stepX;
  while (x > xMin) {
    const y = func.eval({ x });
    if (y < yMax && y > yMin && y % stepY === 0) {
      result.push([x, y]);
      break;
    }
    x -= stepX;
  }

  return result;
}

function findParabolaPointsCoords(gridParams, equationRight) {
  const { xMin, yMax, xMax, yMin, stepX, stepY } = gridParams;

  const func = parse(equationRight);
  const deriv = derivative(equationRight, "x");
  const result = [];

  let x = xMin + stepX;
  while (x < xMax) {
    if (deriv.eval({ x }) === 0) {
      break;
    }
    x += stepX;
  }

  let y = func.eval({ x });

  if (y > yMax || y < yMin || y % stepY !== 0) {
    return result;
  }

  result.push([x, y]);

  x += stepX;
  while (x < xMax) {
    y = func.eval({ x });
    if (y < yMax && y > yMin && y % stepY === 0) {
      result.push([x, y]);
      return result;
    }
    x += stepX;
  }

  [[x]] = result;
  x -= stepX;
  while (x > xMin) {
    y = func.eval({ x });
    if (y < yMax && y > yMin && y % stepY === 0) {
      result.push([x, y]);
      return result;
    }
    x -= stepX;
  }

  return result;
}

function getGridParams(board) {
  const stepX = +board.parameters.pointParameters.snapSizeX;
  const stepY = +board.parameters.pointParameters.snapSizeY;
  let [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox();
  xMin -= +(xMin % stepX).toFixed(8);
  xMax -= +(xMax % stepX).toFixed(8);
  yMin -= +(yMin % stepY).toFixed(8);
  yMax -= +(yMax % stepY).toFixed(8);
  return { xMin, xMax, yMin, yMax, stepX, stepY };
}

function renderElement(board, element, points, params) {
  const { latex } = element;
  let { subType } = element;

  const elementWithErrorLatex = {
    type: jxgType,
    id: element.id,
    latex: element.latex,
    labelHTML: element.label,
    subType: null,
    latexIsBroken: true
  };

  const splitLatex = latex.split("=");
  if (splitLatex.length !== 2) {
    return elementWithErrorLatex;
  }

  const equationLeft = splitLatex[0];
  const equationRight = fixLatex(splitLatex[1]);
  if ((equationLeft !== "x" && equationLeft !== "y") || !equationRight) {
    return elementWithErrorLatex;
  }

  let line = null;

  if (points) {
    switch (subType) {
      case CONSTANT.TOOLS.LINE:
        line = createLine(board, points, params);
        break;
      case CONSTANT.TOOLS.PARABOLA:
        line = createParabola(board, points, params);
        break;
      default:
        break;
    }
  }

  if (!line) {
    try {
      const gridParams = getGridParams(board);

      if (isParabola(equationRight)) {
        const coords = findParabolaPointsCoords(gridParams, equationRight);
        if (coords.length === 2) {
          const point1 = createPoint(board, coords[0], params);
          const point2 = createPoint(board, coords[1], params);
          line = createParabola(board, [point1, point2], params);
          subType = CONSTANT.TOOLS.PARABOLA;
        }
      } else if (isLine(gridParams.xMin, gridParams.xMax, equationLeft, equationRight)) {
        const coords = findLinePointsCoords(gridParams, equationLeft, equationRight);
        if (coords.length === 2) {
          const point1 = createPoint(board, coords[0], params);
          const point2 = createPoint(board, coords[1], params);
          line = createLine(board, [point1, point2], params);
          subType = CONSTANT.TOOLS.LINE;
        }
      }
    } catch (e) {
      return elementWithErrorLatex;
    }
  }

  if (!line) {
    try {
      line = board.$board.create("functiongraph", [equationRight], {
        ...Colors.default[CONSTANT.TOOLS.EQUATION],
        ...params,
        fixed: true
      });
      subType = null;
    } catch (e) {
      return elementWithErrorLatex;
    }
  }

  if (line) {
    line.latex = element.latex;
    line.type = jxgType;
    line.subType = subType;
    return line;
  }

  return elementWithErrorLatex;
}

function getConfig(equation) {
  let points = null;
  if (equation.ancestors && Object.keys(equation.ancestors).length > 0) {
    points = Object.keys(equation.ancestors)
      .sort()
      .map(n => Point.getConfig(equation.ancestors[n]));
  }

  return {
    _type: equation.type,
    type: CONSTANT.TOOLS.EQUATION,
    id: equation.id,
    latex: equation.latex,
    label: equation.labelHTML || false,
    subType: equation.subType,
    points
  };
}

function parseConfig() {
  return {
    ...defaultConfig,
    label: getLabelParameters(jxgType)
  };
}

export default {
  getConfig,
  parseConfig,
  renderElement
};
