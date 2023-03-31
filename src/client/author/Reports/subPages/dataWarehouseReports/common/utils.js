import next from 'immer'
import qs from 'qs'
import navigation from '../../../common/static/json/navigation.json'
import { isEmpty } from 'lodash'

export function computeChartNavigationLinks(settings, loc, reportId) {
  const { requestFilters } = settings
  if (navigation.locToData[loc]) {
    const requestFilterKeys = Object.keys(requestFilters)
    const _filters = {}
    requestFilterKeys.forEach((item) => {
      const val = requestFilters[item] === '' ? 'All' : requestFilters[item]
      _filters[item] = val
    })
    const _navigationItems = navigation.navigation[
      navigation.locToData[loc].group
    ].filter((item) => {
      // if data warehouse report is shared, only that report tab should be shown
      return !reportId || item.key === loc
    })
    return next(_navigationItems, (draft) => {
      const _currentItem = draft.find((t) => t.key === loc)
      _currentItem.location += `?${qs.stringify(_filters)}`
    })
  }
  return []
}

export function buildRequestFilters(_settings) {
  const _requestFilters = {}
  Object.keys(_settings.requestFilters).forEach((filterType) => {
    _requestFilters[filterType] =
      _settings.requestFilters[filterType] === 'All' ||
      _settings.requestFilters[filterType] === 'all'
        ? ''
        : _settings.requestFilters[filterType]
  })
  return _requestFilters
}

export const filterPopupFilterSelectedTestTypes = (
  selectedAssessmentTypes,
  availableTestTypes
) => {
  selectedAssessmentTypes = selectedAssessmentTypes || ''
  const testTypesSelectedInPopupFilters = selectedAssessmentTypes.split(',')
  return isEmpty(selectedAssessmentTypes)
    ? availableTestTypes
    : availableTestTypes.filter(({ key }) =>
        testTypesSelectedInPopupFilters.includes(key)
      )
}
