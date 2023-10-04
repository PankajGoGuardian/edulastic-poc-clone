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
    const _filters = { ...settings.requestFilters }
    if (_filters.termId) {
      const _filterKeys = Object.keys(_filters)
      _filterKeys.forEach((item) => {
        const val = _filters[item] === '' ? 'All' : _filters[item]
        _filters[item] = val
      })
      Object.assign(_filters, {
        reportId: reportId && reportId !== 'All' ? reportId : '',
        courseIds: _filters.courseIds || _filters.courseId,
        testTypes: _filters.testTypes || _filters.assessmentTypes,
        performanceBandProfileId: _filters.profileId,
        preProfileId: _filters.profileId,
        postProfileId: _filters.profileId,
        ...extraFilters,
      })
      const path = `?${qs.stringify(_filters, { arrayFormat: 'comma' })}`
      history.push(path)
    }
    const navigationItems = computeChartNavigationLinks({
      requestFilters: _filters,
      loc,
      hideOtherTabs: !!reportId,
    })
    updateNavigation(navigationItems)
  }, [settings, extraFilters.selectedCompareBy])
}
export default useTabNavigation
