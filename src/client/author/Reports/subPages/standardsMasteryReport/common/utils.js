export const transformFiltersForSMR = ({
  classIds,
  groupIds,
  ...requestFilters
}) => {
  return {
    ...requestFilters,
    classIds: classIds || '',
    groupIds: groupIds || '',
  }
}
