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
    // [tableFilterTypes.ABOVE_EQUAL_TO_AVG]: true,
    // [tableFilterTypes.BELOW_AVG]: true,
    // requireTotalCount: true,
  })

  const updateTableFiltersCB = (selected, tableFilterType) => {
    setTableFilters((prevState) => {
      const nextState = { ...prevState, [tableFilterType]: selected }
      if (
        !nextState[tableFilterTypes.ABOVE_EQUAL_TO_AVG] &&
        !nextState[tableFilterTypes.BELOW_AVG]
      ) {
        // if both are false, set true to both
        nextState[tableFilterTypes.ABOVE_EQUAL_TO_AVG] = true
        nextState[tableFilterTypes.BELOW_AVG] = true
      }
      return nextState
    })
  }

  const setTablePagination = ({ page }) => {
    setTableFilters((prevState) => ({ ...prevState, page }))
  }

  return {
    tableFilters,
    updateTableFiltersCB,
    setTablePagination,
  }
}

export default useTableFilters
