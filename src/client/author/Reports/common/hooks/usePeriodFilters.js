import {
  PERIOD_TYPES,
  PERIOD_NAMES,
} from '@edulastic/constants/reportUtils/common'
import next from 'immer'
import { useEffect } from 'react'
import moment from 'moment'
import { utcMonthDate } from '../util'

function usePeriodFilters({
  terms,
  filters,
  setFilters,
  filterTagsData,
  setFilterTagsData,
}) {
  useEffect(() => {
    const { startDate, endDate } =
      terms.find((term) => term._id === filters.termId) || {}
    const fromDate = +moment(startDate).startOf('month')
    const toDate = +moment(endDate).endOf('month')
    const [newFilters, newFilterTagsData] = next(
      [filters, filterTagsData],
      ([_filters, _filterTagsData]) => {
        if (!(startDate <= Date.now() && endDate >= Date.now())) {
          _filters.periodType = PERIOD_TYPES.CUSTOM
          _filterTagsData.periodType = {
            key: _filters.periodType,
            title: PERIOD_NAMES[_filters.periodType],
          }
        }

        const areCustomDatesValid =
          _filters.customPeriodStart < _filters.customPeriodEnd &&
          _filters.customPeriodStart >= fromDate &&
          _filters.customPeriodEnd <= toDate

        if (
          _filters.periodType === PERIOD_TYPES.CUSTOM &&
          !areCustomDatesValid
        ) {
          _filters.customPeriodStart = `${utcMonthDate(fromDate)}`
          _filters.customPeriodEnd = `${utcMonthDate(toDate)}`
        } else if (_filters.periodType !== PERIOD_TYPES.CUSTOM) {
          delete _filters.customPeriodStart
          delete _filters.customPeriodEnd
        }
      }
    )

    setFilters(newFilters)
    setFilterTagsData(newFilterTagsData)
  }, [filters.termId, filters.periodType])
}

export default usePeriodFilters
