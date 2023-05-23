import { useState } from 'react'
import qs from 'qs'
import { sortKeys, sortOrders } from '../utils'
import {
  compareByKeysToFilterKeys,
  compareByKeys,
  nextCompareByKeys,
} from '../../common/utils'

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

  const getTableDrillDownUrl = (key, baseUrl = location.pathname) => {
    const selectedCompareByKey = tableFilters.compareBy.key
    const filterField = compareByKeysToFilterKeys[selectedCompareByKey]

    const _filters = {
      ...settings.requestFilters,
      [filterField]: key,
      selectedCompareBy: nextCompareByKeys[selectedCompareByKey],
      preBandScore: tableFilters.preBandScore,
      postBandScore: tableFilters.postBandScore,
    }

    if (selectedCompareByKey === compareByKeys.STUDENT) {
      delete _filters[filterField]
      return `${baseUrl}${key}?${qs.stringify(_filters)}`
    }
    return `${baseUrl}?${qs.stringify(_filters)}`
  }

  return {
    tableFilters,
    setTableFilters,
    getTableDrillDownUrl,
  }
}

export default useTableFilters
