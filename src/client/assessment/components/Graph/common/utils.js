const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

export default {
  capitalizeFirstLetter
};

export const getAdjustedHeightAndWidth = (
  parentWidth,
  parentHeight,
  layout,
  MIN_WIDTH,
  MIN_HEIGHT,
  responseBoxPosition,
  responseBoxTitleWidth,
  disableResponse,
  delta = 20
) => {
  const obj = { width: parentWidth, height: layout.height };

  if (parentWidth < layout.width) {
    obj.width = Math.max(parentWidth, MIN_WIDTH);
  }

  if ((responseBoxPosition === "left" || responseBoxPosition === "right") && !disableResponse) {
    // delta is will be padding between container and choices
    obj.width -= responseBoxTitleWidth + delta;
  }

  // have coded the height part cuz I haven't investigated what the problem yet

  return obj;
};

export const getAdjustedV1AnnotationCoordinatesForRender = (adjustedHeightWidth, layout, annotation, v1Dimenstions) => {
  const { v1Height = 0, v1Width = 0 } = v1Dimenstions;

  const { position: coordinates, size } = annotation;

  const xPosPercentage = (coordinates.x / v1Width) * 100;
  const yPosPercentage = (coordinates.y / v1Height) * 100;

  const widthPercentage = (size.width / v1Width) * 100;
  const heightPercentage = (size.height / v1Height) * 100;

  const calcX = (xPosPercentage / 100) * adjustedHeightWidth.width;
  const calcY = (yPosPercentage / 100) * adjustedHeightWidth.height;

  const calcSizeWidth = (widthPercentage / 100) * adjustedHeightWidth.width;
  const calcSizeHeight = (heightPercentage / 100) * adjustedHeightWidth.height;

  return {
    x: Math.round(calcX),
    y: Math.round(calcY),
    width: calcSizeWidth,
    height: calcSizeHeight
  };
};

export const getAdjustedV1AnnotationCoordinatesForDB = (adjustedHeightWidth, layout, annotation, v1Dimenstions) => {
  const { v1Height, v1Width } = v1Dimenstions;

  const { position: coordinates, size } = annotation;

  const xPosPercentage = (coordinates.x / adjustedHeightWidth.width) * 100;
  const yPosPercentage = (coordinates.y / adjustedHeightWidth.height) * 100;

  const widthPercentage = (size.width / adjustedHeightWidth.width) * 100;
  const heightPercentage = (size.height / adjustedHeightWidth.height) * 100;

  const calcX = (xPosPercentage / 100) * v1Width;
  const calcY = (yPosPercentage / 100) * v1Height;

  const calcSizeWidth = (widthPercentage / 100) * v1Width;
  const calcSizeHeight = (heightPercentage / 100) * v1Height;

  return {
    x: Math.round(calcX),
    y: Math.round(calcY),
    width: calcSizeWidth,
    height: calcSizeHeight
  };
};

export const calcDistance = (min, max) => (Math.abs(min) + Math.abs(max)) / 10;
