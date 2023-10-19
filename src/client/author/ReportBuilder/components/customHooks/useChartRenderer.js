import { useEffect, useMemo, useState } from 'react'
import { isEmpty } from 'lodash'

import { DEFAULT_PAGESIZE } from '../../const'

export const useChartRenderer = ({
  chartData,
  getChartData,
  widget,
  isControlled = false,
}) => {
  const { query } = widget
  const [pageFilter, setPageFilter] = useState({
    limit: DEFAULT_PAGESIZE,
    offset: 0,
    total: 0,
  })

  // TODO: Have two state for query appliedQuery & savedQuery, and pass savedQuery in dependency array in below useEffect.
  useEffect(() => {
    if (!isEmpty(query)) {
      const queryWithPageFilters = { ...query, ...pageFilter, total: true }
      getChartData({
        widgetId: isControlled ? 'draft' : widget._id,
        query: queryWithPageFilters,
      })
    }
  }, [pageFilter])

  const finalPageFilter = useMemo(
    () => ({ ...pageFilter, total: chartData?.total ?? pageFilter.total }),
    [chartData]
  )

  return {
    pageFilter: finalPageFilter,
    setPageFilter,
  }
}
