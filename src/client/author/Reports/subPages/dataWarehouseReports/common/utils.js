import next from 'immer'
import qs from 'qs'
import navigation from '../../../common/static/json/navigation.json'

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
