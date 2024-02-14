const {
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
  capitalize,
  isEmpty,
  pick,
  invert,
} = require('lodash')
const { produce: next } = require('immer')
const moment = require('moment')
const { lightRed7, yellow3, lightGreen14 } = require('@edulastic/colors')

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| COMMON TRANSFORMERS |-----|-----|-----|----- //

const DECIMAL_BASE = 10
const DEGREE_TO_RADIAN = Math.PI / 180
const ROUND_OFF_TO_INTEGER = true
const EMPTY_ARRAY = []
const EXTERNAL_TEST_KEY_SEPARATOR = '__'
const EXTERNAL_TEST_NAME_SEPARATOR = '-'
const LAST_PAGE_INDEX = -1

const performanceBandKeys = {
  INTERNAL: 'threshold',
  EXTERNAL: 'rank',
}

const TABLE_SORT_ORDER_TYPES = {
  ASCEND: 'ascend',
  DESCEND: 'descend',
}

const DB_SORT_ORDER_TYPES = {
  ASCEND: 'asc',
  DESCEND: 'desc',
}

const tableToDBSortOrderMap = {
  [TABLE_SORT_ORDER_TYPES.ASCEND]: DB_SORT_ORDER_TYPES.ASCEND,
  [TABLE_SORT_ORDER_TYPES.DESCEND]: DB_SORT_ORDER_TYPES.DESCEND,
}

const dbToTableSortOrderMap = invert(tableToDBSortOrderMap)

const calcMethod = {
  MOST_RECENT: 'Most Recent',
  MAX_SCORE: 'Max Score',
  MODE_SCORE: 'Mode Score',
  AVERAGE: 'Simple Average',
  DECAYING_AVERAGE: 'Decaying Average',
  MOVING_AVERAGE: 'Moving Average',
  POWER_LAW: 'Power Law',
}

const studentFiltersDefaultValues = [
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

const DemographicCompareByOptions = [
  'gender',
  'race',
  'gender',
  'frlStatus',
  'ellStatus',
  'iepStatus',
]

const percentage = (
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

const roundedPercentage = partialRight(percentage, true)

const stringCompare = (a_string = '', b_string = '') =>
  (a_string || '').toLowerCase().localeCompare((b_string || '').toLowerCase())

const getVariance = (arr) => {
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

const getStandardDeviation = (variance) =>
  Number(Math.sqrt(variance, 2).toFixed(2))

const getHSLFromRange1 = (val, light = 79) => `hsla(${val}, 100%, ${light}%, 1)`

const getHSLFromRange2 = (val, light = 48) => {
  const tmp = val / 2
  return getHSLFromRange1(tmp, light)
}

const isMobileScreen = () =>
  window.matchMedia('only screen and (max-width: 1033px) and (min-width : 1px)')
    .matches

const getNavigationTabLinks = (list, id) => {
  for (const item of list) {
    item.location += id
  }
}

const getDropDownTestIds = (arr) => {
  const sortedArr = [...arr]
  sortedArr.sort((a, b) => a - b)

  const _arr = sortedArr.map((data) => ({
    key: data.testId,
    title: data.testName,
  }))

  return _arr
}

const filterData = (data, filter) => {
  const filteredData = data.filter(
    (item) =>
      (!filter.gender ||
        filter.gender === 'all' ||
        item.gender.toLowerCase() === filter.gender.toLowerCase()) &&
      (!filter.frlStatus ||
        filter.frlStatus === 'all' ||
        item.frlStatus.toLowerCase() === filter.frlStatus.toLowerCase()) &&
      (!filter.ellStatus ||
        filter.ellStatus === 'all' ||
        item.ellStatus.toLowerCase() === filter.ellStatus.toLowerCase()) &&
      (!filter.iepStatus ||
        filter.iepStatus === 'all' ||
        item.iepStatus.toLowerCase() === filter.iepStatus.toLowerCase()) &&
      (!filter.race ||
        filter.race === 'all' ||
        item.race.toLowerCase() === filter.race.toLowerCase()) &&
      (!filter.hispanicEthnicity ||
        filter.hispanicEthnicity === 'all' ||
        item.hispanicEthnicity.toLowerCase() ===
          filter.hispanicEthnicity.toLowerCase())
  )
  return filteredData
}

const processFilteredClassAndGroupIds = (orgDataArr, currentFilter) => {
  const byGroupId = groupBy(
    orgDataArr.filter((item) => {
      const checkForGrades =
        (item.grades || '')
          .split(',')
          .filter((g) => g.length)
          .includes(currentFilter.grade) || currentFilter.grade === 'All'
      const checkForSchool =
        !currentFilter.schoolId ||
        currentFilter.schoolId === 'All' ||
        (item.groupType === 'class' && item.schoolId === currentFilter.schoolId)
      if (
        item.groupId &&
        checkForGrades &&
        checkForSchool &&
        (item.subject === currentFilter.subject ||
          currentFilter.subject === 'All') &&
        (item.courseId === currentFilter.courseId ||
          currentFilter.courseId === 'All')
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

const processClassAndGroupIds = (orgDataArr) => {
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

const processSchoolIds = (orgDataArr) => {
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

const processTeacherIds = (orgDataArr) => {
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

const getOverallScore = (metrics = []) =>
  metrics.length
    ? sumBy(metrics, (item) =>
        percentage(
          parseFloat(item.totalScore) || 0,
          parseFloat(item.maxScore) || 1
        )
      ) / metrics.length
    : 0

const filterAccordingToRole = (columns, role) =>
  columns.filter((column) => !includes(column.hiddenFromRole, role))

const addColors = (data = [], selectedData, xDataKey, scoreKey = 'avgScore') =>
  map(data, (item) =>
    next(item, (draft) => {
      draft.fill =
        includes(selectedData, item[xDataKey]) || !selectedData.length
          ? getHSLFromRange1(item[scoreKey])
          : '#cccccc'
    })
  )

const getLeastProficiencyBand = (bandInfo = []) =>
  orderBy(bandInfo, 'threshold', ['desc'])[bandInfo.length - 1] || {}

const getProficiencyBand = (score, bandInfo, field = 'threshold') => {
  const bandInfoWithColor = map(
    orderBy(bandInfo, 'threshold'),
    (band, index) => ({
      ...band,
      rank: index,
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

const toggleItem = (items, item) =>
  next(items, (draftState) => {
    const index = indexOf(items, item)
    if (index > -1) {
      draftState.splice(index, 1)
    } else {
      draftState.push(item)
    }
  })

const convertTableToCSV = (refComponent) => {
  const rows = refComponent.querySelectorAll('table')[0].querySelectorAll('tr')
  const csv = []
  const csvRawData = []
  for (let i = 0; i < rows.length; i++) {
    const row = []
    const cols = rows[i].querySelectorAll('td, th')
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

const downloadCSV = (filename, data) => {
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

/**
 *
 * | nameParts                          | formatName(nameParts, { lastNameFirst: true }) | formatName(nameParts, { lastNameFirst: false }) |
 * | ---------------------------------- | ---------------------------------------------- | ----------------------------------------------- |
 * | `['john', 'doe']`                  | `Doe, John`                                    | `John Doe`                                      |
 * | `['john', 'doe', 'smith']`         | `Smith, John Doe`                              | `John Doe Smith`                                |
 * | `['john', 'doe', undefined]`       | `John Doe`                                     | `John Doe`                                      |
 * | `['john', undefined, 'doe smith']` | `Doe smith, John`                              | `John Doe smith`                                |
 *
 * @param {string[] | {firstName?: string, middleName?: string, lastName?: string}} nameParts
 * @param {{lastNameFirst?: boolean}} [options={}]
 */
function formatName(nameParts, { lastNameFirst = true } = {}) {
  nameParts = Array.isArray(nameParts)
    ? nameParts
    : [nameParts.firstName, nameParts.middleName, nameParts.lastName]
  const hasLastName = !!nameParts[nameParts.length - 1]
  nameParts = nameParts.filter(Boolean).map(capitalize)

  if (lastNameFirst && hasLastName) {
    const lastName = nameParts.pop()
    return nameParts.length ? `${lastName}, ${nameParts.join(' ')}` : lastName
  }

  return nameParts.join(' ')
}

const getStudentAssignments = (scaleInfo = [], studentStandardData = []) => {
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
    (s) =>
      s.score ===
      round((studentStandardData[0] && studentStandardData[0].fm) || 1)
  )
  const overallStandardBasedScore = `${
    (overallScale && overallScale.score) || ''
  }(${(overallScale && overallScale.masteryLabel) || ''})`
  const calcType = calcMethod[overallScale && overallScale.calcType] || ''
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

const formatDate = (milliseconds, showTime) => {
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

const resetStudentFilters = (
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
    const filtersToReset = defaultValues.slice(2)
    resetFilter(filtersToReset, prevFilters, tagsData)
  }
}

const stringifyArrayFilters = (filters) =>
  Object.keys(filters).reduce((res, k) => {
    res[k] = Array.isArray(filters[k]) ? filters[k].join(',') : filters[k]
    return res
  }, {})

const curateApiFiltersQuery = (
  rawQuery,
  reportFilterFields,
  sharedReportFilterFields
) => {
  const { reportId } = rawQuery
  const fieldsToPick = isEmpty(reportId)
    ? reportFilterFields
    : sharedReportFilterFields
  const query = pick(rawQuery, fieldsToPick)
  const queryStr = Object.keys(query)
    .sort((fieldKey1, fieldKey2) =>
      String(fieldKey1).localeCompare(String(fieldKey2))
    )
    .map((fieldKey) => `${fieldKey}=${query[fieldKey]}`)
    .join('&')
  return { query, queryStr }
}

const getDistrictIdsForDistrictGroup = (orgData, { districtIds }) => {
  const { districtGroup = {} } = orgData || {}
  const { districts = [] } = districtGroup
  const filteredDistrictIds = districts
    .filter((t) => !districtIds.length || districtIds.includes(t.districtId))
    .map((t) => t._id)
  return filteredDistrictIds
}

const getDistrictTermIdsForDistrictGroup = (
  orgData,
  { termId, districtIds }
) => {
  const { districtGroup = {} } = orgData || {}
  const { districtTerms = [], terms = [] } = districtGroup
  const termName = terms.find((t) => t._id === termId)?.name || ''
  const filteredDistrictTermIds = districtTerms
    .filter(
      (t) =>
        (!districtIds.length || districtIds.includes(t.districtId)) &&
        t.name === termName
    )
    .map((t) => t._id)
  return filteredDistrictTermIds
}

const getDistrictGroupTestTermIds = (orgData, testTermIds) => {
  const { terms = [], districtGroup } = orgData || {}
  const districtGroupTerms = districtGroup?.terms || EMPTY_ARRAY
  const testTermNames = terms
    .filter(({ _id }) => testTermIds.includes(_id))
    .map(({ name }) => name)
  const filteredDistrictGroupTermIds = districtGroupTerms
    .filter(({ name }) => testTermNames.includes(name))
    .map(({ _id }) => _id)
  return filteredDistrictGroupTermIds
}

// -----|-----|-----|-----| COMMON TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| BACKEND SPECIFIC TRANSFORMERS |-----|-----|-----|----- //

const getCsvDataFromTableBE = (tableData, tableColumns) => {
  const csvHeadings = tableColumns.map((col) => col.title || '')
  const csvData = tableData.map((record) =>
    tableColumns.map((col) => {
      const dataKey = col.dataIndex || col.key
      const data = record[dataKey]
      return `${col.render ? col.render(data, record) : data}`
    })
  )
  return [csvHeadings, ...csvData]
}

const getDropdownOptions = (keysObj, namesObj) =>
  Object.values(keysObj).map((key) => ({
    key,
    title: namesObj[key],
  }))

const SUBJECTS = [
  'Mathematics',
  'ELA',
  'Science',
  'Social Studies',
  'Computer Science',
  'Other Subjects',
]

const SUBJECT_OPTIONS = SUBJECTS.map((key) => ({ key, title: key }))

const GRADE_KEYS = {
  PRE_KG: 'TK',
  KG: 'K',
  GRADE_1: '1',
  GRADE_2: '2',
  GRADE_3: '3',
  GRADE_4: '4',
  GRADE_5: '5',
  GRADE_6: '6',
  GRADE_7: '7',
  GRADE_8: '8',
  GRADE_9: '9',
  GRADE_10: '10',
  GRADE_11: '11',
  GRADE_12: '12',
  OTHER: 'O',
}

const GRADES = {
  [GRADE_KEYS.PRE_KG]: 'PreKindergarten',
  [GRADE_KEYS.KG]: 'Kindergarten',
  [GRADE_KEYS.GRADE_1]: 'Grade 1',
  [GRADE_KEYS.GRADE_2]: 'Grade 2',
  [GRADE_KEYS.GRADE_3]: 'Grade 3',
  [GRADE_KEYS.GRADE_4]: 'Grade 4',
  [GRADE_KEYS.GRADE_5]: 'Grade 5',
  [GRADE_KEYS.GRADE_6]: 'Grade 6',
  [GRADE_KEYS.GRADE_7]: 'Grade 7',
  [GRADE_KEYS.GRADE_8]: 'Grade 8',
  [GRADE_KEYS.GRADE_9]: 'Grade 9',
  [GRADE_KEYS.GRADE_10]: 'Grade 10',
  [GRADE_KEYS.GRADE_11]: 'Grade 11',
  [GRADE_KEYS.GRADE_12]: 'Grade 12',
  [GRADE_KEYS.OTHER]: 'Other',
}

const GRADE_OPTIONS = getDropdownOptions(GRADE_KEYS, GRADES)

const PERIOD_TYPES = {
  TILL_DATE: 'TILL_DATE',
  THIS_MONTH: 'THIS_MONTH',
  THIS_QUARTER: 'THIS_QUARTER',
  LAST_MONTH: 'LAST_MONTH',
  LAST_QUARTER: 'LAST_QUARTER',
  CUSTOM: 'CUSTOM',
}
const PERIOD_NAMES = {
  [PERIOD_TYPES.TILL_DATE]: 'Till Date',
  [PERIOD_TYPES.THIS_MONTH]: 'This Month',
  [PERIOD_TYPES.THIS_QUARTER]: 'This Quarter',
  [PERIOD_TYPES.LAST_MONTH]: 'Last Month',
  [PERIOD_TYPES.LAST_QUARTER]: 'Last Quarter',
  [PERIOD_TYPES.CUSTOM]: 'Custom',
}

const RISK_TYPE_KEYS = {
  OVERALL: 'overall',
  ACADEMIC: 'academic',
  ATTENDANCE: 'attendance',
}

const RISK_TYPE_NAMES = {
  [RISK_TYPE_KEYS.OVERALL]: 'Overall Risk',
  [RISK_TYPE_KEYS.ACADEMIC]: 'Academic Risk',
  [RISK_TYPE_KEYS.ATTENDANCE]: 'Attendance Risk',
}

const RISK_TYPE_OPTIONS = getDropdownOptions(RISK_TYPE_KEYS, RISK_TYPE_NAMES)

const RISK_BAND_LABELS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}

const RISK_BAND_LEVELS = {
  [RISK_BAND_LABELS.HIGH]: 2,
  [RISK_BAND_LABELS.MEDIUM]: 1,
  [RISK_BAND_LABELS.LOW]: 0,
}

const RISK_BAND_COLOR_INFO = {
  [RISK_BAND_LABELS.HIGH]: lightRed7,
  [RISK_BAND_LABELS.MEDIUM]: yellow3,
  [RISK_BAND_LABELS.LOW]: lightGreen14,
}

// -----|-----|-----|-----| BACKEND SPECIFIC TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

module.exports = {
  DECIMAL_BASE,
  DEGREE_TO_RADIAN,
  ROUND_OFF_TO_INTEGER,
  EMPTY_ARRAY,
  EXTERNAL_TEST_KEY_SEPARATOR,
  EXTERNAL_TEST_NAME_SEPARATOR,
  LAST_PAGE_INDEX,
  DB_SORT_ORDER_TYPES,
  TABLE_SORT_ORDER_TYPES,
  tableToDBSortOrderMap,
  dbToTableSortOrderMap,
  performanceBandKeys,
  DemographicCompareByOptions,
  percentage,
  roundedPercentage,
  stringCompare,
  getVariance,
  getStandardDeviation,
  getHSLFromRange1,
  getHSLFromRange2,
  isMobileScreen,
  getNavigationTabLinks,
  getDropDownTestIds,
  filterData,
  processFilteredClassAndGroupIds,
  processClassAndGroupIds,
  processSchoolIds,
  processTeacherIds,
  getOverallScore,
  filterAccordingToRole,
  addColors,
  getLeastProficiencyBand,
  getProficiencyBand,
  toggleItem,
  convertTableToCSV,
  downloadCSV,
  formatName,
  getStudentAssignments,
  formatDate,
  resetStudentFilters,
  stringifyArrayFilters,
  curateApiFiltersQuery,
  getCsvDataFromTableBE,
  getDistrictIdsForDistrictGroup,
  getDistrictTermIdsForDistrictGroup,
  getDistrictGroupTestTermIds,
  PERIOD_TYPES,
  PERIOD_NAMES,
  SUBJECTS,
  SUBJECT_OPTIONS,
  GRADE_KEYS,
  GRADES,
  GRADE_OPTIONS,
  RISK_TYPE_KEYS,
  RISK_TYPE_OPTIONS,
  RISK_BAND_LABELS,
  RISK_BAND_LEVELS,
  RISK_BAND_COLOR_INFO,
}
