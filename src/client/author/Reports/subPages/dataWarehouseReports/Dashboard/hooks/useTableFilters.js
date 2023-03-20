import { DB_SORT_ORDER_TYPES } from '@edulastic/constants/reportUtils/common'
import { useState } from 'react'
import { tableFilterTypes, TABLE_PAGE_SIZE } from '../utils'

const useTableFilters = (defaultCompareBy) => {
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
      const nextState = { ...prevState, [tableFilterType]: selected }
      return nextState
    })
  }

  const updateTableHeaderFilters = (filters, cellKey, keyName) => {
    if (tableFilters[cellKey] && !tableFilters[keyName]) {
      filters[keyName] = true
    } else {
      filters[keyName] = false
      filters[cellKey] = true
    }
  }

  const onTableHeaderCellClick = (cellKey) => {
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

  return {
    tableFilters,
    setTableFilters,
    updateTableFiltersCB,
    onTableHeaderCellClick,
    setTablePagination,
  }
}

export default useTableFilters
