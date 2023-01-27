import {
  map,
  groupBy,
  reduce,
  values,
  sumBy,
  round,
  get,
  find,
  isNil,
  mapValues,
  omitBy,
  isEmpty,
} from 'lodash'

import { reportUtils, colors as colorConstants } from '@edulastic/constants'
import { getAchievementLevels } from '@edulastic/constants/const/dataWarehouse'
import { getAllTestTypesMap } from '../../../../../common/utils/testTypeUtils'

const EXTERNAL_ASSESSMENTS = 'External Assessment'

const {
  getFormattedName,
  percentage,
  getProficiencyBand,
  formatDate,
} = reportUtils.common

const testTypes = getAllTestTypesMap()

export const staticDropDownData = {
  filterSections: {
    CLASS_FILTERS: {
      key: '0',
      title: 'Select Classes',
    },
  },
  tagTypes: [
    { key: 'termId', tabKey: '0' },
    { key: 'schoolIds', tabKey: '0' },
    { key: 'courseIds', tabKey: '0' },
    { key: 'grades', subType: 'class', tabKey: '0' },
    { key: 'subjects', subType: 'class', tabKey: '0' },
    { key: 'classIds', tabKey: '0' },
    { key: 'student' },
    { key: 'performanceBandProfileId' },
    { key: 'testTypes' },
  ],
  initialFilters: {
    reportId: '',
    termId: '',
    schoolIds: '',
    courseIds: '',
    grades: '',
    subjects: '',
    classIds: '',
    performanceBandProfileId: '',
    showApply: false,
  },
  subjects: [
    { key: 'Mathematics', title: 'Mathematics' },
    { key: 'ELA', title: 'ELA' },
    { key: 'Science', title: 'Science' },
    { key: 'Social Studies', title: 'Social Studies' },
    { key: 'Computer Science', title: 'Computer Science' },
    { key: 'Other Subjects', title: 'Other Subjects' },
  ],
  grades: [
    { key: 'TK', title: 'PreKindergarten' },
    { key: 'K', title: 'Kindergarten' },
    { key: '1', title: 'Grade 1' },
    { key: '2', title: 'Grade 2' },
    { key: '3', title: 'Grade 3' },
    { key: '4', title: 'Grade 4' },
    { key: '5', title: 'Grade 5' },
    { key: '6', title: 'Grade 6' },
    { key: '7', title: 'Grade 7' },
    { key: '8', title: 'Grade 8' },
    { key: '9', title: 'Grade 9' },
    { key: '10', title: 'Grade 10' },
    { key: '11', title: 'Grade 11' },
    { key: '12', title: 'Grade 12' },
    { key: 'other', title: 'Other' },
  ],
}

export const tableColumnsData = [
  {
    title: 'Assessment Name',
    dataIndex: 'testName',
    key: 'testName',
    align: 'left',
    fixed: 'left',
    width: 200,
  },
  {
    title: 'Assessment Type',
    dataIndex: 'testType',
    key: 'testType',
    width: 180,
  },
  {
    title: 'Day of Assessment Start',
    dataIndex: 'assignmentDateFormatted',
    key: 'assignmentDateFormatted',
    className: 'assessmentDate',
    sorter: (a, b) => a.assignmentDate - b.assignmentDate,
    width: 180,
  },
  {
    title: 'Total Questions',
    dataIndex: 'totalTestItems',
    key: 'totalTestItems',
    width: 180,
  },
  {
    title: 'Performance',
    dataIndex: 'averageScore',
    key: 'averageScore',
    visibleOn: ['browser'],
  },
  {
    title: 'Performance Level',
    key: 'performanceLevel',
    visibleOn: ['csv'],
  },
  {
    title: 'Score',
    key: 'performanceScore',
    visibleOn: ['csv'],
  },
  {
    title: 'District (Avg. Score)',
    dataIndex: 'districtAvg',
    key: 'districtAvg',
    width: 180,
  },
  {
    title: 'School (Avg Score)',
    dataIndex: 'schoolAvg',
    key: 'schoolAvg',
    width: 180,
  },
  {
    title: 'Class (Avg Score)',
    dataIndex: 'groupAvg',
    key: 'groupAvg',
    width: 180,
  },
  {
    title: 'Claim Levels',
    dataIndex: 'claimsInfo',
    key: 'claimsInfo',
    align: 'left',
    visibleOn: ['browser'],
  },
]

export const getStudentName = (studInfo, selectedStudent) => {
  if (selectedStudent?.title) {
    return selectedStudent.title
  }
  return getFormattedName(
    `${studInfo.firstName || ''} ${studInfo.lastName || ''}`,
    false
  )
}

const colorByText = (text) => {
  const numFromText = sumBy(`${text}`.toLowerCase(), (ch) => ch.charCodeAt())
  const colorArr = colorConstants.externalPerformanceBandColors
  return colorArr[numFromText % colorArr.length]
}

const getClaimInfo = (value, name, metric, allExternalBands) => {
  let color = value?.color

  if (!color && typeof value === 'object' && value !== null) {
    const bands = getAchievementLevels(
      {
        ...metric,
        externalTestType: metric.testCategory,
        achievementLevel: value.rank,
      },
      allExternalBands
    )
    color = bands.find((b) => b.active)?.color
  }
  return {
    name,
    value: typeof value === 'object' ? value.score : value,
    color: color || colorByText(value?.label ?? name),
  }
}

export const mergeTestMetrics = (
  internalMetrics,
  externalMetrics,
  allExternalBands
) => {
  const mappedExternalMetrics = externalMetrics
    .map((metric) => {
      const _getClaimInfo = (value, name) =>
        getClaimInfo(value, name, metric, allExternalBands)
      return {
        title: metric.testTitle,
        assignmentDate: +new Date(metric.testStartDate),
        testType: 'External Assessment',
        externalTestType: metric.testCategory,
        groupId: '',
        testActivityId: '',
        testId: `${metric.testCategory}:${metric.testTitle}`,
        reportKey: '',
        assignmentId: '',
        studentId: metric.studentId,
        maxScore: undefined,
        score: +metric.score,
        achievementLevel: +metric.achievementLevel,
        claimsInfo: mapValues(
          omitBy(JSON.parse(metric.claims || '{}'), isNil),
          _getClaimInfo
        ),
        schoolCode: metric.schoolCode,
      }
    })
    .map((metric) => {
      const bands = getAchievementLevels(metric, allExternalBands)
      return {
        ...metric,
        achievementLevelBands: bands,
        achievementLevelInfo: bands.find((band) => band.active),
      }
    })
  return [...internalMetrics, ...mappedExternalMetrics]
}

export const mergeDistrictMetrics = (internalMetrics, externalMetrics) => {
  const mappedExternalMetrics = externalMetrics.map((metric) => ({
    testId: `${metric.testCategory}:${metric.testTitle}`,
    districtAvg: +metric.districtAvg,
    districtAvgPerf: undefined,
  }))
  return [...internalMetrics, ...mappedExternalMetrics]
}

export const mergeSchoolMetrics = (internalMetrics, externalMetrics) => {
  const mappedExternalMetrics = externalMetrics.map((metric) => ({
    testId: `${metric.testCategory}:${metric.testTitle}`,
    schoolCode: metric.schoolCode,
    schoolAvg: +metric.schoolAvg,
    schoolAvgPerf: undefined,
  }))
  return [...internalMetrics, ...mappedExternalMetrics]
}

const filterMetricsByTestType = (metrics, assessmentTypes) => {
  if (isEmpty(assessmentTypes)) return metrics
  return metrics.filter(({ testType, externalTestType }) => {
    if (testType === EXTERNAL_ASSESSMENTS) {
      return assessmentTypes.includes(externalTestType)
    }
    return assessmentTypes.includes(testType)
  })
}

export const getChartData = ({
  assignmentMetrics = [],
  studentClassData = [],
  selectedPerformanceBand = [],
  testTypes: assessmentTypes = [],
}) => {
  if (!assignmentMetrics.length) {
    return []
  }
  const filteredMetrics = filterMetricsByTestType(
    assignmentMetrics,
    assessmentTypes
  )
  if (!filteredMetrics.length) {
    return []
  }
  const groupedByTest = groupBy(filteredMetrics, 'testId')
  const groupedTestsByType = reduce(
    groupedByTest,
    (data, value) => {
      const groupedByType = groupBy(value, 'testType')
      return data.concat(values(groupedByType))
    },
    []
  )
  const parsedData = map(groupedTestsByType, (assignments) => {
    const assignment = assignments[0] || {}
    const {
      title: testName,
      testType,
      externalTestType,
      studentId,
    } = assignment
    const totalMaxScore = sumBy(assignments, 'maxScore') || 0
    const totalScore = sumBy(assignments, 'score') || 0
    const { standardSet, subject } =
      studentClassData.find((s) => s.studentId === studentId) || {}
    const assessmentData = {
      ...assignment,
      testName,
      totalScore,
      totalMaxScore,
      standardSet,
      subject,
    }
    if (!externalTestType) {
      const averageScore = percentage(totalScore, totalMaxScore, true)
      const band = getProficiencyBand(averageScore, selectedPerformanceBand)
      Object.assign(assessmentData, {
        testType: testTypes[testType.toLowerCase()],
        averageScore,
        band,
      })
    }
    return assessmentData
  }).sort((a, b) => Number(b.assignmentDate) - Number(a.assignmentDate))
  return parsedData
}

export const getTableData = ({
  districtMetrics = [],
  schoolMetrics = [],
  groupMetrics = [],
  chartData = [],
}) => {
  if (!chartData.length) {
    return []
  }
  const parsedData = map(chartData, (assessment) => {
    const { testId, assignmentDate, externalTestType, schoolCode } = assessment
    const testDistrictAvg = round(
      get(
        find(districtMetrics, { testId }),
        externalTestType ? 'districtAvg' : 'districtAvgPerf',
        0
      )
    )
    const testGroupAvg = externalTestType
      ? '-'
      : round(get(find(groupMetrics, { testId }), 'groupAvgPerf', 0))
    const testSchoolAvg = round(
      externalTestType
        ? get(find(schoolMetrics, { testId, schoolCode }), 'schoolAvg', 0)
        : get(find(schoolMetrics, { testId }), 'schoolAvgPerf', 0)
    )
    const rawScore = `${assessment.totalScore?.toFixed(2) || '0.00'} / ${round(
      assessment.totalMaxScore,
      2
    )}`
    const assignmentDateFormatted = formatDate(assignmentDate)
    return {
      totalQuestions: 0,
      ...assessment,
      assignmentDateFormatted,
      districtAvg: testDistrictAvg,
      groupAvg: testGroupAvg,
      schoolAvg: testSchoolAvg,
      rawScore,
    }
  })
  return parsedData
}

export const getTestTypesFromUrl = (
  selectedTestTypes = '',
  availableTestTypes
) => {
  const testTypesArr = selectedTestTypes.split(',')
  return availableTestTypes.filter((a) => testTypesArr.includes(a.key))
}
