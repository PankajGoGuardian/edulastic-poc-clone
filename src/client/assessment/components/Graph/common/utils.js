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
  disableResponse
) => {
  const obj = { width: layout.width, height: layout.height };

  if (parentWidth < layout.width) {
    obj.width = Math.max(parentWidth, MIN_WIDTH);
  }

  if ((responseBoxPosition === "left" || responseBoxPosition === "right") && !disableResponse) {
    obj.width -= responseBoxTitleWidth;
  }

  // have coded the height part cuz I haven't investigated what the problem yet

  return obj;
};

export const getAdjustedV1AnnotationCoordinatesForRender = (adjustedHeightWidth, layout, annotation) => {
  const v1Height = 390;
  const v1Width = 720;

  const { position: coordinates, size } = annotation;

  const xPosPercentage = (coordinates.x / v1Width) * 100;
  const yPosPercentage = (coordinates.y / v1Height) * 100;

  let calcX = (xPosPercentage / 100) * adjustedHeightWidth.width;
  const calcY = (yPosPercentage / 100) * adjustedHeightWidth.height;

  if (size && size.width && adjustedHeightWidth.width - calcX < size.width / 2) {
    calcX = adjustedHeightWidth.width - size.width / 2 - 20;
  }

  return {
    x: calcX,
    y: calcY
  };
};

export const getAdjustedV1AnnotationCoordinatesForDB = (adjustedHeightWidth, layout, coordinates) => {
  debugger;
  const v1Height = 390;
  const v1Width = 720;

  const xPosPercentage = (coordinates.x / adjustedHeightWidth.width) * 100;
  const yPosPercentage = (coordinates.y / adjustedHeightWidth.height) * 100;

  const calcX = (xPosPercentage / 100) * v1Width;
  const calcY = (yPosPercentage / 100) * v1Height;

  return {
    x: calcX,
    y: calcY
  };
};
