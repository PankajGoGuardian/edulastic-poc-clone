const {
  max,
  min,
  filter,
  map,
  find,
  orderBy,
  ceil,
  groupBy,
  sumBy,
  floor,
  forEach,
  maxBy,
  get,
  round,
  upperFirst,
} = require('lodash')
const moment = require('moment')

const {
  filterAccordingToRole,
  filterData,
  formatDate,
  getCsvDataFromTableBE,
  getFormattedName,
} = require('../common')

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| COMMON TRANSFORMERS |-----|-----|-----|----- //

const tableColumns = [
  {
    title: 'Performance Band',
    sortable: true,
    type: 'name',
    dataIndex: 'proficiencyBand',
    key: 'proficiencyBand',
    width: 250,
    fixed: 'left',
    align: 'left',
  },
  {
    title: 'Student',
    sortable: true,
    type: 'name',
    dataIndex: 'student',
    key: 'student',
    width: 250,
    fixed: 'left',
    align: 'left',
  },
  {
    title: 'SIS ID',
    dataIndex: 'sisId',
    key: 'sisId',
    visibleOn: ['csv'],
  },
  {
    title: 'STUDENT NUMBER',
    dataIndex: 'studentNumber',
    key: 'sistudentNumber',
    visibleOn: ['csv'],
  },
  {
    title: 'Class Grade',
    dataIndex: 'grades',
    key: 'grades',
    visibleOn: ['csv'],
  },
  {
    title: 'Hispanic Ethnicity',
    dataIndex: 'hispanicEthnicity',
    key: 'hispanicEthnicity',
    visibleOn: ['csv'],
  },
  {
    title: 'School',
    sortable: true,
    type: 'name',
    dataIndex: 'school',
    key: 'school',
    width: 250,
    align: 'left',
    hiddenFromRole: ['teacher'],
  },
  {
    title: 'Teacher',
    sortable: true,
    type: 'name',
    dataIndex: 'teacher',
    key: 'teacher',
    width: 250,
    align: 'left',
    hiddenFromRole: ['teacher'],
  },
  {
    title: 'Class Name',
    sortable: true,
    type: 'name',
    dataIndex: 'groupName',
    key: 'groupName',
    width: 250,
    align: 'left',
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    className: 'dueDate',
    width: 250,
    sortable: true,
    type: 'date',
  },
  {
    title: 'Submitted Date',
    dataIndex: 'submittedDate',
    key: 'submittedDate',
    type: 'date',
    width: 250,
    sortable: true,
  },
  {
    title: 'Assessment Score',
    dataIndex: 'assessmentScore',
    key: 'assessmentScore',
    width: 250,
    type: 'score',
    sortable: true,
  },
  {
    title: 'District (Avg. Score%)',
    showToolTip: true,
    sortable: true,
    type: 'percentage',
    dataIndex: 'districtAvg',
    key: 'districtAvg',
    width: 250,
  },
  {
    title: 'School (Avg Score%)',
    showToolTip: true,
    sortable: true,
    type: 'percentage',
    dataIndex: 'schoolAvg',
    key: 'schoolAvg',
    width: 250,
  },
  {
    title: 'Class (Avg Score%)',
    showToolTip: true,
    sortable: true,
    type: 'percentage',
    dataIndex: 'classAvg',
    key: 'classAvg',
    width: 250,
  },
  {
    title: 'Student (Score%)',
    showToolTip: true,
    sortable: true,
    type: 'percentage',
    dataIndex: 'studentScore',
    key: 'studentScore',
    width: 250,
  },
]

const getProficiencyBandData = (bandInfo) => {
  let proficiencyBandOptions = [{ key: 'All', title: 'All' }]

  if (bandInfo) {
    proficiencyBandOptions = proficiencyBandOptions.concat(
      map(bandInfo, (band) => ({
        key: band.name,
        title: band.name,
      }))
    )
  }

  return proficiencyBandOptions
}

const groupData = (data) => {
  const maxTotalScore = get(maxBy(data, 'totalScore'), 'totalScore', 0)

  const dataToPlotHashMap = {}
  let i = 0

  while (maxTotalScore + 1 >= i) {
    dataToPlotHashMap[i] = {
      name: i,
      studentCount: 0,
    }
    i++
  }

  forEach(data, ({ totalScore }) => {
    if (totalScore || totalScore === 0) {
      const floorValue = floor(totalScore)
      if (dataToPlotHashMap[floorValue]) {
        dataToPlotHashMap[floorValue].studentCount++
      }
    }
  })

  return map(dataToPlotHashMap, (dataItem) => dataItem)
}

const parseData = ({ studentMetricInfo = [] }, _filter) => {
  const filteredData = filterData(studentMetricInfo, _filter)
  const groupedData = groupData(filteredData)

  return groupedData.length ? groupedData : [{ name: 0, studentCount: 0 }]
}

const getLeastProficiency = (bandInfo = []) =>
  orderBy(bandInfo, 'threshold', ['desc'])[bandInfo.length - 1] || { name: '' }

const getProficiency = (item, bandInfo) => {
  for (const obj of bandInfo) {
    if (round((item.totalScore / item.maxScore) * 100) >= obj.threshold) {
      return obj.name || getLeastProficiency(bandInfo).name
    }
  }
}

const normaliseTableData = (rawData, data) => {
  const {
    bandInfo = [],
    metaInfo = [],
    schoolMetricInfo = [],
    studentMetricInfo = [],
    districtAvgPerf = 0,
  } = rawData

  const classes = groupBy(studentMetricInfo, 'groupId')

  return map(data, (studentMetric) => {
    const relatedGroup =
      find(metaInfo, (meta) => studentMetric.groupId === meta.groupId) || {}

    const relatedSchool =
      find(
        schoolMetricInfo,
        (school) => relatedGroup.schoolId === school.schoolId
      ) || {}

    // progressStatus = 2 is for absent student, needs to be excluded
    const classAvg =
      round(
        (sumBy(classes[studentMetric.groupId], 'totalScore') /
          sumBy(classes[studentMetric.groupId], (o) =>
            o.progressStatus === 2 ? 0 : o.maxScore
          )) *
          100
      ) || 0
    let studentScore = 'Absent'
    let assessmentScore = 'Absent'
    let proficiencyBand = 'Absent'
    if (studentMetric.progressStatus === 1) {
      studentScore = round(
        ((studentMetric.totalScore || 0) / (studentMetric.maxScore || 1)) * 100
      )
      assessmentScore = `${(studentMetric.totalScore || 0).toFixed(2)} / ${(
        studentMetric.maxScore || 1
      ).toFixed(2)}`
      proficiencyBand = getProficiency(studentMetric, bandInfo)
    }

    return {
      ...studentMetric,
      student: getFormattedName(
        `${upperFirst(studentMetric.firstName || '')} ${upperFirst(
          studentMetric.lastName || ''
        )}`
      ),
      proficiencyBand,
      school: relatedGroup.schoolName || '-',
      teacher: relatedGroup.teacherName,
      groupName: relatedGroup.groupName,
      grades: relatedGroup.grades,
      schoolAvg: round(relatedSchool.schoolAvgPerf || 0),
      districtAvg: round(districtAvgPerf || 0),
      studentScore,
      classAvg,
      assessmentScore,
      submittedDate: formatDate(studentMetric.submittedDate),
      dueDate: formatDate(studentMetric.dueDate || studentMetric.endDate),
    }
  })
}

const filterStudents = (
  rawData,
  appliedFilters,
  range,
  selectedProficiency
) => {
  const { bandInfo = {}, studentMetricInfo = [] } = rawData
  // filter according to Filters applied by user
  let filteredData = filterData(studentMetricInfo, appliedFilters)

  // filter according to proficiency
  if (selectedProficiency !== 'All') {
    filteredData = filter(
      filteredData,
      (item) => getProficiency(item, bandInfo) === selectedProficiency
    )
  }

  let dataBetweenRange = filteredData

  const rangeMax = max([range.left, range.right])
  const rangeMin = min([range.left, range.right])

  // filter according to range
  if (rangeMax && range.left !== '' && range.right !== '') {
    dataBetweenRange = filter(
      filteredData,
      (studentMetric) =>
        rangeMax > studentMetric.totalScore &&
        studentMetric.totalScore >= rangeMin
    )
  }

  return dataBetweenRange
}

const getTableData = (
  rawData,
  appliedFilters,
  range,
  selectedProficiency = 'All'
) => {
  const filteredData = filterStudents(
    rawData,
    appliedFilters,
    range,
    selectedProficiency
  )
  const normalisedData = normaliseTableData(rawData, filteredData)
  const sortedData = orderBy(
    normalisedData,
    ['totalScore'],
    ['desc']
  ).sort((a, b) =>
    a.student.toLowerCase().localeCompare(b.student.toLowerCase())
  )
  return sortedData
}

// -----|-----|-----|-----| COMMON TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| CHART TRANSFORMERS |-----|-----|-----|----- //

const getInterval = (maxValue) => min([maxValue, 9])

const createTicks = (maxValue, interval) => {
  let maxTickRange = (ceil(maxValue / interval) || 0) * interval

  const ticks = []

  ticks.push(maxTickRange + (ceil(maxValue / interval) || 0))

  while (maxTickRange > 0) {
    ticks.push(maxTickRange)
    maxTickRange -= ceil(maxValue / interval)
  }

  return ticks
}

// -----|-----|-----|-----| CHART TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| TABLE TRANSFORMERS |-----|-----|-----|----- //

const getDisplayValue = (columnType, text) => {
  switch (columnType) {
    case 'percentage':
      return `${text}%`
    default:
      return text
  }
}

const getSorter = (columnType, columnKey) => {
  switch (columnType) {
    case 'percentage':
    case 'number':
      return (a, b) => a[columnKey] - b[columnKey]
    case 'string':
      return (a, b) => a[columnKey].localeCompare(b[columnKey])
    case 'name':
      // primary sort is on lastName & secondary sort is on firstName
      return (a, b) =>
        a[columnKey].toLowerCase().localeCompare(b[columnKey].toLowerCase())
    case 'date':
      return (a, b) => (moment(a[columnKey]).isBefore(b[columnKey]) ? -1 : 1)
    case 'score':
      return (a, b) => a.totalScore / a.maxScore - b.totalScore / b.maxScore
    default:
      return null
  }
}

// -----|-----|-----|-----| TABLE TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| BACKEND SPECIFIC TRANSFORMERS |-----|-----|-----|----- //

const getColumnsBE = (role) => {
  const filteredColumns = filterAccordingToRole(tableColumns, role)
  return filteredColumns.map((column) => {
    if (column.key === 'student') {
      column.render = (data) => data || 'Anonymous'
    } else if (column.showToolTip) {
      column.render = (data) =>
        data === 'Absent' ? data : getDisplayValue(column.type, data)
    }
    return column
  })
}

const populateBackendCSV = ({
  result,
  userRole,
  demographicFilters,
  isCliUser,
}) => {
  const bandInfo = get(result, 'bandInfo.performanceBand', [])
  const res = { ...result, bandInfo }
  const range = { left: '', right: '' }
  const tableData = getTableData(res, demographicFilters, range)
  const tableColumnsBE = getColumnsBE(userRole).filter(
    (col) => !(isCliUser && col.title === 'Due Date')
  )
  return getCsvDataFromTableBE(tableData, tableColumnsBE)
}

// -----|-----|-----|-----| BACKEND SPECIFIC TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

module.exports = {
  // common transformers
  tableColumns,
  getProficiencyBandData,
  parseData,
  getTableData,
  // chart transformers
  createTicks,
  getInterval,
  // table transformers
  getDisplayValue,
  getSorter,
  // backend transformers
  populateBackendCSV,
}
