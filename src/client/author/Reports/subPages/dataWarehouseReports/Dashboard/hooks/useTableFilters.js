import { DB_SORT_ORDER_TYPES } from '@edulastic/constants/reportUtils/common'
import { useState } from 'react'
import qs from 'qs'
import {
  tableFilterTypes,
  TABLE_PAGE_SIZE,
  academicSummaryFiltersTypes,
} from '../utils'
import { buildDrillDownUrl } from '../../common/utils'

const useTableFilters = ({
  history,
  location,
  search,
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
      if (tableFilterType === tableFilterTypes.COMPARE_BY) {
        nextState[tableFilterTypes.ABOVE_EQUAL_TO_AVG] = true
        nextState[tableFilterTypes.BELOW_AVG] = true
      }
      return nextState
    })
    if (search.selectedCompareBy) {
      history.replace(
        `${location.pathname}?${qs.stringify(settings.requestFilters)}`
      )
    }
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

  const getTableDrillDownUrl = (
    key,
    reportUrl = location.pathname,
    isDistrictAvgDimension = false
  ) => {
    const selectedCompareBy = tableFilters[tableFilterTypes.COMPARE_BY].key
    const { academicSummaryFilters } = settings
    const reportFilters = {
      ...settings.requestFilters,
      profileId:
        academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]
          ?.key,
    }
    if (isDistrictAvgDimension) {
      Object.assign(reportFilters, { selectedCompareBy })
      return `${reportUrl}?${qs.stringify(reportFilters)}`
    }
    return buildDrillDownUrl({
      key,
      selectedCompareBy,
      reportUrl,
      reportFilters,
      history,
    })
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
