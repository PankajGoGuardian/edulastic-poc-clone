export const getUpdatedFiltersAndTags = (filters, tags, isPrePostReport) => {
  const _filters = { ...filters }
  const _tags = { ...tags }
  if (isPrePostReport) {
    _filters.testIds = ''
    delete _tags.testIds
  } else {
    _filters.preTestId = ''
    _filters.postTestId = ''
    delete _tags.preTestId
    delete _tags.postTestId
  }
  return [_filters, _tags]
}
