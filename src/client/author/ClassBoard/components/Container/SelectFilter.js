import React from 'react'
import { FilterSelect } from './styled'

export const FILTER_OPTIONS = [
  'ALL ASSIGNED',
  'NOT STARTED',
  'IN PROGRESS',
  'SUBMITTED',
  'GRADED',
  'ABSENT',
  'PAUSED',
  'REDIRECTED',
  'UNASSIGNED',
  'NOT ENROLLED',
]

function capitalizeIt(str) {
  if (str && typeof str === 'string') {
    str = str.toLowerCase().split(' ')
    for (let i = 0, x = str.length; i < x; i++) {
      if (str[i]) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1)
      }
    }
    return str.join(' ')
  }
  return str
}

function SelectFilter(props) {
  const {
    options = FILTER_OPTIONS,
    value,
    onChange,
    width = '170px',
    height = '24px',
    testActivity,
    enrollmentStatus,
    studentFilterCategoryCounts,
    studentIsEnrolled,
  } = props

  return (
    <FilterSelect
      data-cy="filterByStatus"
      className="student-status-filter"
      value={value}
      dropdownMenuStyle={{ fontSize: 29 }}
      getPopupContainer={(trigger) => trigger.parentElement}
      onChange={onChange}
      width={width}
      height={height}
    >
      {options.map((x) => (
        <FilterSelect.Option
          className="student-status-filter-item"
          key={x}
          value={x}
          style={{ fontSize: 11 }}
        >
          {capitalizeIt(x)} (
          {x === 'ALL ASSIGNED'
            ? testActivity.filter(
                ({ isAssigned, isEnrolled, archived }) =>
                  isAssigned &&
                  studentIsEnrolled({
                    isEnrolled,
                    enrollmentStatus,
                    archived,
                  })
              ).length
            : studentFilterCategoryCounts[x] || 0}
          )
        </FilterSelect.Option>
      ))}
    </FilterSelect>
  )
}

export default SelectFilter
