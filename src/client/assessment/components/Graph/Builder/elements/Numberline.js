import JXG from "jsxgraph";
import { union, isString } from "lodash";
import { calcMeasure, toFractionHTML, checkOrientation } from "../utils";
import { RENDERING_BASE } from "../config/constants";
import { Colors } from "../config";

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

  if (width < 10 || Number.isNaN(ticksDistance)) {
    return;
  }

  const isVertical = checkOrientation(board);
  const [, y] = calcMeasure(board.$board.canvasWidth, board.$board.canvasHeight, board);
  const calcY = yMax - (y / 100) * linePosition;
  const axisPadding = ((-xMin + xMax) / 100) * 5;

  const x1 = showMin ? xMin - axisPadding : xMin + axisPadding;
  const x2 = showMax ? xMax + axisPadding : xMax - axisPadding;
  const newAxis = board.$board.create(
    "axis",
    [[isVertical ? calcY : x1, isVertical ? x1 : calcY], [isVertical ? calcY : x2, isVertical ? x2 : calcY]],
    {
      straightFirst: false,
      straightLast: false,
      firstArrow: leftArrow === true ? { size: 8 } : false,
      lastArrow: rightArrow === true ? { size: 8 } : false,
      ...Colors.numberline
    }
  );

  newAxis.point1.coords.setCoordinates(JXG.COORDS_BY_SCREEN, newAxis.point1.coords.scrCoords);
  newAxis.point2.coords.setCoordinates(JXG.COORDS_BY_SCREEN, newAxis.point2.coords.scrCoords);

  newAxis.removeAllTicks();
  /**
   * Major ticks
   * */
  let ticks = [];
  if (ticksDistance === 0) {
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
        i += ticksDistance;
      }
    } else if (xMax < 0) {
      do {
        startPoint -= ticksDistance;
      } while (startPoint > xMax);

      let i = startPoint;
      while (i > xMin) {
        ticks.push(i);
        i -= ticksDistance;
      }
    } else {
      // startPoint === 0
      let i = startPoint;
      while (i < xMax) {
        ticks.push(i);
        i += ticksDistance;
      }
      i = startPoint;
      i -= ticksDistance;
      while (i > xMin) {
        ticks.push(i);
        i -= ticksDistance;
      }
    }
    ticks.push(xMax);
  } else if (renderingBase === RENDERING_BASE.LINE_MINIMUM_VALUE) {
    let i = xMin;
    while (i < xMax) {
      ticks.push(i);
      i += ticksDistance;
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
      ...Colors.minorTick,
      majorHeight: 10,
      visible: showTicks
    });
  }
  /**
   * Specific points
   * */
  const specificTicks = isString(specificPoints)
    ? specificPoints
        .split(",")
        .map(s => parseFloat(s))
        .filter(num => !Number.isNaN(num))
    : [];

  ticks = union(ticks, specificTicks);
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

  /**
   * Show Ticks based on showTicks, showMax, and showMin
   */
  if (!showTicks) {
    const firstTick = ticks[0];
    const lastTick = ticks[ticks.length - 1];
    const firstTickLabel = labels[0];
    const lastTickLable = labels[labels.length - 1];

    ticks = [];
    labels = [];

    if (showMin) {
      ticks.push(firstTick);
      if (labelShowMin) {
        labels.push(firstTickLabel);
      }
    }
    if (showMax) {
      ticks.push(lastTick);
      if (labelShowMax) {
        labels.push(lastTickLable);
      }
    }
  }

  if (!showLabels) {
    labels = labels.map((item, index) => {
      if (item === 0 && index !== 0 && !specificTicks.includes(item)) {
        return "";
      }
      return item;
    });
  }

  if (labelsFrequency) {
    labels = labels.map((item, index) => {
      if (index % labelsFrequency === 0 || specificTicks.includes(item)) {
        //
      } else if (index !== 0 && index !== labels.length - 1) {
        return "";
      }
      return item;
    });
  }

  if (!labelShowMin) {
    const item = labels[0];
    if (item === xMin && !specificTicks.includes(item)) {
      labels[0] = "";
    }
  }

  if (!labelShowMax) {
    const item = labels[labels.length - 1];
    if (item === xMax && !specificTicks.includes(item)) {
      labels[labels.length - 1] = "";
    }
  }

  board.$board.create("ticks", [newAxis, ticks], {
    ...Colors.majorTick,
    visible: true,
    anchor: "middle",
    insertTicks: false,
    tickEndings: [1, 1],
    drawLabels: true,
    ticksDistance,
    label: {
      offset: isVertical ? [-20, parseInt(fontSize, 10) / 2] : [0, -15],
      anchorX: "middle",
      anchorY: "top",
      fontSize,
      display: "html",
      cssClass: "numberline-fraction",
      highlightCssClass: "numberline-fraction"
    },
    generateLabelText(a, b, label) {
      return toFractionHTML(label, fractionsFormat);
    },
    labels
  });

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
