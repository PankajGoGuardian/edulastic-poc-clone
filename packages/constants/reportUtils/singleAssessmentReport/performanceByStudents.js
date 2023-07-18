const {
  min,
  map,
  orderBy,
  ceil,
  floor,
  forEach,
  maxBy,
  get,
  round,
  upperFirst,
} = require('lodash')

const {
  filterAccordingToRole,
  formatDate,
  getFormattedName,
} = require('../common')

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| COMMON TRANSFORMERS |-----|-----|-----|----- //
const sortKeysMap = {
  PERFORMANCE_BAND: 'proficiencyBand',
  STUDENT: 'student',
  SCHOOL: 'school',
  TEACHER: 'teacher',
  GROUP: 'groupName',
  DUE_DATE: 'dueDate',
  SUBMITTED_DATE: 'submittedDate',
  SCORE: 'assessmentScore',
  DISTRICT_AVERAGE: 'districtAvg',
  SCHOOL_AVERAGE: 'schoolAvg',
  GROUP_AVERAGE: 'classAvg',
  STUDENT_SCORE: 'studentScore',
}

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
  let proficiencyBandOptions = [{ key: 'All', title: 'All', threshold: '' }]

  if (bandInfo) {
    proficiencyBandOptions = proficiencyBandOptions.concat(
      map(bandInfo, (band) => ({
        key: band.name,
        title: band.name,
        threshold: band.threshold,
      }))
    )
  }

  return proficiencyBandOptions
}

const groupData = (data) => {
  const maxTotalScore = get(maxBy(data, 'score'), 'score', 0)

  const dataToPlotHashMap = {}
  let i = 0

  while (maxTotalScore + 1 >= i) {
    dataToPlotHashMap[i] = {
      name: i,
      studentCount: 0,
    }
    i++
  }

  forEach(data, ({ score, studentCount }) => {
    if (score || score === 0) {
      const floorValue = floor(score)
      if (dataToPlotHashMap[floorValue]) {
        dataToPlotHashMap[floorValue].studentCount += +studentCount
      }
    }
  })

  return map(dataToPlotHashMap, (dataItem) => dataItem)
}

const getBarChartData = ({ scoreDistribution = [] }) => {
  const groupedData = groupData(scoreDistribution)

  return groupedData.length ? groupedData : [{ name: 0, studentCount: 0 }]
}

const getBandInfoFromThreshold = (bands, threshold) => {
  return bands.find((band) => band.threshold === threshold) || {}
}

const getPieChartData = ({ bandDistribution = [], bandInfo = [] }) => {
  if (bandDistribution.length && bandInfo.length) {
    return bandDistribution.map((obj) => {
      const { name = '', color = '' } = getBandInfoFromThreshold(
        bandInfo,
        obj.threshold
      )
      return {
        name,
        value: +obj.studentCount || 0,
        sum: +obj.totalStudents,
        color,
      }
    })
  }
  return []
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

const getTableData = ({ bandInfo = [], studentMetricInfo }) => {
  return map(studentMetricInfo, (studentMetric) => {
    const {
      studentId,
      firstName,
      lastName,
      username,
      externalId,
      assignmentId,
      testActivityId,
      schoolName,
      teacherName,
      groupName,
      groupId,
      grades,
      schoolAvg,
      districtAvg,
      classAvg,
      submittedDate,
      dueDate,
      endDate,
      totalScore,
      maxScore,
      studentNumber,
      sisId,
      hispanicEthnicity,
    } = studentMetric
    const studentScore = round(((totalScore || 0) / (maxScore || 1)) * 100)
    const assessmentScore = `${(totalScore || 0).toFixed(2)} / ${(
      maxScore || 1
    ).toFixed(2)}`
    const proficiencyBand = getProficiency(studentMetric, bandInfo)

    return {
      student: getFormattedName(
        `${upperFirst(firstName || '')} ${upperFirst(lastName || '')}`
      ),
      studentId,
      firstName,
      lastName,
      username,
      externalId,
      proficiencyBand,
      assignmentId,
      testActivityId,
      school: schoolName || '-',
      teacher: teacherName,
      groupName,
      groupId,
      grades,
      schoolAvg: round(schoolAvg || 0),
      districtAvg: round(districtAvg || 0),
      studentScore,
      classAvg: round(classAvg || 0),
      assessmentScore,
      submittedDate: formatDate(submittedDate),
      dueDate: formatDate(dueDate || endDate),
      totalScore,
      studentNumber,
      sisId,
      hispanicEthnicity,
    }
  })
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

const getThresholdFromBandName = (bands, name) => {
  const { threshold = '' } = bands.find((band) => band.name === name) || {}
  return threshold
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

// -----|-----|-----|-----| TABLE TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| BACKEND SPECIFIC TRANSFORMERS |-----|-----|-----|----- //

const getColumns = (role) => {
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

// -----|-----|-----|-----| BACKEND SPECIFIC TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

module.exports = {
  // common transformers
  sortKeysMap,
  tableColumns,
  getProficiencyBandData,
  getBarChartData,
  getPieChartData,
  getTableData,
  // chart transformers
  createTicks,
  getInterval,
  getThresholdFromBandName,
  // table transformers
  getDisplayValue,
  // backend transformers
  getColumns,
}
