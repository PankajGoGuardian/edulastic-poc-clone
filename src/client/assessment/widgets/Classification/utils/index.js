export const getStyles = (isDragging, isTransparent, backgroundColor, borderColor, styles = {}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: isDragging ? 0 : 1,
  minWidth: 136,
  minHeight: 40,
  borderRadius: 5,
  border: `1px solid ${borderColor}`,
  backgroundColor: isTransparent ? "transparent" : backgroundColor,
  cursor: "pointer",
  ...styles
});
