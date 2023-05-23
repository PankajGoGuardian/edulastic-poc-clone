import { lightGreen12, lightGrey9, lightRed5 } from '@edulastic/colors'
import moment from 'moment'
import { isEmpty } from 'lodash'
import { PERIOD_TYPES } from '@edulastic/constants/reportUtils/common'
import { resetStudentFilters as resetFilters } from '../../../../common/util'
import { allFilterValue } from '../../../../common/constants'
import {
  StyledIconCaretDown,
  StyledIconCaretUp,
} from '../components/styledComponents'
import { compareByKeys } from './constants'

StyledIconCaretDown

export function buildRequestFilters(_settings) {
  const _requestFilters = {}
  Object.keys(_settings.requestFilters).forEach((filterType) => {
    _requestFilters[filterType] =
      _settings.requestFilters[filterType]?.toLowerCase?.() === allFilterValue
        ? ''
        : _settings.requestFilters[filterType]
  })
  return _requestFilters
}

export function removeFilter(
  filterTagsData,
  filters,
  type,
  key,
  staticDropDownData
) {
  const _filterTagsData = { ...filterTagsData }
  const _filters = { ...filters }
  resetFilters(_filterTagsData, _filters, type, '')
  if (filters[type] === key) {
    // handles single selection filters
    _filters[type] = staticDropDownData.initialFilters[type]
    delete _filterTagsData[type]
  } else if (filters[type].includes(key)) {
    // handles multiple selection filters
    _filters[type] = filters[type]
      .split(',')
      .filter((d) => d !== key)
      .join(',')
    _filterTagsData[type] = filterTagsData[type].filter((d) => d.key !== key)
  }
  return { _filters, _filterTagsData }
}

export function getDateLabel(period) {
  if (isEmpty(period)) return ''
  const dateFormat = `MMM YYYY`
  const periodStart = moment([
    period.start.year,
    period.start.month - 1,
  ]).format(dateFormat)
  return periodStart
}

export const filterPopupFilterSelectedTestTypes = (
  selectedAssessmentTypes,
  availableTestTypes
) => {
  selectedAssessmentTypes = selectedAssessmentTypes || ''
  const testTypesSelectedInPopupFilters = selectedAssessmentTypes.split(',')
  return isEmpty(selectedAssessmentTypes)
    ? availableTestTypes
    : availableTestTypes.filter(({ key }) =>
        testTypesSelectedInPopupFilters.includes(key)
      )
}

export const sortDistributionBand = (data) => data.sort((a, b) => b.max - a.max)

export const getTrendPeriodLabel = (
  selectedPeriodType,
  period,
  prefix = '',
  dateFormat = `MMM YYYY`
) => {
  if (isEmpty(period)) return ''

  const {
    start: { year: periodStartYear, month: periodStartMonth },
    end: { year: periodEndYear, month: periodEndMonth },
  } = period
  const periodStartLabel = moment([
    periodStartYear,
    periodStartMonth - 1,
  ]).format(dateFormat)
  const periodEndLabel = moment([periodEndYear, periodEndMonth - 1]).format(
    dateFormat
  )
  const [periodStartMonthLabel, periodStartYearLabel] = periodStartLabel.split(
    ' '
  )
  const hasSameYear = periodStartYear === periodEndYear
  const periodStartYearLabelText = hasSameYear ? '' : periodStartYearLabel

  const rangeLabel = [
    periodStartMonthLabel,
    periodStartYearLabelText,
    '-',
    periodEndLabel,
  ]
    .filter(Boolean)
    .join(' ')

  switch (selectedPeriodType) {
    case PERIOD_TYPES.TILL_DATE:
    case PERIOD_TYPES.THIS_QUARTER:
    case PERIOD_TYPES.LAST_QUARTER:
    case PERIOD_TYPES.CUSTOM:
      return `${prefix}${rangeLabel}`
    case PERIOD_TYPES.THIS_MONTH:
    case PERIOD_TYPES.LAST_MONTH:
      return `${prefix}${periodEndLabel}`
    default:
      return ''
  }
}

export const getWidgetCellFooterInfo = (value, showReverseTrend) => {
  let color = lightGrey9
  let Icon = null
  if (value > 0) {
    color = showReverseTrend ? lightRed5 : lightGreen12
    Icon = StyledIconCaretUp
  } else if (value < 0) {
    color = showReverseTrend ? lightGreen12 : lightRed5
    Icon = StyledIconCaretDown
  }
  return [color, Icon]
}

export const getDemographicsFilterTagsData = (search, demographics) => {
  const demographicsFilterTagsData = {}
  demographics.forEach((d) => {
    demographicsFilterTagsData[d.key] = {
      key: d.key,
      title: search[d.key] || '',
    }
  })
  return demographicsFilterTagsData
}

export const isAddToStudentGroupEnabled = (isSharedReport, compareByKey) => {
  return [!isSharedReport, compareByKey === compareByKeys.STUDENT].every(
    (e) => e
  )
}
