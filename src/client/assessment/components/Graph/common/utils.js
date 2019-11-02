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
  responseBoxTitleWidth
) => {
  const obj = { width: layout.width, height: layout.height };

  if (parentWidth < layout.width) {
    obj.width = Math.max(parentWidth, MIN_WIDTH);
  }

  if (responseBoxPosition === "left" || responseBoxPosition === "right") {
    obj.width -= responseBoxTitleWidth;
  }

  // have coded the height part cuz I haven't investigated what the problem yet

  return obj;
};
