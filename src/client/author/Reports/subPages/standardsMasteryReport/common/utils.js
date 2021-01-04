export const transformFiltersForSMR = ({
  classId,
  classIds,
  groupId,
  groupIds,
  ...requestFilters
}) => {
  classIds = classIds && Array.isArray(classIds) ? classIds.join(',') : classId
  groupIds = groupIds && Array.isArray(groupIds) ? groupIds.join(',') : groupId
  return {
    ...requestFilters,
    classIds: classIds || '',
    groupIds: groupIds || '',
  }
}
