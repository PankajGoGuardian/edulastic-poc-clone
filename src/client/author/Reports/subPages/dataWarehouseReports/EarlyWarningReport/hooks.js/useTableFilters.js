// import { DB_SORT_ORDER_TYPES } from '@edulastic/constants/reportUtils/common'
import { useState } from 'react'
import qs from 'qs'
import { RISK_BAND_LEVELS } from '@edulastic/constants/reportUtils/common'
import { tableFilterTypes, TABLE_PAGE_SIZE } from '../utils'
import {
  compareByKeysToFilterKeys,
  compareByKeys,
  nextCompareByKeys,
} from '../../common/utils'

const useTableFilters = ({ defaultCompareBy, location, settings }) => {
  const [tableFilters, setTableFilters] = useState({
    [tableFilterTypes.COMPARE_BY]: defaultCompareBy,
    [tableFilterTypes.RISK]: Object.values(RISK_BAND_LEVELS),
    [tableFilterTypes.PAGE]: 1,
    [tableFilterTypes.PAGE_SIZE]: TABLE_PAGE_SIZE,
  })

  const setTablePagination = ({ page }) => {
    setTableFilters((prevState) => ({ ...prevState, page }))
  }

  const getTableDrillDownUrl = (key, baseUrl = location.pathname) => {
    const selectedCompareBy = tableFilters[tableFilterTypes.COMPARE_BY].key
    const filterField = compareByKeysToFilterKeys[selectedCompareBy]
    const { requestFilters, riskTimelineFilters } = settings

    const _filters = {
      ...requestFilters,
      ...riskTimelineFilters,
      [filterField]: key,
      selectedCompareBy: nextCompareByKeys[selectedCompareBy],
    }

    if (selectedCompareBy === compareByKeys.STUDENT) {
      delete _filters[filterField]
      return `${baseUrl}${key}?${qs.stringify(_filters)}`
    }
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
