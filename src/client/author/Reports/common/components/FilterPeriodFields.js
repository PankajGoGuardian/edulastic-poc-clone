import { Col, DatePicker } from 'antd'
import React from 'react'
import { EduIf } from '@edulastic/common'
import moment from 'moment'
import { PERIOD_TYPES } from '@edulastic/constants/reportUtils/common'
import { ControlDropDown } from './widgets/controlDropDown'
import { FilterLabel } from '../styled'
import usePeriodFilters from '../hooks/usePeriodFilters'

const formatYYYYMMDD = 'YYYY-MM-DD'

function FilterPeriodFields({
  filters,
  setFilters,
  updateFilterDropdownCB,
  terms,
  allPeriodTypes,
  filterTagsData,
  setFilterTagsData,
}) {
  usePeriodFilters({
    terms,
    filters,
    setFilters,
    filterTagsData,
    setFilterTagsData,
  })

  const presentTerms = terms.filter(
    (term) => term.startDate <= Date.now() && term.endDate >= Date.now()
  )
  const isPresentTermSelected = presentTerms
    .map((t) => t._id)
    .includes(filters.termId)
  const availablePeriodTypes = !isPresentTermSelected
    ? allPeriodTypes.filter((period) => period.key === PERIOD_TYPES.CUSTOM)
    : allPeriodTypes

  const isDateWithinTermTillPresent = (date) => {
    const { startDate, endDate } =
      terms.find((term) => term._id === filters.termId) || {}
    if (!startDate || !endDate) return true
    const fromDate = +moment(startDate).startOf('month')
    const toDate = +moment(Math.min(endDate, Date.now())).endOf('month')
    return date <= toDate && date >= fromDate
  }

  return (
    <>
      <Col span={6}>
        <FilterLabel data-cy="periodType">Period</FilterLabel>
        <ControlDropDown
          by={{ key: filters.periodType }}
          selectCB={(e, selected) =>
            updateFilterDropdownCB(selected, 'periodType')
          }
          data={availablePeriodTypes}
          prefix="Period"
          showPrefixOnSelected={false}
        />
      </Col>
      <EduIf condition={filters.periodType === PERIOD_TYPES.CUSTOM}>
        <Col span={6}>
          <FilterLabel data-cy="customPeriodStart">Start Month</FilterLabel>
          <DatePicker.MonthPicker
            style={{ width: '100%' }}
            disabledDate={(date) => {
              if (!isDateWithinTermTillPresent(date)) return true
              const maxDate = filters.customPeriodEnd
              if (maxDate && maxDate < date) return true
              return false
            }}
            value={moment(+filters.customPeriodStart)}
            onChange={(date) => {
              updateFilterDropdownCB(
                { key: `${+moment.utc(date.format(formatYYYYMMDD))}` },
                'customPeriodStart'
              )
            }}
          />
        </Col>
        <Col span={6}>
          <FilterLabel data-cy="customPeriodEnd">End Month</FilterLabel>
          <DatePicker.MonthPicker
            style={{ width: '100%' }}
            disabledDate={(date) => {
              if (!isDateWithinTermTillPresent(date)) return true
              const minDate = filters.customPeriodStart
              if (minDate && minDate > date) return true
              return false
            }}
            value={moment(+filters.customPeriodEnd)}
            onChange={(date) =>
              updateFilterDropdownCB(
                { key: `${+moment.utc(date.format(formatYYYYMMDD))}` },
                'customPeriodEnd'
              )
            }
          />
        </Col>
      </EduIf>
    </>
  )
}

export default FilterPeriodFields
