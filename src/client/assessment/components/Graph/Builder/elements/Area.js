import JXG from "jsxgraph";
import { isEqual } from "lodash";
import { parse } from "mathjs";
import { Colors, CONSTANT } from "../config";
import { getLabelParameters } from "../settings";
import { fixLatex, isInPolygon, calcLineLatex } from "../utils";
import { jxgType as exponentJxgType } from "./Exponent";
import { jxgType as hyperbolaJxgType } from "./Hyperbola";
import { jxgType as logarithmJxgType } from "./Logarithm";
import { jxgType as parabolaJxgType } from "./Parabola";
import { jxgType as polynomJxgType } from "./Polynom";
import { jxgType as sinJxgType } from "./Sin";
import { jxgType as tangentJxgType } from "./Tangent";
import { jxgType as equationJxgType } from "./Equation";

const jxgType = 100;

function rnd(num) {
  return +num.toFixed(3);
}

function getAreaByPoint({ usrX, usrY }, [xMin, yMax, xMax, yMin], funcs) {
  const stepX = rnd(0.002 * Math.abs(xMax - xMin));
  const stepY = rnd(0.002 * Math.abs(yMax - yMin));

  function calc(x, y) {
    if (x < xMin - stepX || x > xMax + stepX || y < yMin - stepY || y > yMax + stepY) {
      return null;
    }
    return funcs.map(func => func(x, y));
  }

  const usrPointResult = calc(usrX, usrY);
  const x = usrX;
  let y = usrY;
  let pointResult = calc(x, y);
  // go down
  while (isEqual(pointResult, usrPointResult)) {
    y = rnd(y - stepY);
    pointResult = calc(x, y);
  }
  y = rnd(y + stepY);

  const startX = x;
  const startY = y;
  const areaPoints = [];
  areaPoints.push({ x: startX, y: startY });

  function getNextDirection(direction) {
    if (direction === "up") {
      return "right";
    }
    if (direction === "right") {
      return "down";
    }
    if (direction === "down") {
      return "left";
    }
    if (direction === "left") {
      return "up";
    }
  }

  function getPrevDirection(direction) {
    if (direction === "up") {
      return "left";
    }
    if (direction === "left") {
      return "down";
    }
    if (direction === "down") {
      return "right";
    }
    if (direction === "right") {
      return "up";
    }
  }

  function getNextPointByDirection(point, direction) {
    if (direction === "up") {
      return { x: point.x, y: rnd(point.y + stepY) };
    }
    if (direction === "left") {
      return { x: rnd(point.x - stepX), y: point.y };
    }
    if (direction === "down") {
      return { x: point.x, y: rnd(point.y - stepY) };
    }
    if (direction === "right") {
      return { x: rnd(point.x + stepX), y: point.y };
    }
  }

  let currentDirection = "down";
  let i = 0;
  // go about border by clockwise
  while (areaPoints[i].x !== startX || areaPoints[i].y !== startY || areaPoints.length === 1) {
    let point = getNextPointByDirection(areaPoints[i], currentDirection);
    let k = 0;
    while (!isEqual(calc(point.x, point.y), usrPointResult)) {
      currentDirection = getNextDirection(currentDirection);
      point = getNextPointByDirection(areaPoints[i], currentDirection);
      k++;
      // something wrong
      if (k === 5) {
        return;
      }
    }

    currentDirection = getPrevDirection(currentDirection);

    if (areaPoints[i - 1] && isEqual(areaPoints[i - 1], point)) {
      areaPoints.pop();
      i--;
    } else {
      areaPoints.push(point);
      i++;
    }

    // something wrong
    if (i === 100000) {
      return;
    }
  }

  const filteredAreaPoints = [];
  // filter points on line
  areaPoints.push(areaPoints[1]);
  for (let j = 1; j < areaPoints.length - 1; j++) {
    if (
      !(areaPoints[j - 1].x === areaPoints[j].x && areaPoints[j].x === areaPoints[j + 1].x) &&
      !(areaPoints[j - 1].y === areaPoints[j].y && areaPoints[j].y === areaPoints[j + 1].y)
    ) {
      filteredAreaPoints.push(areaPoints[j]);
    }
  }

  const isTurnRight = (p, p1, p2, p3) =>
    (p1.x === p2.x && p.x > p1.x && p3.x > p2.x && p.y === p1.y && p2.y === p3.y && p.x > p2.x && p.y < p2.y) ||
    (p1.y === p2.y && p.y < p1.y && p3.y < p2.y && p.x === p1.x && p2.x === p3.x && p.x < p2.x && p.y < p2.y) ||
    (p1.x === p2.x && p.x < p1.x && p3.x < p2.x && p.y === p1.y && p2.y === p3.y && p.x < p2.x && p.y > p2.y) ||
    (p1.y === p2.y && p.y > p1.y && p3.y > p2.y && p.x === p1.x && p2.x === p3.x && p.x > p2.x && p.y > p2.y);

  const isTurnLeft = (p, p1, p2, p3) =>
    (p1.x === p2.x && p.x > p1.x && p3.x > p2.x && p.y === p1.y && p2.y === p3.y && p.x > p2.x && p.y > p2.y) ||
    (p1.y === p2.y && p.y < p1.y && p3.y < p2.y && p.x === p1.x && p2.x === p3.x && p.x > p2.x && p.y < p2.y) ||
    (p1.x === p2.x && p.x < p1.x && p3.x < p2.x && p.y === p1.y && p2.y === p3.y && p.x < p2.x && p.y < p2.y) ||
    (p1.y === p2.y && p.y > p1.y && p3.y > p2.y && p.x === p1.x && p2.x === p3.x && p.x < p2.x && p.y > p2.y);

  // find indexes of turn points
  const turnIndexes = [];
  filteredAreaPoints.push(filteredAreaPoints[0]);
  filteredAreaPoints.push(filteredAreaPoints[1]);
  filteredAreaPoints.push(filteredAreaPoints[2]);
  for (let j = 0; j < filteredAreaPoints.length - 3; j++) {
    if (
      isTurnLeft(filteredAreaPoints[j], filteredAreaPoints[j + 1], filteredAreaPoints[j + 2], filteredAreaPoints[j + 3])
    ) {
      turnIndexes.push(j);
      turnIndexes.push(j + 1);
      turnIndexes.push(j + 2);
      turnIndexes.push(j + 3);
    } else if (
      isTurnRight(
        filteredAreaPoints[j],
        filteredAreaPoints[j + 1],
        filteredAreaPoints[j + 2],
        filteredAreaPoints[j + 3]
      )
    ) {
      turnIndexes.push(j + 1);
      turnIndexes.push(j + 2);
    }
  }
  filteredAreaPoints.pop();
  filteredAreaPoints.pop();
  filteredAreaPoints.pop();
  if (turnIndexes.includes(filteredAreaPoints.length)) {
    turnIndexes.push(0);
  }
  if (turnIndexes.includes(filteredAreaPoints.length + 1)) {
    turnIndexes.push(1);
  }
  if (turnIndexes.includes(filteredAreaPoints.length + 2)) {
    turnIndexes.push(2);
  }

  const smoothedAreaPoints = [];
  let lastAdded = false;
  for (let j = 0; j < filteredAreaPoints.length; j++) {
    if (turnIndexes.includes(j)) {
      smoothedAreaPoints.push(filteredAreaPoints[j]);
      lastAdded = true;
      continue;
    }
    if (lastAdded) {
      lastAdded = false;
      continue;
    }
    smoothedAreaPoints.push(filteredAreaPoints[j]);
    lastAdded = true;
  }

  const resultAreaPoints = [];
  resultAreaPoints.push(smoothedAreaPoints[0]);
  for (let j = 1; j < smoothedAreaPoints.length - 1; j++) {
    const x1 = smoothedAreaPoints[j].x;
    const x2 = smoothedAreaPoints[j - 1].x;
    const x3 = smoothedAreaPoints[j + 1].x;
    const y1 = smoothedAreaPoints[j].y;
    const y2 = smoothedAreaPoints[j - 1].y;
    const y3 = smoothedAreaPoints[j + 1].y;
    const left = (y1 - y2) / (x1 - x2);
    const right = (y1 - y3) / (x1 - x3);
    if (rnd(left) !== rnd(right)) {
      resultAreaPoints.push(smoothedAreaPoints[j]);
    }
  }
  resultAreaPoints.push(smoothedAreaPoints[smoothedAreaPoints.length - 1]);

  return resultAreaPoints;
}

function renderElement(board, el, attrs = {}) {
  const newElement = board.$board.create("polygon", el.points.map(p => [p.x, p.y]), {
    ...Colors.default[CONSTANT.TOOLS.AREA],
    ...attrs,
    label: getLabelParameters(jxgType),
    hasInnerPoints: false,
    highlighted: false,
    withLines: false,
    vertices: {
      visible: false
    },
    fixed: true
  });
  newElement.type = jxgType;
  newElement.pointCoords = el.points;
  return newElement;
}

function onHandler() {
  return (board, event) => {
    const coords = board.getCoords(event);
    const usrX = rnd(coords.usrCoords[1]);
    const usrY = rnd(coords.usrCoords[2]);

    if (board.elements.findIndex(el => el.type === jxgType && isInPolygon({ x: usrX, y: usrY }, el.pointCoords)) > -1) {
      return;
    }

    const availableTypes = [
      JXG.OBJECT_TYPE_CIRCLE,
      JXG.OBJECT_TYPE_CONIC,
      JXG.OBJECT_TYPE_LINE,
      JXG.OBJECT_TYPE_POLYGON,
      exponentJxgType,
      hyperbolaJxgType,
      logarithmJxgType,
      parabolaJxgType,
      polynomJxgType,
      sinJxgType,
      tangentJxgType,
      equationJxgType
    ];

    const funcs = board.elements
      .filter(el => availableTypes.includes(el.type) && !el.latexIsBroken)
      .map(item => {
        if (item.latex) {
          const func = parse(item.fixedLatex.latexFunc);
          return (x, y) => func.eval({ x, y }) > 0;
        }

        switch (item.type) {
          case JXG.OBJECT_TYPE_CIRCLE:
            return () => true;
          case JXG.OBJECT_TYPE_CONIC:
            return () => true;
          case JXG.OBJECT_TYPE_LINE: {
            const lineLatex = calcLineLatex(
              { x: item.point1.X(), y: item.point1.Y() },
              { x: item.point2.X(), y: item.point2.Y() }
            );
            const fixedLatex = fixLatex(lineLatex);
            const func = parse(fixedLatex.latexFunc);
            return (x, y) => func.eval({ x, y }) > 0;
          }
          case JXG.OBJECT_TYPE_POLYGON: {
            const vertices = Object.values(item.ancestors).map(anc => ({ x: anc.X(), y: anc.Y() }));
            return (x, y) => isInPolygon({ x, y }, vertices);
          }
          case exponentJxgType:
            return () => true;
          case hyperbolaJxgType:
            return () => true;
          case logarithmJxgType:
            return () => true;
          case parabolaJxgType:
            return () => true;
          case polynomJxgType:
            return () => true;
          case sinJxgType:
            return () => true;
          case tangentJxgType:
            return () => true;
          default:
            return () => true;
        }
      });

    const points = getAreaByPoint({ usrX, usrY }, board.$board.getBoundingBox(), funcs);

    return renderElement(board, { points });
  };
}

function getConfig(area) {
  return {
    _type: area.type,
    type: CONSTANT.TOOLS.AREA,
    id: area.id,
    label: area.labelHTML || false,
    points: area.pointCoords
  };
}

function setAreasForEquations(board) {
  // console.log('start calc');
  // find inequalities
  const inequalities = board.elements.filter(
    el => el.type === equationJxgType && !el.latexIsBroken && el.fixedLatex.compSign !== "="
  );
  if (inequalities.length === 0) {
    return;
  }

  // set funcs for calculating
  const funcs = inequalities.map(el => {
    const func = parse(el.fixedLatex.latexFunc);
    if (el.fixedLatex.compSign === ">" || el.fixedLatex.compSign === ">=") {
      return (x, y) => func.eval({ x, y }) > 0;
    }
    return (x, y) => func.eval({ x, y }) < 0;
  });

  // add common shaded areas
  const areas = [];
  const [xMin, yMax, xMax, yMin] = board.$board.getBoundingBox();
  const stepX = (xMax - xMin) / 50;
  const stepY = (yMax - yMin) / 50;
  for (let x = rnd(xMin + stepX); x < xMax; x = rnd(x + stepX)) {
    for (let y = rnd(yMin + stepY); y < yMax; y = rnd(y + stepY)) {
      if (!isEqual(funcs.map(func => func(x, y)), funcs.map(() => true))) {
        continue;
      }

      let areaIsExist = false;
      for (let i = 0; i < areas.length; i++) {
        if (isInPolygon({ x, y }, areas[i])) {
          areaIsExist = true;
          break;
        }
      }
      if (areaIsExist) {
        continue;
      }

      const points = getAreaByPoint({ usrX: x, usrY: y }, [xMin, yMax, xMax, yMin], funcs);
      if (points) {
        areas.push(points);
      }
    }
  }

  // console.log('start rendering');
  const areaElements = areas.map(points => renderElement(board, { points }));
  inequalities[0].addParents(areaElements);
  // console.log('end rendering');
}

export default {
  onHandler,
  getConfig,
  renderElement,
  setAreasForEquations
};
