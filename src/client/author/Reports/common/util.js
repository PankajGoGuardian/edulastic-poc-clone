import {
  partialRight,
  ceil,
  groupBy,
  sumBy,
  includes,
  map,
  orderBy,
  round,
  find,
  indexOf,
  keyBy,
  pullAllBy,
  capitalize,
  uniqBy,
  uniq,
  isEmpty,
} from 'lodash'
import qs from 'qs'
import next from 'immer'
import moment from 'moment'
import {
  DW_DASHBOARD_REPORT,
  reportGroupType,
  reportNavType,
} from '@edulastic/constants/const/report'
import { testTypes as testTypesConstants } from '@edulastic/constants'
import calcMethod from './static/json/calcMethod.json'
import navigation from './static/json/navigation.json'
import gradesMap from './static/json/gradesMap.json'
import { allFilterValue } from './constants'
import {
  groupByConstants,
  groupByOptions,
} from '../subPages/dataWarehouseReports/AttendanceSummary/utils/constants'
import { shortTestIdKeyLength } from '../../Assignments/constants'

// TODO break into directory like util -> {constants.js, chart.js, filters.js, index.js, etc.}

const { TEST_TYPES } = testTypesConstants

const testTypeKeyToCategoryMap = {
  ...TEST_TYPES.COMMON.reduce((res, ele) => ({ ...res, [ele]: 'common' }), {}),
  ...TEST_TYPES.ASSESSMENT.reduce(
    (res, ele) => ({ ...res, [ele]: 'assessment' }),
    {}
  ),
  ...TEST_TYPES.PRACTICE.reduce(
    (res, ele) => ({ ...res, [ele]: 'practice' }),
    {}
  ),
}

const studentFiltersDefaultValues = [
  {
    key: 'networkIds',
    value: '',
  },
  {
    key: 'schoolIds',
    value: '',
  },
  {
    key: 'teacherIds',
    value: '',
  },
  {
    key: '',
    nestedFilters: [
      {
        key: 'classIds',
        value: '',
      },
      {
        key: 'groupIds',
        value: '',
      },
    ],
  },
]

export const DemographicCompareByOptions = [
  'gender',
  'race',
  'gender',
  'frlStatus',
  'ellStatus',
  'iepStatus',
  'hispanicEthnicity',
]

export const percentage = (
  numerator = 0,
  denominator = 0,
  roundCalculation = false
) => {
  if (numerator == 0 && denominator == 0) {
    return 0
  }

  const calculatedPercentage = (numerator / denominator) * 100
  return roundCalculation ? round(calculatedPercentage) : calculatedPercentage
}

export const roundedPercentage = partialRight(percentage, true)

export const stringCompare = (a_string = '', b_string = '') =>
  (a_string || '').toLowerCase().localeCompare((b_string || '').toLowerCase())

export const getVariance = (arr) => {
  let sum = 0
  for (let i = 0; i < arr.length; i++) {
    sum += Number(arr[i])
  }
  const mean = sum / arr.length

  sum = 0
  for (let i = 0; i < arr.length; i++) {
    sum += (arr[i] - mean) ** 2
  }

  const variance = Number((sum / arr.length).toFixed(2))
  return variance
}
export const getStandardDeviation = (variance) =>
  Number(Math.sqrt(variance, 2).toFixed(2))

export const getHSLFromRange1 = (val, light = 79) =>
  `hsla(${val}, 100%, ${light}%, 1)`

export const getHSLFromRange2 = (val, light = 48) => {
  const tmp = val / 2
  return getHSLFromRange1(tmp, light)
}

export const isMobileScreen = () =>
  window.matchMedia('only screen and (max-width: 1033px) and (min-width : 1px)')
    .matches

export const getNavigationTabLinks = (list, id) => {
  for (const item of list) {
    item.location += id
  }
}

export const getDropDownTestIds = (arr) => {
  const sortedArr = [...arr]
  sortedArr.sort((a, b) => a - b)

  const _arr = sortedArr.map((data) => ({
    key: data.testId,
    title: data.testName,
  }))

  return _arr
}

export const filterData = (data, filter) => {
  const filteredData = data.filter(
    (item) =>
      (!filter.gender ||
        filter.gender === allFilterValue ||
        item.gender.toLowerCase() === filter.gender.toLowerCase()) &&
      (!filter.frlStatus ||
        filter.frlStatus === allFilterValue ||
        item.frlStatus.toLowerCase() === filter.frlStatus.toLowerCase()) &&
      (!filter.ellStatus ||
        filter.ellStatus === allFilterValue ||
        item.ellStatus.toLowerCase() === filter.ellStatus.toLowerCase()) &&
      (!filter.iepStatus ||
        filter.iepStatus === allFilterValue ||
        item.iepStatus.toLowerCase() === filter.iepStatus.toLowerCase()) &&
      (!filter.race ||
        filter.race === allFilterValue ||
        item.race.toLowerCase() === filter.race.toLowerCase()) &&
      (!filter.hispanicEthnicity ||
        filter.hispanicEthnicity === allFilterValue ||
        item.hispanicEthnicity.toLowerCase() ===
          filter.hispanicEthnicity.toLowerCase())
  )
  return filteredData
}

export const processFilteredClassAndGroupIds = (orgDataArr, currentFilter) => {
  const byGroupId = groupBy(
    orgDataArr.filter((item) => {
      const checkForGrades =
        (item.grades || '')
          .split(',')
          .filter((g) => g.length)
          .includes(currentFilter.grade) ||
        currentFilter.grade?.toLowerCase() === allFilterValue
      const checkForSchool =
        !currentFilter.schoolId ||
        currentFilter.schoolId.toLowerCase() === allFilterValue ||
        (item.groupType === 'class' && item.schoolId === currentFilter.schoolId)
      if (
        item.groupId &&
        checkForGrades &&
        checkForSchool &&
        (item.subject === currentFilter.subject ||
          currentFilter.subject?.toLowerCase() === allFilterValue) &&
        (item.courseId === currentFilter.courseId ||
          currentFilter.courseId?.toLowerCase() === allFilterValue)
      ) {
        return true
      }
      return false
    }),
    'groupId'
  )
  const classIdArr = [{ key: 'All', title: 'All Classes', groupType: 'class' }]
  const groupIdArr = [{ key: 'All', title: 'All Groups', groupType: 'custom' }]
  Object.keys(byGroupId).forEach((item) => {
    const ele = {
      key: byGroupId[item][0].groupId,
      title: byGroupId[item][0].groupName,
      groupType: byGroupId[item][0].groupType,
    }
    ele.groupType === 'class' ? classIdArr.push(ele) : groupIdArr.push(ele)
  })

  return [classIdArr, groupIdArr]
}

export const processClassAndGroupIds = (orgDataArr) => {
  const byGroupId = groupBy(
    orgDataArr.filter((item) => !!item.groupId),
    'groupId'
  )
  const classIdArr = [{ key: 'All', title: 'All Classes', groupType: 'class' }]
  const groupIdArr = [{ key: 'All', title: 'All Groups', groupType: 'custom' }]
  Object.keys(byGroupId).forEach((item) => {
    const ele = {
      key: byGroupId[item][0].groupId,
      title: byGroupId[item][0].groupName,
      groupType: byGroupId[item][0].groupType,
    }
    // differentiate groups and classes into individual arrays
    ele.groupType === 'class' ? classIdArr.push(ele) : groupIdArr.push(ele)
  })

  return [classIdArr, groupIdArr]
}

export const processSchoolIds = (orgDataArr) => {
  const bySchoolId = groupBy(
    orgDataArr.filter((item) => !!item.schoolId),
    'schoolId'
  )
  const schoolIdArr = Object.keys(bySchoolId).map((item) => ({
    key: bySchoolId[item][0].schoolId,
    title: bySchoolId[item][0].schoolName,
  }))
  schoolIdArr.unshift({
    key: 'All',
    title: 'All Schools',
  })

  return schoolIdArr
}

export const processTeacherIds = (orgDataArr) => {
  const byTeacherId = groupBy(
    orgDataArr.filter((item) => !!item.teacherId),
    'teacherId'
  )
  const teacherIdArr = Object.keys(byTeacherId).map((item) => ({
    key: byTeacherId[item][0].teacherId,
    title: byTeacherId[item][0].teacherName,
  }))
  teacherIdArr.unshift({
    key: 'All',
    title: 'All Teachers',
  })

  return teacherIdArr
}

export const getOverallScore = (metrics = []) =>
  metrics.length
    ? sumBy(metrics, (item) =>
        percentage(
          parseFloat(item.totalScore) || 0,
          parseFloat(item.maxScore) || 1
        )
      ) / metrics.length
    : 0

export const filterAccordingToRole = (columns, role) =>
  columns.filter((column) => !includes(column.hiddenFromRole, role))

export const getLeastProficiencyBand = (bandInfo = []) =>
  orderBy(bandInfo, 'threshold', ['desc'])[bandInfo.length - 1] || {}

export const getProficiencyBand = (score, bandInfo, field = 'threshold') => {
  const bandInfoWithColor = map(
    orderBy(bandInfo, 'threshold'),
    (band, index) => ({
      ...band,
      color: band.color
        ? band.color
        : getHSLFromRange1(round((100 / (bandInfo.length - 1)) * index)),
    })
  )
  const orderedScaleInfo = orderBy(bandInfoWithColor, 'threshold', ['desc'])
  return (
    find(orderedScaleInfo, (info) => ceil(score) >= info[field]) ||
    getLeastProficiencyBand(orderedScaleInfo)
  )
}

export const toggleItem = (items, item) =>
  next(items, (draftState) => {
    const index = indexOf(items, item)
    if (index > -1) {
      draftState.splice(index, 1)
    } else {
      draftState.push(item)
    }
  })

export const convertTableToCSV = (refComponent, getColumnHeaders = null) => {
  const rows = refComponent.querySelectorAll('table')[0].querySelectorAll('tr')
  const startIndex = getColumnHeaders ? 1 : 0
  const csv = []
  const csvRawData = []
  if (getColumnHeaders) {
    const columnHeaders = getColumnHeaders()
    const columnHeaderRows = Object.keys(columnHeaders)
    columnHeaderRows.forEach((r) => {
      const rw = []
      for (let j = 0; j < columnHeaders[r].length; j++) {
        let data = columnHeaders[r][j]
          .replace(/(\r\n|\n|\r)/gm, ' ')
          .replace(/(\s+)/gm, ' ')
        data = data.replace(/"/g, '""')
        rw.push(`"${data}"`)
      }
      csv.push(rw.join(','))
      csvRawData.push(rw)
    })
  }

  for (let i = startIndex; i < rows.length; i++) {
    const row = []
    const selectorSet = getColumnHeaders ? 'td' : 'td, th'
    const cols = rows[i].querySelectorAll(selectorSet)
    for (let j = 0; j < cols.length; j++) {
      if (cols[j].getElementsByClassName('ant-checkbox').length > 0) continue
      let data = (cols[j].innerText || cols[j].textContent)
        .replace(/(\r\n|\n|\r)/gm, ' ')
        .replace(/(\s+)/gm, ' ')
      data = data.replace(/"/g, '""')
      row.push(`"${data}"`)
    }
    csv.push(row.join(','))
    csvRawData.push(row)
  }
  return {
    csvText: csv.join('\n'),
    csvRawData,
  }
}

export const downloadCSV = (filename, data) => {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.setAttribute('target', '_blank')
  link.setAttribute(
    'href',
    `data:text/csv;charset=utf-8,${encodeURIComponent(data)}`
  )
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const getStudentAssignments = (
  scaleInfo = [],
  studentStandardData = []
) => {
  const scaleMap = keyBy(scaleInfo, 'score')
  const assignments = studentStandardData
    .sort((a, b) => a.insertedAt - b.insertedAt)
    .map((data) => {
      const score = round(percentage(data.obtainedScore, data.maxScore))
      const scale =
        scaleMap[data.assignmentMastery] || getProficiencyBand(score, scaleInfo)
      return {
        score,
        scale,
        standardBasedScore: `${data.assignmentMastery}(${scale.masteryLabel})`,
        assessmentName: data.testName,
        questions: data.questions,
        obtainedScore: data.obtainedScore,
        maxScore: data.maxScore,
        performance: data.performance,
        standardMastery: data.standardMastery,
      }
    })

  const maxScoreTotal = sumBy(assignments, 'maxScore') || 0
  const obtainedScoreTotal = sumBy(assignments, 'obtainedScore') || 0
  const scoreAvg = round(percentage(obtainedScoreTotal, maxScoreTotal)) || 0
  const overallScale = scaleInfo.find(
    (s) => s.score === round(studentStandardData[0]?.fm || 1)
  )
  const overallStandardBasedScore = `${overallScale?.score || ''}(${
    overallScale?.masteryLabel || ''
  })`
  const calcType = calcMethod[overallScale?.calcType] || ''
  const overallAssessmentName = `Current Mastery (${calcType})`

  const overallAssignmentDetail = {
    maxScore: maxScoreTotal,
    obtainedScore: obtainedScoreTotal,
    score: scoreAvg,
    scale: overallScale,
    standardBasedScore: overallStandardBasedScore,
    assessmentName: overallAssessmentName,
    questions: 'N/A',
  }

  return [...assignments, overallAssignmentDetail]
}

export const formatDate = (milliseconds, showTime) => {
  if (showTime && milliseconds) {
    return moment(parseInt(milliseconds, 10)).format('MMM DD, YYYY, h:mm A')
  }
  return milliseconds
    ? moment(parseInt(milliseconds, 10)).format('MMM DD, YYYY')
    : 'NA'
}

const resetFilter = (filtersToReset, prevFilters, tagsData) => {
  for (const filter of filtersToReset) {
    if (filter.nestedFilters) {
      resetFilter(filter.nestedFilters, prevFilters, tagsData)
    } else {
      prevFilters[filter.key] = filter.value
      delete tagsData[filter.key]
    }
  }
}

export const resetStudentFilters = (
  tagsData,
  prevFilters,
  key,
  selected,
  defaultValues = studentFiltersDefaultValues
) => {
  const index = defaultValues.findIndex((s) => s.key === key)
  if (index !== -1 && prevFilters[key] !== selected) {
    const filtersToReset = defaultValues.slice(index + 1)
    resetFilter(filtersToReset, prevFilters, tagsData)
  } else if (['grades', 'subjects', 'courseId'].includes(key)) {
    const filtersToReset = defaultValues.slice(3)
    resetFilter(filtersToReset, prevFilters, tagsData)
  }
}

export const combineNames = (list) =>
  list.map((t) => ({
    ...t,
    name: [t.firstName, t.middleName, t.lastName]
      .filter((n) => n)
      .join(' ')
      .trim(),
  }))

export const getAssessmentName = (test) => {
  const [key, title] = [test._id || test.key, test.title]
  return `${title} (ID:${key.substring(key.length - shortTestIdKeyLength)})`
}

export const getTooltipArrowStyles = ({ tooltipType, tooltipArrowMargin }) => {
  let style
  switch (tooltipType) {
    case 'right':
      style = {
        left: '-15px',
        bottom: `${
          tooltipArrowMargin ? `calc(50% - ${tooltipArrowMargin}px)` : '50%'
        }`,
        transform: 'translateY(50%) rotate(90deg)',
      }
      break
    case 'left':
      style = {
        left: '195px',
        bottom: `${
          tooltipArrowMargin ? `calc(50% - ${tooltipArrowMargin}px)` : '50%'
        }`,
        transform: 'translateY(50%) rotate(-90deg)',
      }
      break

    case 'bottom':
      style = {
        left: `50%`,
        top: `-10px`,
        transform: 'translateX(-50%) rotate(180deg)',
      }
      break

    default:
      style = {
        left: '50%',
        bottom: '-10px',
        transform: 'translateX(-50%)',
      }
  }
  return style
}

export const setProperties = (ref, obj) => {
  const keys = Object.keys(obj)
  keys.forEach((key) => {
    ref.current.style.setProperty(key, obj[key])
  })
}

export const getHoveredBarDimensions = (event) => {
  const attributes = event.target.parentNode.attributes
  const width = 45
  if (Number.isNaN(width)) return
  const height = +attributes.height?.nodeValue
  const x = +attributes.x?.nodeValue
  const y = +attributes.y?.nodeValue
  const d = {
    x,
    y,
    width,
    height,
  }
  return d
}

export const tooltipParams = {
  tooltipWidth: 200,
  maxTooltipHeight: 250,
  spaceForLittleTriangle: 10,
  spaceForPercentageLabel: 20,
  navButtonMargin: 50,
  xAxisHeight: 100,
}

export const computeChartNavigationLinks = ({
  requestFilters,
  loc,
  hideOtherTabs = false,
}) => {
  let navigationItems = []
  if (navigation.locToData[loc]) {
    requestFilters = requestFilters || {}
    const requestFilterKeys = Object.keys(requestFilters)
    const _filters = {}
    requestFilterKeys.forEach((item) => {
      const val =
        requestFilters[item] === '' && item !== 'reportId'
          ? capitalize(allFilterValue)
          : requestFilters[item]
      _filters[item] = val
    })
    const _navigationItems = navigation.navigation[
      navigation.locToData[loc].group
    ].filter((item) => {
      if (hideOtherTabs) return item.key === loc
      return true
    })
    navigationItems = next(_navigationItems, (draft) => {
      draft.forEach((item) => {
        if (item.key !== reportNavType.DW_GOALS_AND_INTERVENTIONS_REPORT) {
          item.location += `?${qs.stringify(_filters, {
            arrayFormat: 'comma',
          })}`
        }
      })
      return draft
    })
  }
  return navigationItems
}

export const getHeaderSettings = (
  reportType,
  navigationItems,
  location,
  dynamicBreadcrumb,
  onShareClickCB,
  onPrintClickCB,
  onDownloadCSVClickCB,
  onRefineResultsCB
) => {
  const {
    STANDARD_REPORT,
    CUSTOM_REPORT,
    SHARED_REPORT,
    DATA_WAREHOUSE_REPORT,
  } = reportGroupType

  const isReportGroup = [
    STANDARD_REPORT,
    CUSTOM_REPORT,
    SHARED_REPORT,
    DATA_WAREHOUSE_REPORT,
  ].some((group) => reportType === group)

  if (!reportType || isReportGroup) {
    const breadcrumbInfo = navigation.locToData[reportType].breadcrumb
    if (reportType === CUSTOM_REPORT && dynamicBreadcrumb) {
      const isCustomReportLoading =
        location.pathname.split(CUSTOM_REPORT)[1].length > 1 || false
      if (isCustomReportLoading) {
        breadcrumbInfo.push({
          title: dynamicBreadcrumb,
          to: '',
        })
      }
      pullAllBy(breadcrumbInfo, [{ to: '' }], 'to')
    }
    return {
      loc: reportType,
      group: navigation.locToData[reportType].group,
      title: navigation.locToData[reportType].title,
      breadcrumbData: breadcrumbInfo,
      navigationItems,
    }
  }
  const breadcrumbInfo = [...navigation.locToData[reportType].breadcrumb]
  const reportId = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  }).reportId
  const isSharedReport = !!(
    reportId && reportId.toLowerCase() !== allFilterValue
  )
  if (isSharedReport) {
    breadcrumbInfo[0] = navigation.locToData[SHARED_REPORT].breadcrumb[0]
  }
  if (reportType === DW_DASHBOARD_REPORT) {
    onDownloadCSVClickCB = undefined
  }
  return {
    loc: reportType,
    group: navigation.locToData[reportType].group,
    title: navigation.locToData[reportType].title,
    onShareClickCB,
    onPrintClickCB,
    onDownloadCSVClickCB,
    onRefineResultsCB,
    breadcrumbData: breadcrumbInfo,
    navigationItems,
    isSharedReport,
  }
}

export const getSelectedCompareBy = ({
  search = qs.parse(window.location.search),
  settings = {},
  compareByOptions,
}) => {
  let [selectedCompareBy] = compareByOptions
  if (search.selectedCompareBy) {
    selectedCompareBy =
      compareByOptions.find((o) => o.key === search.selectedCompareBy) ||
      selectedCompareBy
  } else if (settings.selectedCompareBy?.key) {
    selectedCompareBy = settings.selectedCompareBy
  }
  return selectedCompareBy
}

export const getSelectedGroupBy = (search) => {
  if (groupByOptions.includes(search.groupBy)) {
    return search.groupBy
  }
  return groupByConstants.MONTH
}

export function removeFilter(
  filterTagsData,
  filters,
  initialFilters,
  type,
  key
) {
  const _filterTagsData = { ...filterTagsData }
  const _filters = { ...filters }
  resetStudentFilters(_filterTagsData, _filters, type, '')
  if (filters[type] === key) {
    // handles single selection filters
    _filters[type] = initialFilters[type]
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

export function utcMonthDate(date) {
  const formatYYYYMMDD = 'YYYY-MM-DD'
  const dateStringInYYYYMMDDD = moment(date).format(formatYYYYMMDD)
  return +moment.utc(dateStringInYYYYMMDDD)
}

export const getPerformanceBandsListByTestType = (
  prevPerformanceBandsList,
  testTypes,
  defaultPBIdToTTMap
) => {
  const testTypeKeys = testTypes.map(({ key }) => key)
  const _performanceBandsList = (testTypeKeys || [])
    .map((ttk) => {
      const pbId = defaultPBIdToTTMap[testTypeKeyToCategoryMap[ttk]]
      const pb = prevPerformanceBandsList.find((p) => p.key === pbId)
      return pbId && pb ? pb : null
    })
    .filter((t) => !!t)
  const performanceBandsList = uniqBy(
    [..._performanceBandsList, ...prevPerformanceBandsList],
    'key'
  )

  return performanceBandsList
}

export const getGrades = (studInfo = []) =>
  uniq(studInfo.flatMap((s = {}) => (s.grades ? s.grades.split(',') : [])))
    .map((grade) => gradesMap[grade])
    .join(', ')

export const getSchools = (studInfo = []) =>
  uniq(studInfo.flatMap((s = {}) => s.schoolName || [])).join(', ')

/**
 * Function to get error message
 * @param {Object} error - error object
 * @param {number} statusCode - statusCode to check for
 * @param {string} defaultMessage - default error message if statusCode does not match
 * @returns {string} error message to be displayed
 */
export const getErrorMessage = (error, statusCode, defaultMessage) => {
  if (!isEmpty(error?.response) && error.response.status === statusCode)
    return error.message
  return defaultMessage
}

/**
 * Function to convert list of records to filter dropdown options
 * @param {Record} data Array of all records
 * @param {string} keyName data key for key in filter options
 * @param {string} titleName data key for title in filter options
 * @returns filter options with key & title values
 */
export const getFilterOptions = (data, keyName, titleName) => {
  const uniqueRecords = uniqBy(data, keyName)
  return uniqueRecords.map((record) => ({
    key: record[keyName],
    title: record[titleName],
  }))
}
