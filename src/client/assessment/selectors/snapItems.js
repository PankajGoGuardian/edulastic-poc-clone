export const getSnapItemsByIdSelector = (state, id) => {
  const { snapItems = {} } = state
  return snapItems[id] || []
}
