export const caluculateOffset = offsetObject => {
  if (offsetObject.offsetParent === null) return 0;
  else {
    return offsetObject.offsetTop + caluculateOffset(offsetObject.offsetParent);
  }
};
