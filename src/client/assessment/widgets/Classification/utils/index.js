export const getStyles = (
  isDragging,
  isTransparent,
  backgroundColor,
  borderColor,
  styles = {}
) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: isDragging ? 0 : 1,
  minHeight: 40,
  borderRadius: 5,
  border: `2px ${borderColor} dotted`,
  padding: '8px',
  backgroundColor: isTransparent ? 'transparent' : backgroundColor,
  cursor: 'pointer',
  ...styles,
})
