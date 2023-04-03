import qs from 'qs'
import { useEffect } from 'react'
import { computeChartNavigationLinks } from '../util'

function useTabNavigation({
  settings,
  reportId,
  history,
  loc,
  updateNavigation,
  extraFilters = {},
}) {
  useEffect(() => {
    if (settings.requestFilters.termId) {
      const _filters = {}
      const requestFilterKeys = Object.keys(settings.requestFilters)
      requestFilterKeys.forEach((item) => {
        const val =
          settings.requestFilters[item] === ''
            ? 'All'
            : settings.requestFilters[item]
        _filters[item] = val
      })
      Object.assign(_filters, {
        reportId: reportId || '',
        ...extraFilters,
      })
      const path = `?${qs.stringify(_filters)}`
      history.push(path)
    }
    const navigationItems = computeChartNavigationLinks({
      requestFilters: settings.requestFilters,
      loc,
      hideOtherTabs: !!reportId,
    })
    updateNavigation(navigationItems)
  }, [settings])
}
export default useTabNavigation
