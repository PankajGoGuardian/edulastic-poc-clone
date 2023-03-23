import qs from 'qs'
import { useEffect } from 'react'
import { computeChartNavigationLinks } from '../utils'

function useTabNavigation(
  search,
  settings,
  reportId,
  history,
  loc,
  updateNavigation
) {
  useEffect(() => {
    if (settings.requestFilters.termId) {
      const obj = {}
      const arr = Object.keys(settings.requestFilters)
      arr.forEach((item) => {
        const val =
          settings.requestFilters[item] === ''
            ? 'All'
            : settings.requestFilters[item]
        obj[item] = val
      })
      obj.reportId = reportId || ''
      obj.selectedCompareBy =
        search.selectedCompareBy || settings.selectedCompareBy.key
      const path = `?${qs.stringify(obj)}`
      history.push(path)
    }
    const navigationItems = computeChartNavigationLinks(settings, loc, reportId)
    updateNavigation(navigationItems)
  }, [settings])
}
export default useTabNavigation
