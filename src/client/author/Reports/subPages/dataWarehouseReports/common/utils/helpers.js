import { lightGreen12, lightGrey9, lightRed5 } from '@edulastic/colors'
import React from 'react'
import moment from 'moment'
import qs from 'qs'
import { isEmpty, round } from 'lodash'
import { roleuser } from '@edulastic/constants'
import {
  PERIOD_TYPES,
  RISK_BAND,
  getDistrictGroupTestTermIds,
  getDistrictTermIdsForDistrictGroup,
} from '@edulastic/constants/reportUtils/common'
import {
  ALL_TEST_TYPES_VALUES as INTERNAL_TEST_TYPES,
  TEST_TYPES_VALUES_MAP,
  DEFAULT_ADMIN_TEST_TYPE_MAP_FILTER,
} from '@edulastic/constants/const/testTypes'
import { resetStudentFilters as resetFilters } from '../../../../common/util'
import { allFilterValue } from '../../../../common/constants'
import {
  StyledIconCaretDown,
  StyledIconCaretUp,
} from '../components/styledComponents'
import {
  EXTERNAL_SCORE_PREFIX,
  EXTERNAL_SCORE_SUFFIX,
  EXTERNAL_SCORE_TYPES_LIST,
  EXTERNAL_SCORE_TYPES_TO_TEST_TYPES,
  EXTERNAL_TAG_MAX_CHARS_COUNT,
  INTERNAL_TEST_TYPES_ORDER,
  compareByKeys,
  compareByKeysToFilterKeys,
  nextCompareByKeys,
} from './constants'
import { DW_WLR_REPORT_URL } from '../../../../common/constants/dataWarehouseReports'

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

export const sortDistributionBand = (data) => data.sort((a, b) => a.max - b.max)

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

export const buildDrillDownUrl = ({
  key,
  selectedCompareBy,
  reportFilters,
  reportUrl,
}) => {
  if (isEmpty(key)) return null
  const filterField = compareByKeysToFilterKeys[selectedCompareBy]

  const _filters = {
    ...reportFilters,
    [filterField]: key,
    selectedCompareBy: nextCompareByKeys[selectedCompareBy],
  }

  if (selectedCompareBy === compareByKeys.STUDENT) {
    delete _filters[filterField]
    Object.assign(_filters, {
      courseIds: _filters.courseId,
      testTypes: _filters.assessmentTypes,
      performanceBandProfileId: _filters.profileId,
    })
    return `${DW_WLR_REPORT_URL}${key}?${qs.stringify(_filters, {
      arrayFormat: 'comma',
    })}`
  }
  return `${reportUrl}?${qs.stringify(_filters, { arrayFormat: 'comma' })}`
}

export const getHasAvailableExternalTestTypes = (testTypes = []) => {
  const hasAvailableExternalTestTypes = testTypes.some(
    (testType) => !INTERNAL_TEST_TYPES.includes(testType.key)
  )
  return hasAvailableExternalTestTypes
}

export const getDefaultTestTypes = (testTypes = []) => {
  const availableExternalTestTypes = testTypes
    .filter((testType) => !INTERNAL_TEST_TYPES.includes(testType.key))
    .map((t) => t.key)
  return [
    TEST_TYPES_VALUES_MAP.COMMON_ASSESSMENT,
    ...availableExternalTestTypes,
  ].join(',')
}

export const getDefaultTestTypesForUser = (testTypes = [], userRole) => {
  const availableExternalTestTypes = testTypes
    .filter((testType) => !INTERNAL_TEST_TYPES.includes(testType.key))
    .map((t) => t.key)
  const isAdmin = [
    roleuser.DISTRICT_GROUP_ADMIN,
    roleuser.DISTRICT_ADMIN,
    roleuser.SCHOOL_ADMIN,
  ].includes(userRole)
  return isAdmin
    ? [
        ...(DEFAULT_ADMIN_TEST_TYPE_MAP_FILTER[userRole] || []),
        ...availableExternalTestTypes,
      ].join(',')
    : ''
}

export const sortTestTypes = (testTypes) => {
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

export const getExternalScoreTypesListByTestTypes = (
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

export const getScoreSuffix = (isExternal) => (isExternal ? '' : '%')

export const getExternalScoreFormattedByType = (
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

export const convertItemToArray = (item) =>
  (item && (Array.isArray(item) ? item : item.split(','))) || []

export const getUrlTestTermIds = (schoolYears, testTermIds) =>
  schoolYears.filter((item) => testTermIds && testTermIds.includes(item.key))

export const getUrlDistricts = (districts, districtIds) => {
  const districtIdsArr = convertItemToArray(districtIds)
  return districts.filter((d) => districtIdsArr.includes(d.key))
}

export const getIsMultiSchoolYearDataPresent = (testTermIds) =>
  convertItemToArray(testTermIds).length > 1

export const getTestUniqId = (assessment) =>
  `${assessment.testId}_${assessment.termId}`

export const getXTickTooltipText = (payload, data) => {
  const { shortTestName = '', testName = '', externalTestType = '' } = data[
    payload.index
  ]
  const _testName = externalTestType ? shortTestName : testName
  return (
    <>
      <div>{_testName}</div>
      <b>{externalTestType}</b>
    </>
  )
}

export const getXTickTagText = (payload, data) => {
  const tagText = data[payload.index]?.externalTestType || ''
  if (tagText.length > EXTERNAL_TAG_MAX_CHARS_COUNT)
    // since this text is in svg, we need to add ellipsis manually
    return tagText.slice(0, EXTERNAL_TAG_MAX_CHARS_COUNT - 2).concat('...')
  return tagText
}

export const enhanceQueryWithTermIds = (
  { ...query },
  { orgData, userRole }
) => {
  if (userRole === roleuser.DISTRICT_GROUP_ADMIN) {
    const selectedDistrictIdsArr = convertItemToArray(query.districtIds)
    const {
      districtIds: districtIdsArr,
      termIds: termIdsArr,
    } = getDistrictTermIdsForDistrictGroup(orgData, {
      termId: query.termId,
      districtIds: selectedDistrictIdsArr,
    })
    Object.assign(query, {
      districtIds: districtIdsArr.join(','),
      termIds: termIdsArr.join(','),
    })
  } else {
    const testTermIdsArr = convertItemToArray(query.testTermIds)
    const districtGroupTermIdsArr = getDistrictGroupTestTermIds(
      orgData,
      testTermIdsArr
    )
    const testTermIds = [...testTermIdsArr, ...districtGroupTermIdsArr].join(
      ','
    )
    Object.assign(query, { termIds: query.termId, testTermIds })
  }
  return query
}

export const RISK_LEGEND_PAYLOAD = Object.keys(RISK_BAND).map((riskType) => {
  const { min, max, color, label } = RISK_BAND[riskType]
  const name = `${label.toUpperCase()} (${min}-${max})`
  return { name, color }
})
