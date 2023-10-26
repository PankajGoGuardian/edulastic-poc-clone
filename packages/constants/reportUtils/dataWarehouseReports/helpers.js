const moment = require('moment')
const { isEmpty, round } = require('lodash')
const roleuser = require('../../const/roleType')
const {
  ALL_TEST_TYPES_VALUES: INTERNAL_TEST_TYPES,
  TEST_TYPES_VALUES_MAP,
  DEFAULT_ADMIN_TEST_TYPE_MAP,
} = require('../../const/testTypes')
const {
  ALL_FILTER_VALUE,
  PERIOD_TYPES,
  resetStudentFilters: resetFilters,
} = require('../common')
const {
  EXTERNAL_SCORE_PREFIX,
  EXTERNAL_SCORE_SUFFIX,
  EXTERNAL_SCORE_TYPES_LIST,
  EXTERNAL_SCORE_TYPES_TO_TEST_TYPES,
  INTERNAL_TEST_TYPES_ORDER,
  compareByKeys,
} = require('./constants')

function buildRequestFilters(_settings) {
  const _requestFilters = {}
  Object.keys(_settings.requestFilters).forEach((filterType) => {
    _requestFilters[filterType] =
      _settings.requestFilters[filterType]?.toLowerCase?.() === ALL_FILTER_VALUE
        ? ''
        : _settings.requestFilters[filterType]
  })
  return _requestFilters
}

function removeFilter(filterTagsData, filters, type, key, staticDropDownData) {
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

function getDateLabel(period) {
  if (isEmpty(period)) return ''
  const dateFormat = `MMM YYYY`
  const periodStart = moment([
    period.start.year,
    period.start.month - 1,
  ]).format(dateFormat)
  return periodStart
}

const filterPopupFilterSelectedTestTypes = (
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

const sortDistributionBand = (data) => data.sort((a, b) => a.max - b.max)

const getTrendPeriodLabel = (
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

const getDemographicsFilterTagsData = (search, demographics) => {
  const demographicsFilterTagsData = {}
  demographics.forEach((d) => {
    demographicsFilterTagsData[d.key] = {
      key: d.key,
      title: search[d.key] || '',
    }
  })
  return demographicsFilterTagsData
}

const isAddToStudentGroupEnabled = (isSharedReport, compareByKey) => {
  return [!isSharedReport, compareByKey === compareByKeys.STUDENT].every(
    (e) => e
  )
}

const getHasAvailableExternalTestTypes = (testTypes = []) => {
  const hasAvailableExternalTestTypes = testTypes.some(
    (testType) => !INTERNAL_TEST_TYPES.includes(testType.key)
  )
  return hasAvailableExternalTestTypes
}

const getDefaultTestTypes = (testTypes = []) => {
  const availableExternalTestTypes = testTypes
    .filter((testType) => !INTERNAL_TEST_TYPES.includes(testType.key))
    .map((t) => t.key)
  return [
    TEST_TYPES_VALUES_MAP.COMMON_ASSESSMENT,
    ...availableExternalTestTypes,
  ].join(',')
}

const getDefaultTestTypesForUser = (testTypes = [], userRole) => {
  const availableExternalTestTypes = testTypes
    .filter((testType) => !INTERNAL_TEST_TYPES.includes(testType.key))
    .map((t) => t.key)
  const isAdmin =
    userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN
  return [
    isAdmin
      ? DEFAULT_ADMIN_TEST_TYPE_MAP[userRole]
      : TEST_TYPES_VALUES_MAP.ASSESSMENT,
    ...availableExternalTestTypes,
  ].join(',')
}

const sortTestTypes = (testTypes) => {
  const internalTestTypes = []
  const externalTestTypes = []
  testTypes.forEach((testType) => {
    if (INTERNAL_TEST_TYPES.includes(testType)) {
      internalTestTypes.push(testType)
    } else {
      externalTestTypes.push(testType)
    }
  })
  internalTestTypes.sort(
    (a, b) => INTERNAL_TEST_TYPES_ORDER[a] - INTERNAL_TEST_TYPES_ORDER[b]
  )
  externalTestTypes.sort()
  return [...internalTestTypes, ...externalTestTypes]
}

const getExternalScoreTypesListByTestTypes = (
  testTypesStr,
  availableTestTypes
) => {
  let externalScoreTypesList = []
  const hasAvailableExternalTestTypes = getHasAvailableExternalTestTypes(
    availableTestTypes
  )
  if (hasAvailableExternalTestTypes) {
    externalScoreTypesList = EXTERNAL_SCORE_TYPES_LIST
    if (testTypesStr) {
      const testTypes = testTypesStr.split(',')
      externalScoreTypesList = externalScoreTypesList.filter(({ key }) => {
        const _testTypes = EXTERNAL_SCORE_TYPES_TO_TEST_TYPES[key]
        return (
          isEmpty(_testTypes) || _testTypes.some((t) => testTypes.includes(t))
        )
      })
    }
  }
  return externalScoreTypesList
}

const getScoreSuffix = (isExternal) => (isExternal ? '' : '%')

const getExternalScoreFormattedByType = (
  externalScore,
  externalScoreType,
  formatScore = false
) => {
  let score = Math.abs(round(externalScore, 0))
  if (formatScore) {
    score = new Intl.NumberFormat().format(score)
  }
  const externalScorePrefix =
    externalScore < 0 ? EXTERNAL_SCORE_PREFIX[externalScoreType] : ''
  const externalScoreSuffix = EXTERNAL_SCORE_SUFFIX[externalScoreType] || ''
  return `${externalScorePrefix || ''}${score}${externalScoreSuffix}`
}

module.exports = {
  buildRequestFilters,
  removeFilter,
  getDateLabel,
  filterPopupFilterSelectedTestTypes,
  sortDistributionBand,
  getTrendPeriodLabel,
  getDemographicsFilterTagsData,
  isAddToStudentGroupEnabled,
  getHasAvailableExternalTestTypes,
  getDefaultTestTypes,
  getDefaultTestTypesForUser,
  sortTestTypes,
  getExternalScoreTypesListByTestTypes,
  getScoreSuffix,
  getExternalScoreFormattedByType,
}
