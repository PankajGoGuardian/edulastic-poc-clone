import { useEffect } from 'react'
import { isEmpty } from 'lodash'

import { roleuser } from '@edulastic/constants'

function useFiltersPreload({
  reportId,
  fetchFiltersDataRequest,
  setFilters,
  filters,
  search,
  termId,
  firstLoad,
  userRole,
  institutionIds,
  externalTestsRequired = false,
  externalBandsRequired = false,
  externalTestTypesRequired = true,
  testSettingsRequired = false,
  attendanceBandInfoRequired = false,
  useAttendanceAbsenceRequired = undefined,
}) {
  useEffect(() => {
    if (reportId) {
      fetchFiltersDataRequest({
        reportId,
        externalTestsRequired,
        externalBandsRequired,
        externalTestTypesRequired,
        testSettingsRequired,
        attendanceBandInfoRequired,
        useAttendanceAbsenceRequired,
      })
      setFilters({ ...filters, ...search })
    } else {
      const q = {
        ...search,
        termId,
        externalTestsRequired,
        externalBandsRequired,
        externalTestTypesRequired,
        testSettingsRequired,
        attendanceBandInfoRequired,
        useAttendanceAbsenceRequired,
      }
      if (firstLoad && isEmpty(search)) {
        q.firstLoad = true
      }
      if (userRole === roleuser.SCHOOL_ADMIN) {
        q.schoolIds = institutionIds.join(',')
      }
      fetchFiltersDataRequest(q)
    }
  }, [])
}

export default useFiltersPreload
