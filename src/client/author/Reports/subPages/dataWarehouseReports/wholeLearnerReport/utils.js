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
  sortBy,
  isEmpty,
} from 'lodash'
import moment from 'moment'
import {
  reportUtils,
  colors as colorConstants,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { getAchievementLevels } from '@edulastic/constants/const/dataWarehouse'
import {
  EXTERNAL_TEST_KEY_SEPARATOR,
  RISK_BAND_LABELS,
} from '@edulastic/constants/reportUtils/common'
import { getAllTestTypesMap } from '../../../../../common/utils/testTypeUtils'

const { TEST_TYPES, TEST_TYPE_LABELS } = testTypesConstants

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
        assignmentDate: +new Date(metric.testDate),
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
        grade: metric.grade,
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
    grade: metric.grade,
  }))
  return [...internalMetrics, ...mappedExternalMetrics]
}

export const mergeSchoolMetrics = (internalMetrics, externalMetrics) => {
  const mappedExternalMetrics = externalMetrics.map((metric) => ({
    testId: `${metric.testCategory}:${metric.testTitle}`,
    schoolCode: metric.schoolCode,
    schoolAvg: +metric.schoolAvg,
    schoolAvgPerf: undefined,
    grade: metric.grade,
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
      assessmentDate: +assignment.assignmentDate,
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
  }).sort((a, b) => Number(a.assignmentDate) - Number(b.assignmentDate))
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
  const chartDataToUse = [...chartData].reverse()
  const parsedData = map(chartDataToUse, (assessment) => {
    const {
      testId,
      assignmentDate,
      externalTestType,
      schoolCode,
      grade,
    } = assessment
    const testDistrictAvg = round(
      externalTestType
        ? get(find(districtMetrics, { testId, grade }), 'districtAvg', 0)
        : get(find(districtMetrics, { testId }), 'districtAvgPerf', 0)
    )
    const testGroupAvg = externalTestType
      ? '-'
      : round(get(find(groupMetrics, { testId }), 'groupAvgPerf', 0))
    const testSchoolAvg = round(
      externalTestType
        ? get(
            find(schoolMetrics, { testId, schoolCode, grade }),
            'schoolAvg',
            0
          )
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

export const getAttendanceChartData = (attendanceData) => {
  attendanceData = sortBy(attendanceData, 'minDate')
  const attendanceChartData = map(attendanceData, (item) => ({
    ...item,
    week: item.weekFromTermStart,
    startDate: moment(item.minDate)
      .startOf('week')
      .add(1, 'day')
      .format('D/M/YYYY'),
    assessmentDate: item.minDate,
    value: percentage(item.attendanceValue, item.totalDays, true),
  }))
  return attendanceChartData
}

export const getTestTypesFromUrl = (
  selectedTestTypes = '',
  availableTestTypes
) => {
  const testTypesArr = selectedTestTypes.split(',')
  return availableTestTypes.filter((a) => testTypesArr.includes(a.key))
}

export const getLegendPayload = (selectedPerformanceBand) =>
  selectedPerformanceBand
    .sort((a, b) => a.threshold - b.threshold)
    .map((pb, index) => ({
      id: `pb${index + 1}`,
      color: pb.color,
      value: pb.name,
      type: 'circle',
    }))

export const getBarsDataForInternal = (selectedPerformanceBand) =>
  selectedPerformanceBand.map((pb, index) => ({
    ...pb,
    key: `bar${index + 1}`,
    insideLabelKey: `inside-label-bar${index + 1}`,
    topLabelKey: `top-label-bar${index + 1}`,
    name: pb.name,
    fill: pb.color,
    stackId: 'a',
  }))

export const getBarsDataForExternal = (chartData) => {
  const achievementLevels = chartData.flatMap((cdItem) =>
    cdItem.externalTestType ? cdItem.achievementLevelBands : []
  )
  return achievementLevels.map((al, index) => ({
    ...al,
    key: `bar${index + 1}`,
    insideLabelKey: `inside-label-bar${index + 1}`,
    topLabelKey: `top-label-bar${index + 1}`,
    name: al.name,
    fill: al.color,
    stackId: 'a',
    [`bar${index + 1}`]: Math.floor(100 / achievementLevels.length),
  }))
}

export const getAssessmentChartData = (
  chartData,
  barsDataForExternal,
  barsDataForInternal
) =>
  chartData
    .map((d) => {
      if (d.externalTestType) {
        const barData = barsDataForExternal.find(
          (bar) => bar.active && bar.testId === d.testId
        )

        const bars = barsDataForExternal.filter((b) => b.testId === d.testId)

        const barsCellDataForExternal = bars.reduce(
          (res, ele) => ({
            ...res,
            [ele.key]: Math.floor(100 / bars.length),
          }),
          {}
        )
        return barData
          ? {
              ...d,
              ...barsCellDataForExternal,
              [barData.insideLabelKey]: new Intl.NumberFormat().format(
                d.totalScore
              ),
              fillOpacity: 0.2,
              additionalData: {
                [barData.key]: {
                  fillOpacity: 0.7,
                  stroke: barData.fill,
                  strokeOpacity: 1,
                  strokeWidth: 2,
                },
              },
            }
          : null
      }
      return {
        ...d,
        [barsDataForInternal[0].key]: d.averageScore,
        [barsDataForInternal[0].topLabelKey]: `${round(d.averageScore, 2)}%`,
        fill: d.band.color,
        fillOpacity: 1,
      }
    })
    .filter((d) => d)

export const getStudentRiskData = (rawData) => {
  const riskData = get(rawData, 'data.result', {})

  if (isEmpty(riskData)) return {}

  const { overallRisk, assessmentRisk, attendanceRisk } = riskData

  if ([overallRisk, assessmentRisk, attendanceRisk].every(isEmpty)) return {}

  const internalAssessmentRisk = []
  const externalAssessmentRisk = []
  assessmentRisk.forEach((testTypeRisk) => {
    if (
      [...TEST_TYPES.COMMON, ...TEST_TYPES.ASSESSMENT].includes(
        testTypeRisk.type
      )
    ) {
      internalAssessmentRisk.push({ ...testTypeRisk, isExternalTest: false })
    } else {
      externalAssessmentRisk.push({ ...testTypeRisk, isExternalTest: true })
    }
  })
  return {
    overallRisk,
    internalAssessmentRisk,
    externalAssessmentRisk,
    attendanceRisk,
  }
}

export const getSubjectRiskText = (subjectData, isExternalTest, prefix = '') =>
  subjectData.map(
    ({ subject, riskBandLabel: subjectRiskBandLabel, score: subjectScore }) => {
      const subjectsArr = subject.split(',')
      if (
        subjectsArr.length > 1 ||
        subjectRiskBandLabel === RISK_BAND_LABELS.LOW
      ) {
        return null
      }
      return `${subjectRiskBandLabel} risk in ${subject} (${prefix}${subjectScore}${
        isExternalTest ? '' : '%'
      })`
    }
  )

export const getTestRiskTableData = (riskData) => {
  return riskData.map(
    ({
      type,
      score,
      riskBandLabel,
      riskBandLevel,
      subjectData,
      isExternalTest,
    }) => {
      const subjectRiskTexts = getSubjectRiskText(
        subjectData,
        isExternalTest,
        'Avg Score - '
      )
      const testTypeTitle = !isExternalTest
        ? `EDULASTIC - ${TEST_TYPE_LABELS[type].split(' ')[0]}`
        : type.replace(EXTERNAL_TEST_KEY_SEPARATOR, ' - ')
      return {
        testTypeTitle,
        subjectRiskTexts,
        score,
        riskBandLabel,
        riskBandLevel,
        isExternalTest,
      }
    }
  )
}
