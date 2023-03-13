import { useState } from 'react'

import { reportUtils, roleuser } from '@edulastic/constants'

const {
  TABLE_PAGE_SIZE,
  comDataForDropDown,
  compareByKeys,
  analyseByKeys,
} = reportUtils.standardsGradebook

const useTableFilters = ({ userRole }) => {
  const defaultCompareByKey =
    userRole === roleuser.TEACHER ? compareByKeys.STUDENT : compareByKeys.SCHOOL

  const [tableFilters, setTableFilters] = useState({
    compareByKey: defaultCompareByKey,
    analyseByKey: analyseByKeys.MASTERY_SCORE,
    page: 0, // set to 0 initially to prevent multiple api request on tab change
    pageSize: TABLE_PAGE_SIZE,
    sortKey: defaultCompareByKey,
    sortOrder: 'asc',
    requireTotalCount: true,
  })

  const tableFilterDropDownCB = (event, _selected, comData) => {
    if (comData === comDataForDropDown.COMPARE_BY) {
      setTableFilters((prevState) => ({
        ...prevState,
        page: 1,
        compareByKey: _selected.key,
        sortKey:
          prevState.sortKey === prevState.compareByKey
            ? _selected.key
            : prevState.sortKey,
      }))
    }
    if (comData === comDataForDropDown.ANALYZE_BY) {
      setTableFilters((prevState) => ({
        ...prevState,
        analyseByKey: _selected.key,
      }))
    }
  }

  const setTablePagination = ({ page }) => {
    setTableFilters((prevState) => ({ ...prevState, page }))
  }

  return {
    tableFilters,
    setTableFilters,
    tableFilterDropDownCB,
    setTablePagination,
  }
}

export default useTableFilters
