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
}) {
  useEffect(() => {
    if (reportId) {
      fetchFiltersDataRequest({ reportId })
      setFilters({ ...filters, ...search })
    } else {
      const q = { ...search, termId }
      if (firstLoad && isEmpty(search)) {
        q.firstLoad = true
      }
      if (userRole === roleuser.SCHOOL_ADMIN) {
        q.schoolIds = institutionIds.join(',')
      }
      q.externalTestTypesRequired = true
      fetchFiltersDataRequest(q)
    }
  }, [])
}

export default useFiltersPreload
