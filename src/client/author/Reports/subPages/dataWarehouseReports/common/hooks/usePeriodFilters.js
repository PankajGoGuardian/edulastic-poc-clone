import { PERIOD_TYPES } from '@edulastic/constants/reportUtils/common'
import { useEffect } from 'react'
import moment from 'moment'
import { clamp } from 'lodash'

function usePeriodFilters(terms, filters, setFilters) {
  useEffect(() => {
    const { startDate, endDate } =
      terms.find((term) => term._id === filters.termId) || {}
    if (!(startDate <= Date.now() && endDate >= Date.now())) {
      const newFilters = {
        ...filters,
        periodType: PERIOD_TYPES.CUSTOM,
      }
      setFilters(newFilters)
    }
  }, [filters.termId])

  useEffect(() => {
    if (filters.periodType === PERIOD_TYPES.CUSTOM) {
      const { endDate, startDate } =
        terms.find((term) => term._id === filters.termId) || {}
      const fromDate = +moment(startDate).startOf('month')
      const toDate = +moment(endDate).endOf('month')
      const customPeriodBaseDate = clamp(Date.now(), fromDate, toDate)
      const newFilters = {
        ...filters,
        customPeriodStart: +moment(customPeriodBaseDate)
          .subtract(1, 'month')
          .startOf('month'),
        customPeriodEnd: +moment(customPeriodBaseDate).endOf('month'),
      }
      setFilters(newFilters)
    } else {
      const { customPeriodStart, customPeriodEnd, ...newFilters } = filters
      setFilters(newFilters)
    }
  }, [filters.termId, filters.periodType])
}

export default usePeriodFilters
