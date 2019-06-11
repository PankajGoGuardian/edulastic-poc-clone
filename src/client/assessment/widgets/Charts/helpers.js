import { SHOW_GRIDLINES_BOTH, SHOW_GRIDLINES_X_ONLY, SHOW_GRIDLINES_Y_ONLY } from "./const";

export const getYAxis = (yAxisMax, yAxisMin, stepSize) =>
  Array.from({ length: (yAxisMax - yAxisMin) / stepSize + 1 }, (v, k) => +(yAxisMin + k * stepSize).toFixed(2));

export const getPadding = yAxis => Math.max(...yAxis.map(val => val.toString().length)) * 10;

export const getStep = (data, width, margin, padding, isBar = false) => {
  let count = data && data.length > 1 ? data.length : 1;
  count = isBar ? count : count - 1;
  return (width - margin - padding) / count;
};

export const getGridVariables = (data, { width, height, margin, yAxisMax, yAxisMin, stepSize }, isBar = false) => {
  const yAxis = getYAxis(yAxisMax, yAxisMin, stepSize);
  const padding = getPadding(yAxis);
  const step = getStep(data, width, margin, padding, isBar);
  const yAxisStep =
    yAxisMax !== yAxisMin ? Math.abs((height - margin - padding) / (yAxisMax - yAxisMin)) : height - margin - padding;
  return { yAxis, padding, step, yAxisStep };
};

export const normalizeValue = (value, { yAxisMax, yAxisMin, snapTo }) => {
  const fixedSnapTo = snapTo <= 0 ? 1 : snapTo;
  const result = +(value - (value % fixedSnapTo)).toFixed(2);
  return result > yAxisMax ? yAxisMax : result < yAxisMin ? yAxisMin : result;
};

export const getReCalculatedPoints = (array, { yAxisMax, yAxisMin, snapTo }) =>
  array.map(dot => ({
    ...dot,
    y: normalizeValue(dot.y, { yAxisMax, yAxisMin, snapTo })
  }));

export const convertUnitToPx = (unit, { height, margin, yAxisMax, yAxisMin, stepSize }) => {
  const yAxis = getYAxis(yAxisMax, yAxisMin, stepSize);
  const padding = getPadding(yAxis);
  return height - margin - ((height - margin - padding) / (yAxisMax - yAxisMin)) * (unit - yAxisMin);
};

export const convertPxToUnit = (px, { height, margin, yAxisMax, yAxisMin, stepSize, snapTo }) => {
  const yAxis = getYAxis(yAxisMax, yAxisMin, stepSize);
  const padding = getPadding(yAxis);
  const result = ((height - margin - px) * (yAxisMax - yAxisMin)) / (height - margin - padding) + yAxisMin;
  return normalizeValue(result, { yAxisMax, yAxisMin, snapTo });
};

export const getFractionResult = (value, fractionFormat) => {
  const result = {
    main: null,
    sup: null,
    sub: null
  };

  const strValue = value.toString();
  const indexOfDot = strValue.indexOf(".");
  if (indexOfDot === -1) {
    result.main = value;
    return result;
  }

  const countDecimals = strValue.length - indexOfDot - 1;
  let sub = +`1${Array.from({ length: countDecimals }, () => 0).join("")}`;

  if (fractionFormat === "Fraction") {
    let sup = value * sub;
    while (sup % 5 === 0 && sub % 5 === 0) {
      sup /= 5;
      sub /= 5;
    }
    while (sup % 2 === 0 && sub % 2 === 0) {
      sup /= 2;
      sub /= 2;
    }
    result.sub = sub;
    result.sup = sup;
    return result;
  }

  if (fractionFormat === "MixedFraction") {
    const main = Math.trunc(value);
    let sup = (value * sub) % sub;
    while (sup % 5 === 0 && sub % 5 === 0) {
      sup /= 5;
      sub /= 5;
    }
    while (sup % 2 === 0 && sub % 2 === 0) {
      sup /= 2;
      sub /= 2;
    }
    if (main !== 0) {
      result.main = main;
    }
    result.sub = sub;
    result.sup = sup;
    return result;
  }

  result.main = value;
  return result;
};

export const displayVerticalLines = showGridlines =>
  showGridlines === SHOW_GRIDLINES_X_ONLY || showGridlines === SHOW_GRIDLINES_BOTH;
export const displayHorizontalLines = showGridlines =>
  showGridlines === SHOW_GRIDLINES_Y_ONLY || showGridlines === SHOW_GRIDLINES_BOTH;
