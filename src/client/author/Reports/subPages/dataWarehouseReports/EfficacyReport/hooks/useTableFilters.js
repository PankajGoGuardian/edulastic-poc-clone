import { useState } from 'react'
import { sortKeys, sortOrders } from '../utils'
import { buildDrillDownUrl } from '../../common/utils'

const useTableFilters = ({
  location,
  search,
  settings,
  selectedCompareBy,
  defaultAnalyseBy,
}) => {
  const [tableFilters, setTableFilters] = useState({
    compareBy: selectedCompareBy,
    analyseBy: defaultAnalyseBy,
    preBandScore: search.preBandScore || '',
    postBandScore: search.postBandScore || '',
    sortKey: sortKeys.COMPARE_BY,
    sortOrder: sortOrders.ASCEND,
  })

  const getTableDrillDownUrl = (key, reportUrl = location.pathname) => {
    const compareByKey = tableFilters.compareBy.key
    const reportFilters = {
      ...settings.requestFilters,
      preBandScore: tableFilters.preBandScore,
      postBandScore: tableFilters.postBandScore,
    }
    return buildDrillDownUrl({
      key,
      selectedCompareBy: compareByKey,
      reportUrl,
      reportFilters,
    })
  }

  return {
    tableFilters,
    setTableFilters,
    getTableDrillDownUrl,
  }
}

export default useTableFilters
