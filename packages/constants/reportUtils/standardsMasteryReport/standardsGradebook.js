const qs = require('qs')
const { round, orderBy, isEmpty, keyBy } = require('lodash')
const { percentage, getCsvDataFromTableBE } = require('../common')

// common

const compareByKeys = {
  SCHOOL: 'school',
  TEACHER: 'teacher',
  CLASS: 'class',
  STUDENT: 'student',
  RACE: 'race',
  GENDER: 'gender',
  FRL_STATUS: 'frlStatus',
  ELL_STATUS: 'ellStatus',
  IEP_STATUS: 'iepStatus',
  HISPANIC_ETHNICITY: 'hispanicEthnicity',
}

const compareByKeyToNameMap = {
  [compareByKeys.SCHOOL]: 'School',
  [compareByKeys.TEACHER]: 'Teacher',
  [compareByKeys.CLASS]: 'Class',
  [compareByKeys.STUDENT]: 'Student',
  [compareByKeys.RACE]: 'Race',
  [compareByKeys.GENDER]: 'Gender',
  [compareByKeys.FRL_STATUS]: 'FRL Status',
  [compareByKeys.ELL_STATUS]: 'ELL Status',
  [compareByKeys.IEP_STATUS]: 'IEP Status',
  [compareByKeys.HISPANIC_ETHNICITY]: 'Hispanic Ethnicity',
}

const compareByDropDownData = [
  {
    key: [compareByKeys.SCHOOL],
    title: compareByKeyToNameMap[compareByKeys.SCHOOL],
  },
  {
    key: [compareByKeys.TEACHER],
    title: compareByKeyToNameMap[compareByKeys.TEACHER],
  },
  {
    key: [compareByKeys.CLASS],
    title: compareByKeyToNameMap[compareByKeys.CLASS],
  },
  {
    key: [compareByKeys.STUDENT],
    title: compareByKeyToNameMap[compareByKeys.STUDENT],
  },
  {
    key: [compareByKeys.RACE],
    title: compareByKeyToNameMap[compareByKeys.RACE],
  },
  {
    key: [compareByKeys.GENDER],
    title: compareByKeyToNameMap[compareByKeys.GENDER],
  },
  {
    key: [compareByKeys.FRL_STATUS],
    title: compareByKeyToNameMap[compareByKeys.FRL_STATUS],
  },
  {
    key: [compareByKeys.ELL_STATUS],
    title: compareByKeyToNameMap[compareByKeys.ELL_STATUS],
  },
  {
    key: [compareByKeys.IEP_STATUS],
    title: compareByKeyToNameMap[compareByKeys.IEP_STATUS],
  },
  {
    key: [compareByKeys.HISPANIC_ETHNICITY],
    title: compareByKeyToNameMap[compareByKeys.HISPANIC_ETHNICITY],
  },
]

const analyseByKeys = {
  SCORE_PERCENT: 'score(%)',
  RAW_SCORE: 'rawScore',
  MASTERY_LEVEL: 'masteryLevel',
  MASTERY_SCORE: 'masteryScore',
}

const analyseByKeyToNameMap = {
  [analyseByKeys.SCORE_PERCENT]: 'Score (%)',
  [analyseByKeys.RAW_SCORE]: 'Raw Score',
  [analyseByKeys.MASTERY_LEVEL]: 'Mastery Level',
  [analyseByKeys.MASTERY_SCORE]: 'Mastery Score',
}

const analyseByDropDownData = [
  {
    key: analyseByKeys.SCORE_PERCENT,
    title: analyseByKeyToNameMap[analyseByKeys.SCORE_PERCENT],
  },
  {
    key: analyseByKeys.RAW_SCORE,
    title: analyseByKeyToNameMap[analyseByKeys.RAW_SCORE],
  },
  {
    key: analyseByKeys.MASTERY_LEVEL,
    title: analyseByKeyToNameMap[analyseByKeys.MASTERY_LEVEL],
  },
  {
    key: analyseByKeys.MASTERY_SCORE,
    title: analyseByKeyToNameMap[analyseByKeys.MASTERY_SCORE],
  },
]

const summaryParamsToPick = [
  'reportId',
  'termId',
  'assessmentTypes',
  'assignedBy',
  'classIds',
  'courseId',
  'curriculumId',
  'domainIds',
  'grades',
  'groupIds',
  'profileId',
  'schoolIds',
  'standardGrade',
  'subjects',
  'teacherIds',
  'testIds',
  'race',
  'gender',
  'iepStatus',
  'frlStatus',
  'ellStatus',
  'hispanicEthnicity',
  'stdPage',
  'stdPageSize',
]

const detailsParamsToPick = [
  'reportId',
  'termId',
  'assessmentTypes',
  'assignedBy',
  'classIds',
  'courseId',
  'curriculumId',
  'domainIds',
  'grades',
  'groupIds',
  'profileId',
  'schoolIds',
  'standardGrade',
  'subjects',
  'teacherIds',
  'testIds',
  'race',
  'gender',
  'iepStatus',
  'frlStatus',
  'ellStatus',
  'hispanicEthnicity',
  'stdPage',
  'stdPageSize',
  'rowPage',
  'rowPageSize',
  'compareBy',
  'analyzeBy',
  'sortKey',
  'sortOrder',
  'requireTotalCount',
]

const getLeastMasteryLevel = (scaleInfo = []) =>
  orderBy(scaleInfo, 'score', ['desc'])[scaleInfo.length - 1] || {
    masteryLabel: '',
    masteryName: '',
  }

const getMasteryLevel = (masteryScore, scaleInfo) => {
  for (const obj of scaleInfo) {
    if (round(masteryScore) === obj.score) {
      return obj || getLeastMasteryLevel(scaleInfo)
    }
  }
  return getLeastMasteryLevel(scaleInfo)
}

const preProcessSummaryMetrics = ({ summaryMetricInfo }) => {
  return summaryMetricInfo.map((standard) => {
    const { totalStudents, performance } = standard
    const _performance = {
      avgScore: round(performance.totalScore / totalStudents, 2),
      totalScore: round(performance.totalMaxScore / totalStudents, 2),
      masteryScore: round(performance.totalMasteryScore / totalStudents, 2),
    }
    return { ...standard, performance: _performance }
  })
}

// chart transformers

const getChartDataWithStandardInfo = (chartData, skillInfo) => {
  if (isEmpty(chartData) || isEmpty(skillInfo)) {
    return []
  }
  const skillInfoMap = keyBy(
    skillInfo.filter((item) => !!item.standardId),
    'standardId'
  )
  return chartData
    .filter((item) => skillInfoMap[item._id])
    .map((item) => ({
      ...item,
      ...skillInfoMap[item._id],
    }))
}

// table transformers

const getStandardProgressNav = (navigationItems, standardId, compareByKey) => {
  const standardsProgressNavLink = navigationItems.find(
    (n) => n.key === 'standards-progress'
  )?.location
  if (standardId && standardsProgressNavLink) {
    const [
      standardsProgressNavPrefix,
      standardsProgressNavQuery,
    ] = standardsProgressNavLink.split('?')
    const standardsProgressNavObj = qs.parse(standardsProgressNavQuery, {
      ignoreQueryPrefix: true,
    })
    const gradebookToProgressCompareByKey = {
      schoolId: 'school',
      teacherId: 'teacher',
      studentId: 'student',
      groupId: 'class',
    }
    const _standardsProgressNavObj = { ...standardsProgressNavObj, standardId }
    const _standardsProgressNavQuery = qs.stringify(_standardsProgressNavObj)
    return {
      pathname: standardsProgressNavPrefix,
      search: `?${_standardsProgressNavQuery}`,
      state: {
        standardId,
        compareByKey:
          gradebookToProgressCompareByKey[compareByKey] || compareByKey,
      },
    }
  }
  return null
}

const getAllAnalyseByPerformanceData = ({
  avgScore,
  totalScore,
  masteryScore,
  scaleInfo,
  useAbbreviation = false,
}) => {
  const masteryLevel = getMasteryLevel(masteryScore, scaleInfo)
  const masteryLevelLabel = useAbbreviation
    ? masteryLevel.masteryLabel
    : masteryLevel.masteryName
  return {
    [analyseByKeys.SCORE_PERCENT]:
      avgScore != null
        ? `${round(percentage(avgScore, totalScore), 2)}%`
        : null,
    [analyseByKeys.RAW_SCORE]:
      avgScore != null
        ? `${round(avgScore, 2)} / ${round(totalScore, 2)}`
        : null,
    [analyseByKeys.MASTERY_SCORE]:
      masteryScore != null ? round(masteryScore, 2) : null,
    [analyseByKeys.MASTERY_LEVEL]:
      masteryScore != null ? masteryLevelLabel : null,
    color: masteryScore != null ? masteryLevel.color : null,
  }
}

const getTableData = ({ summaryMetricInfo, detailsMetricInfo, scaleInfo }) => {
  const paginatedStandardIds = summaryMetricInfo.map(({ _id: standardId }) =>
    Number(standardId)
  )
  const tableData = detailsMetricInfo.map(
    ({ dimension, standards, performance }) => {
      const rowData = {
        dimension: { _id: dimension._id, name: dimension.name },
        sisId: dimension.sisId,
        studentNumber: dimension.studentNumber,
      }
      rowData.performance = getAllAnalyseByPerformanceData({
        ...performance,
        // @todo: fix API output in backend to have keys avgScore and totalScore
        avgScore: performance.avg,
        totalScore: performance.total,
        scaleInfo,
      })
      for (const standardId of paginatedStandardIds) {
        const standardPerformance =
          standards.find((ele) => ele._id == standardId) || {}
        rowData[standardId] = getAllAnalyseByPerformanceData({
          ...standardPerformance,
          scaleInfo,
        })
      }
      return rowData
    }
  )
  return tableData
}

const getTableColumns = ({
  chartDataWithStandardInfo,
  skillInfo,
  scaleInfo,
  compareByKey,
  analyseByKey,
}) => {
  const standardIdToIdentifierMap = skillInfo.reduce((res, ele) => {
    res[ele.standardId] = ele.standard
    return res
  }, {})

  const compareByColumn = {
    title: compareByKeyToNameMap[compareByKey],
    key: 'dimension',
    dataIndex: 'dimension',
    width: 200,
    fixed: 'left',
    render: (data) => data.name || '-',
    sorter: () => {},
  }
  const compareByStudentColumns = [
    {
      title: 'SIS ID',
      key: 'sisId',
      dataIndex: 'sisId',
      width: 150,
      visibleOn: ['csv'],
    },
    {
      title: 'STUDENT NUMBER',
      key: 'studentNumber',
      dataIndex: 'studentNumber',
      width: 150,
      visibleOn: ['csv'],
    },
  ]
  const avgStandardPerformanceColumn = {
    title: 'AVG. STANDARD PERFORMANCE',
    key: 'performance',
    dataIndex: 'performance',
    width: 150,
    render: (data) => data[analyseByKey] || 'N/A',
    sorter: () => {},
  }

  const standardColumns = chartDataWithStandardInfo.map(
    ({ standardId, performance: standardOverallData }) => {
      const standardIdentifier = standardIdToIdentifierMap[standardId]
      const standardOverallPerformance = getAllAnalyseByPerformanceData({
        ...standardOverallData,
        scaleInfo,
        useAbbreviation: true,
      })
      return {
        title: `${standardIdentifier} ${standardOverallPerformance[analyseByKey]}`,
        key: standardId,
        dataIndex: standardId,
        align: 'center',
        render: (data) => data[analyseByKey] || 'N/A',
        sorter: () => {},
      }
    }
  )
  return [
    compareByColumn,
    ...(compareByKey === compareByKeys.STUDENT ? compareByStudentColumns : []),
    avgStandardPerformanceColumn,
    ...standardColumns,
  ]
}

// backend specific transformers

const populateBackendCSV = () => {
  // @todo
  const tableData = getTableData({})
  const tableColumns = getTableColumns({})
  return getCsvDataFromTableBE(tableData, tableColumns)
}

// -----|-----|-----|-----| BACKEND SPECIFIC TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

module.exports = {
  // common transformers
  compareByKeys,
  compareByKeyToNameMap,
  compareByDropDownData,
  analyseByKeys,
  analyseByKeyToNameMap,
  analyseByDropDownData,
  summaryParamsToPick,
  detailsParamsToPick,
  preProcessSummaryMetrics,
  // chart transformers
  getChartDataWithStandardInfo,
  // table transformers
  getAllAnalyseByPerformanceData,
  getStandardProgressNav,
  getTableData,
  getTableColumns,
  // backend transformers
  populateBackendCSV,
}
