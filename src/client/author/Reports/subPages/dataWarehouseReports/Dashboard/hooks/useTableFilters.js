import { DB_SORT_ORDER_TYPES } from '@edulastic/constants/reportUtils/common'
import { useState } from 'react'
import qs from 'qs'
import {
  tableFilterTypes,
  TABLE_PAGE_SIZE,
  compareByFilterFieldKeys,
  compareByOptions,
  nextCompareByOptionsMap,
  academicSummaryFiltersTypes,
} from '../utils'

const useTableFilters = ({
  location,
  defaultCompareBy,
  settings,
  setSettings,
}) => {
  const [tableFilters, setTableFilters] = useState({
    [tableFilterTypes.COMPARE_BY]: defaultCompareBy,
    [tableFilterTypes.PAGE]: 1,
    [tableFilterTypes.PAGE_SIZE]: TABLE_PAGE_SIZE,
    [tableFilterTypes.SORT_KEY]: defaultCompareBy.key,
    [tableFilterTypes.SORT_ORDER]: DB_SORT_ORDER_TYPES.ASCEND,
    [tableFilterTypes.ABOVE_EQUAL_TO_AVG]: true,
    [tableFilterTypes.BELOW_AVG]: true,
    // requireTotalCount: true,
  })

  const updateTableFiltersCB = (selected, tableFilterType) => {
    setTableFilters((prevState) => {
      const nextState = {
        ...prevState,
        [tableFilterType]: selected,
        [tableFilterTypes.SORT_KEY]: selected.key,
      }
      return nextState
    })
    setSettings({ ...settings, selectedCompareBy: selected })
  }

  const updateTableHeaderFilters = (filters, cellKey, keyName) => {
    if (tableFilters[cellKey] && !tableFilters[keyName]) {
      filters[keyName] = true
    } else {
      filters[keyName] = false
      filters[cellKey] = true
    }
  }

  const onTableHeaderCellClick = (cellKey, value) => {
    if (!value) return
    const filters = { ...tableFilters }
    if (cellKey === tableFilterTypes.ABOVE_EQUAL_TO_AVG) {
      const keyName = tableFilterTypes.BELOW_AVG
      updateTableHeaderFilters(filters, cellKey, keyName)
    } else {
      const keyName = tableFilterTypes.ABOVE_EQUAL_TO_AVG
      updateTableHeaderFilters(filters, cellKey, keyName)
    }
    setTableFilters({ ...filters })
  }

  const setTablePagination = ({ page }) => {
    setTableFilters((prevState) => ({ ...prevState, page }))
  }

  const getTableDrillDownUrl = (key, baseUrl = location.pathname) => {
    const selectedCompareBy = tableFilters[tableFilterTypes.COMPARE_BY].key
    const filterField = compareByFilterFieldKeys[selectedCompareBy]

    const _filters = { ...settings.requestFilters }
    const { academicSummaryFilters } = settings
    const nextCompareBy =
      compareByOptions.find(
        (o) => o.key === nextCompareByOptionsMap[selectedCompareBy]
      ) || selectedCompareBy

    Object.assign(_filters, {
      [filterField]: key,
      selectedCompareBy: nextCompareBy.key,
      profileId:
        academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]
          ?.key,
    })
    const url = `${baseUrl}?${qs.stringify(_filters)}`
    return url
  }

  return {
    tableFilters,
    setTableFilters,
    updateTableFiltersCB,
    onTableHeaderCellClick,
    getTableDrillDownUrl,
    setTablePagination,
  }
}

export default useTableFilters
