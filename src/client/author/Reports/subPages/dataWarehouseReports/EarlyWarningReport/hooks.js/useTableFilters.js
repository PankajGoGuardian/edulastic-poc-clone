// import { DB_SORT_ORDER_TYPES } from '@edulastic/constants/reportUtils/common'
import { useState } from 'react'
import qs from 'qs'
import { tableFilterTypes, TABLE_PAGE_SIZE } from '../utils'
import {
  compareByFilterFieldKeys,
  compareByOptions,
  nextCompareByOptionsMap,
} from '../../common/utils'

const useTableFilters = ({ defaultCompareBy, location, settings }) => {
  const [tableFilters, setTableFilters] = useState({
    [tableFilterTypes.COMPARE_BY]: defaultCompareBy,
    [tableFilterTypes.PAGE]: 1,
    [tableFilterTypes.PAGE_SIZE]: TABLE_PAGE_SIZE,
  })

  const setTablePagination = ({ page }) => {
    setTableFilters((prevState) => ({ ...prevState, page }))
  }

  const getTableDrillDownUrl = (key, baseUrl = location.pathname) => {
    const selectedCompareBy = tableFilters[tableFilterTypes.COMPARE_BY].key
    const filterField = compareByFilterFieldKeys[selectedCompareBy]
    const { requestFilters, riskTimelineFilters } = settings
    const _filters = {
      ...requestFilters,
      ...riskTimelineFilters,
    }
    const nextCompareBy = compareByOptions.find(
      (o) => o.key === nextCompareByOptionsMap[selectedCompareBy]
    )

    Object.assign(_filters, {
      [filterField]: key,
      selectedCompareBy: nextCompareBy?.key || selectedCompareBy,
    })
    const url = `${baseUrl}?${qs.stringify(_filters)}`
    return url
  }

  return {
    tableFilters,
    setTableFilters,
    getTableDrillDownUrl,
    setTablePagination,
  }
}

export default useTableFilters
