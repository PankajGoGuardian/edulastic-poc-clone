export const caluculateOffset = (offsetObject) => {
  if (offsetObject.offsetParent === null) return 0

  return offsetObject.offsetTop + caluculateOffset(offsetObject.offsetParent)
}
