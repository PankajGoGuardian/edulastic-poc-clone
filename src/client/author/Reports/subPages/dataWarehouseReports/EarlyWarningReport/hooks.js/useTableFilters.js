// import { DB_SORT_ORDER_TYPES } from '@edulastic/constants/reportUtils/common'
import { useState } from 'react'
import { RISK_BAND_LABELS } from '@edulastic/constants/reportUtils/common'
import { tableFilterTypes, TABLE_PAGE_SIZE } from '../utils'
import { buildDrillDownUrl } from '../../common/utils'

const useTableFilters = ({ defaultCompareBy, location, settings }) => {
  const [tableFilters, setTableFilters] = useState({
    [tableFilterTypes.COMPARE_BY]: defaultCompareBy,
    [tableFilterTypes.RISK]: Object.values(RISK_BAND_LABELS),
    [tableFilterTypes.PAGE]: 1,
    [tableFilterTypes.PAGE_SIZE]: TABLE_PAGE_SIZE,
  })

  const setTablePagination = ({ page }) => {
    setTableFilters((prevState) => ({ ...prevState, page }))
  }

  const getTableDrillDownUrl = (key, reportUrl = location.pathname) => {
    const selectedCompareBy = tableFilters[tableFilterTypes.COMPARE_BY].key
    const { requestFilters, riskTimelineFilters } = settings
    const reportFilters = {
      ...requestFilters,
      ...riskTimelineFilters,
    }
    return buildDrillDownUrl({
      key,
      selectedCompareBy,
      reportUrl,
      reportFilters,
    })
  }

  return {
    tableFilters,
    setTableFilters,
    getTableDrillDownUrl,
    setTablePagination,
  }
}

export default useTableFilters
