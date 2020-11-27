import next from 'immer'
import { sortBy, sortedUniqBy, filter } from 'lodash'

export const getDomains = (domains) =>
  sortedUniqBy(
    sortBy(
      filter(domains, (item) => item.tloId),
      'tloId'
    ),
    'tloId'
  )

export const transformFiltersForSMR = ({
  requestFilters = {},
  selectedTest = [],
  ddfilter = {},
}) => {
  const modifiedFilters = next(ddfilter, (draft) => {
    Object.keys(draft).forEach((key) => {
      const _keyData =
        typeof draft[key] === 'object' ? draft[key].key : draft[key]
      draft[key] = _keyData?.toLowerCase() === 'all' ? '' : _keyData
    })
  })
  const domainIds = Array.isArray(requestFilters.domainIds)
    ? requestFilters.domainIds.join()
    : ''
  const schoolIds = Array.isArray(requestFilters.schoolIds)
    ? requestFilters.schoolIds.join()
    : requestFilters.schoolId || modifiedFilters.schoolId
  const testIds = selectedTest.map((test) => test.key).join()
  return {
    ...requestFilters,
    domainIds,
    schoolIds,
    testIds,
    ...modifiedFilters,
  }
}
