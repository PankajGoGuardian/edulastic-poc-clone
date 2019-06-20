import JXG from "jsxgraph";
import { union, isString, uniq } from "lodash";
import { calcMeasure } from "../utils";
import { RENDERING_BASE } from "../config/constants";
import { getFraction, toFractionHTML, roundFracIfPossible } from "../fraction";

import "../../common/Fraction.css";

const LABEL_ROUNDING_FACTOR = 100;
const TICK_ROUNDING_FACTOR = 100000;

function createMinorTicks(minorCount, majorTicksSorted) {
  const minorTicks = [];
  const segmentsCount = majorTicksSorted.length - 1;
  for (let i = 0; i < segmentsCount; i++) {
    let a = majorTicksSorted[i];
    const b = majorTicksSorted[i + 1];
    const seg = Math.abs(a - b);
    const dist = seg / (minorCount + 1);
    for (let j = 0; j < minorCount; j++) {
      a += dist;
      minorTicks.push(a);
    }
  }
  return minorTicks;
}

const onHandler = board => {
  const {
    numberlineAxis: {
      showMin,
      showMax,
      leftArrow,
      rightArrow,
      ticksDistance,
      renderingBase,
      showTicks,
      specificPoints,
      fontSize,
      fractionsFormat,
      showLabels,
      labelShowMax,
      labelShowMin,
      minorTicks,
      labelsFrequency
    },
    canvas: { xMin, xMax, yMax },
    layout: { linePosition, width }
  } = board.numberlineSettings;

  if (width < 10) {
    return;
  }

  const [, y] = calcMeasure(board.$board.canvasWidth, board.$board.canvasHeight, board);
  const calcY = yMax - (y / 100) * linePosition;
  const axisPadding = ((-xMin + xMax) / 100) * 3.5;

  const newAxis = board.$board.create(
    "axis",
    [
      [showMin ? xMin - axisPadding : xMin + axisPadding, calcY],
      [showMax ? xMax + axisPadding : xMax - axisPadding, calcY]
    ],
    {
      straightFirst: false,
      straightLast: false,
      firstArrow: leftArrow === true ? { size: 10 } : false,
      lastArrow: rightArrow === true ? { size: 10 } : false,
      strokeColor: "#d6d6d6",
      highlightStrokeColor: "#d6d6d6"
    }
  );

  newAxis.point1.coords.setCoordinates(JXG.COORDS_BY_SCREEN, newAxis.point1.coords.scrCoords);
  newAxis.point2.coords.setCoordinates(JXG.COORDS_BY_SCREEN, newAxis.point2.coords.scrCoords);

  let _ticksDistance = ticksDistance;
  let fracTicksDistance = null;
  if (isString(_ticksDistance) && _ticksDistance.indexOf("/") !== -1) {
    fracTicksDistance = getFraction(_ticksDistance);
    _ticksDistance = fracTicksDistance ? fracTicksDistance.decim : NaN;
  } else {
    _ticksDistance = parseFloat(ticksDistance);
  }

  newAxis.removeAllTicks();
  /**
   * Major ticks
   * */
  let ticks = [];
  if (_ticksDistance === 0) {
    ticks.push(xMin);
    ticks.push(xMax);
  } else if (renderingBase === RENDERING_BASE.ZERO_BASED) {
    ticks.push(xMin);
    let startPoint = 0;
    if (xMin > 0) {
      startPoint = xMin;
      let i = startPoint;
      while (i < xMax) {
        ticks.push(i);
        i += _ticksDistance;
      }
    } else if (xMax < 0) {
      do {
        startPoint -= _ticksDistance;
      } while (startPoint > xMax);

      let i = startPoint;
      while (i > xMin) {
        ticks.push(i);
        i -= _ticksDistance;
      }
    } else {
      // startPoint === 0
      let i = startPoint;
      while (i < xMax) {
        ticks.push(i);
        i += _ticksDistance;
      }
      i = startPoint;
      i -= _ticksDistance;
      while (i > xMin) {
        ticks.push(i);
        i -= _ticksDistance;
      }
    }
    ticks.push(xMax);
  } else if (renderingBase === RENDERING_BASE.LINE_MINIMUM_VALUE) {
    let i = xMin;
    while (i < xMax) {
      ticks.push(i);
      i += _ticksDistance;
    }
    ticks.push(xMax);
  }

  ticks.forEach((val, index) => {
    ticks[index] = Math.round(val * TICK_ROUNDING_FACTOR) / TICK_ROUNDING_FACTOR;
  });

  /**
   * Minor ticks
   * */
  if (minorTicks) {
    const minors = createMinorTicks(minorTicks, ticks.sort((a, b) => a - b));
    board.$board.create("ticks", [newAxis, minors], {
      strokeColor: "#d6d6d6",
      highlightStrokeColor: "#d6d6d6",
      majorHeight: 10,
      visible: showTicks
    });
  }
  /**
   * Specific points
   * */
  if (isString(specificPoints)) {
    const tickArr = specificPoints
      .split(",")
      .map(s => parseFloat(s))
      .filter(num => !Number.isNaN(num));
    ticks = union(ticks, tickArr);
  }

  /**
   * Ticks labels
   * */
  let labels = ticks.map(t => {
    if (showLabels) {
      let res = null;
      if (Number.isInteger(t)) {
        res = t;
      } else if (t >= 0) {
        res = Math.round(t * LABEL_ROUNDING_FACTOR) / LABEL_ROUNDING_FACTOR;
      } else {
        res = Math.ceil(t * LABEL_ROUNDING_FACTOR) / LABEL_ROUNDING_FACTOR;
      }
      return res;
    }

    const tickArr = specificPoints
      .split(",")
      .map(s => parseFloat(s))
      .filter(num => !Number.isNaN(num));
    if (t === xMin || t === xMax || tickArr.some(specTick => specTick === t)) {
      let res = null;
      if (Number.isInteger(t)) {
        res = t;
      } else if (t >= 0) {
        res = Math.round(t * LABEL_ROUNDING_FACTOR) / LABEL_ROUNDING_FACTOR;
      } else {
        res = Math.ceil(t * LABEL_ROUNDING_FACTOR) / LABEL_ROUNDING_FACTOR;
      }
      return res;
    }

    return "";
  });

  if (fracTicksDistance) {
    // round nums to remove dublicates
    ticks = ticks.map(t => roundFracIfPossible(t, fracTicksDistance.denominator));
    ticks = uniq(ticks);

    labels = labels.map(t => toFractionHTML(t, fracTicksDistance.denominator, fractionsFormat));
  }

  if (labelsFrequency) {
    labels.forEach((label, index) => {
      if (index % labelsFrequency === 0) {
      } else if (index !== 0 && index !== labels.length - 1) {
        labels[index] = "";
      }
    });
  }

  board.$board.create("ticks", [newAxis, ticks], {
    strokeColor: "#d6d6d6",
    highlightStrokeColor: "#d6d6d6",
    visible: showTicks,
    anchor: "middle",
    insertTicks: false,
    tickEndings: [1, 1],
    majorHeight: 25,
    drawLabels: true,
    _ticksDistance,
    label: {
      offset: [0, -15],
      anchorX: "middle",
      anchorY: "top",
      fontSize,
      display: "html",
      cssClass: "numberline-fraction",
      highlightCssClass: "numberline-fraction"
    },
    labels
  });

  if (!showLabels) {
    newAxis.ticks[1].labels.forEach((label, index) => {
      if (parseInt(label.htmlStr, 10) === 0 && index !== 0) {
        board.$board.removeObject(newAxis.ticks[1].labels[index]);
      }
    });
  }

  if (!labelShowMin) {
    newAxis.ticks[1].labels.forEach((label, index) => {
      let compareValue = label.htmlStr;

      if (compareValue[0] === "−") {
        compareValue = "-" + compareValue.substr(1, compareValue.length - 1);
      }

      if (parseInt(compareValue, 10) === xMin) {
        board.$board.removeObject(newAxis.ticks[1].labels[index]);
      }
    });
  }

  if (!labelShowMax) {
    newAxis.ticks[1].labels.forEach((label, index) => {
      let compareValue = label.htmlStr;

      if (compareValue[0] === "−") {
        compareValue = "-" + compareValue.substr(1, compareValue.length - 1);
      }

      if (parseInt(compareValue, 10) === xMax) {
        board.$board.removeObject(newAxis.ticks[1].labels[index]);
      }
    });
  }

  return newAxis;
};

const updateCoords = board => {
  board.$board.removeObject(board.numberlineAxis);
  board.numberlineAxis = onHandler(board);
};

export default {
  onHandler,
  updateCoords
};
