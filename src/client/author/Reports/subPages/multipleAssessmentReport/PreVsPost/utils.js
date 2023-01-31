import { reportUtils, colors as colorUtils } from '@edulastic/constants'
import {
  map,
  filter,
  groupBy,
  sumBy,
  round,
  forEach,
  meanBy,
  maxBy,
  get,
  range,
  isEmpty,
} from 'lodash'

const { getProficiencyBand, percentage } = reportUtils.common
const { getColorsByInterpolation } = colorUtils

const HSL_COLOR_GREEN = [116, 34, 52]
const HSL_COLOR_RED = [0, 73, 63]

export const compareByKeys = {
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

export const compareByOptions = [
  { key: compareByKeys.SCHOOL, title: 'School', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.TEACHER, title: 'Teacher', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.CLASS, title: 'Class' },
  {
    key: compareByKeys.STUDENT,
    title: 'Student',
    hiddenFromRole: ['district-admin', 'school-admin'],
  },
  { key: compareByKeys.RACE, title: 'Race' },
  { key: compareByKeys.GENDER, title: 'Gender' },
  { key: compareByKeys.FRL_STATUS, title: 'FRL Status' },
  { key: compareByKeys.ELL_STATUS, title: 'ELL Status' },
  { key: compareByKeys.IEP_STATUS, title: 'IEP Status' },
  { key: compareByKeys.HISPANIC_ETHNICITY, title: 'Hispanic Ethnicity' },
]

export const analyseByOptions = [
  { key: 'score', title: 'Score %' },
  { key: 'rawScore', title: 'Raw Score' },
]

const groupByCompareByKey = (metricInfo, compareBy) => {
  switch (compareBy) {
    case compareByKeys.SCHOOL:
      return groupBy(metricInfo, 'schoolId')
    case compareByKeys.STUDENT:
      return groupBy(metricInfo, 'studentId')
    case compareByKeys.CLASS:
      return groupBy(metricInfo, 'groupId')
    case compareByKeys.TEACHER:
      return groupBy(metricInfo, 'teacherId')
    case compareByKeys.RACE:
      return groupBy(metricInfo, 'race')
    case compareByKeys.GENDER:
      return groupBy(metricInfo, 'gender')
    case compareByKeys.ELL_STATUS:
      return groupBy(metricInfo, 'ellStatus')
    case compareByKeys.IEP_STATUS:
      return groupBy(metricInfo, 'iepStatus')
    case compareByKeys.HISPANIC_ETHNICITY:
      return groupBy(metricInfo, 'hispanicEthnicity')
    case compareByKeys.FRL_STATUS:
      return groupBy(metricInfo, 'frlStatus')
    default:
      return {}
  }
}

// utility function to validate pre and post testIds
export const validatePreAndPostTestIds = (payload) => {
  const { preTestId, postTestId } = payload
  if (isEmpty(preTestId) || isEmpty(postTestId) || preTestId === postTestId)
    return false
  return true
}

// get test names from summary api metrics
export const getTestNamesFromTestMetrics = (testInfo, filters) => {
  const { preTestId, postTestId } = filters
  const preTestName = testInfo.find((t) => t._id === preTestId)?.title
  const postTestName = testInfo.find((t) => t._id === postTestId)?.title
  return { preTestName, postTestName }
}

// get summary section data from summary api metrics
export const getSummaryDataFromSummaryMetrics = (summaryMetricInfo) => {
  // get total students count
  const totalStudentCount = sumBy(
    summaryMetricInfo,
    (s) => parseInt(s.totalStudentCount, 10) || 0
  )
  // get average and max scores
  const preTestAverageScore = round(
    meanBy(summaryMetricInfo, 'preTestAverageScore'),
    2
  )
  const postTestAverageScore = round(
    meanBy(summaryMetricInfo, 'postTestAverageScore'),
    2
  )
  const preTestMaxScore = get(
    maxBy(summaryMetricInfo, 'preTestMaxScore'),
    'preTestMaxScore'
  )
  const postTestMaxScore = get(
    maxBy(summaryMetricInfo, 'postTestMaxScore'),
    'postTestMaxScore'
  )
  return {
    totalStudentCount,
    summaryData: {
      preTestAverageScore,
      postTestAverageScore,
      preTestMaxScore,
      postTestMaxScore,
    },
  }
}

// curate performance matrix data from summary metrics for selected performance band
export const getPerformanceMatrixData = (
  summaryMetricInfo,
  selectedPerformanceBand,
  totalStudentCount
) => {
  const performanceMatrixData = selectedPerformanceBand.map((pb1) => {
    const preTestData = summaryMetricInfo.filter(
      (m) => parseInt(m.preBandScore, 10) === pb1.threshold
    )
    const postTestData = summaryMetricInfo.filter(
      (m) => parseInt(m.preBandScore, 10) === pb1.threshold
    )
    const preStudentsPercentange = percentage(
      sumBy(preTestData, (d) => parseInt(d.totalStudentCount, 10)),
      totalStudentCount,
      true
    )
    const postStudentsPercentage = percentage(
      sumBy(postTestData, (d) => parseInt(d.totalStudentCount, 10)),
      totalStudentCount,
      true
    )
    const preVsPostStudentsPercentage =
      postStudentsPercentage - preStudentsPercentange

    const preVsPostCellsData = selectedPerformanceBand.map((pb2) => {
      const preThreshold = pb2.threshold
      const postThreshold = pb1.threshold
      const preVsPostCellStudentCount =
        summaryMetricInfo.find(
          (m) =>
            parseInt(m.preBandScore, 10) == preThreshold &&
            parseInt(m.postBandScore, 10) == postThreshold
        )?.totalStudentCount || 0
      const preVsPostCellStudentPercentage = round(
        percentage(preVsPostCellStudentCount, totalStudentCount),
        2
      )
      return {
        preThreshold,
        postThreshold,
        preVsPostCellStudentCount,
        preVsPostCellStudentPercentage,
      }
    })
    return {
      ...pb1,
      preStudentsPercentange,
      postStudentsPercentage,
      preVsPostStudentsPercentage,
      preVsPostCellsData,
    }
  })
  return performanceMatrixData
}

// color palette for performance matrix
export const getPerformanceMatrixColors = (matrixSize) => {
  const colorsByInterpolationGreen = getColorsByInterpolation({
    count: matrixSize,
    fromColor: HSL_COLOR_GREEN, // green
    toColor: [...HSL_COLOR_GREEN.slice(0, 2), 100], // white for green
  })
  const colorsByInterpolationRed = getColorsByInterpolation({
    count: matrixSize,
    fromColor: [...HSL_COLOR_RED.slice(0, 2), 100], // white for red
    toColor: HSL_COLOR_RED, // red
  })
  const colorsByInterpolation = [
    ...colorsByInterpolationGreen,
    ...colorsByInterpolationRed.slice(1), // white is common to both and can be ignored
  ]
  const colorsMatrix = range(matrixSize).map((i) =>
    range(matrixSize).map((j) => colorsByInterpolation[matrixSize - 1 + i - j])
  )
  return colorsMatrix
}

// table data transformer
export const getTableData = (
  metricInfo,
  selectedPerformanceBand,
  tableFilters,
  preTestName,
  postTestName
) => {
  const {
    preBandScore,
    postBandScore,
    compareBy: { key: compareByKey },
  } = tableFilters
  let groupedByCompareByKey
  // if matrix cell is clicked - filter metricInfo by preBandScore and postBandScore
  if (preBandScore && postBandScore) {
    const filteredMetricInfo = metricInfo.filter(
      (m) =>
        parseInt(m.preBandScore, 10) === parseInt(preBandScore, 10) &&
        parseInt(m.postBandScore, 10) === parseInt(postBandScore, 10)
    )
    groupedByCompareByKey = groupByCompareByKey(
      filteredMetricInfo,
      compareByKey
    )
  } else {
    groupedByCompareByKey = groupByCompareByKey(metricInfo, compareByKey)
  }

  // get data required for table
  const tableData = map(Object.keys(groupedByCompareByKey), (key) => {
    const data = groupedByCompareByKey[key]
    const preAvgScore = round(meanBy(data, 'preTestAverageScore'), 2)
    const postAvgScore = round(meanBy(data, 'postTestAverageScore'), 2)
    const preMaxScore = get(maxBy(data, 'preTestMaxScore'), 'preTestMaxScore')
    const postMaxScore = get(
      maxBy(data, 'postTestMaxScore'),
      'postTestMaxScore'
    )
    const studentsCount = sumBy(data, (d) => parseInt(d.totalStudentCount, 10))
    const preAvgScorePercentage = percentage(preAvgScore, preMaxScore, true)
    const postAvgScorePercentage = percentage(postAvgScore, postMaxScore, true)
    const preBand = getProficiencyBand(
      preAvgScorePercentage,
      selectedPerformanceBand
    )
    const postBand = getProficiencyBand(
      postAvgScorePercentage,
      selectedPerformanceBand
    )

    // required for performance band column barChart
    const preBandProfile = {}
    const postBandProfile = {}
    forEach(selectedPerformanceBand, (pb) => {
      const preBandData = filter(
        data,
        (d) => parseInt(d.preBandScore, 10) === pb.threshold
      )
      const postBandData = filter(
        data,
        (d) => parseInt(d.postBandScore, 10) === pb.threshold
      )
      preBandProfile[pb.name] = sumBy(preBandData, (d) =>
        parseInt(d.totalStudentCount, 10)
      )
      postBandProfile[pb.name] = sumBy(postBandData, (d) =>
        parseInt(d.totalStudentCount, 10)
      )
    })

    // required only for compareBy student expect rowTitle
    let rowTitle = ''
    let schoolName = ''
    let teacherName = ''
    let className = ''
    let studentId = ''
    let lastName = ''
    if (data.length) {
      if (compareByKey === compareByKeys.STUDENT) {
        rowTitle = data[0].firstName
        lastName = data[0].lastName
        schoolName = data[0].schoolName
        teacherName = data[0].teacherName
        className = data[0].groupName
        studentId = key
      } else rowTitle = data[0][`${compareByKey}Name`]
    }
    return {
      rowTitle,
      lastName,
      schoolName,
      teacherName,
      className,
      studentId,
      studentsCount,
      preTestName,
      postTestName,
      preAvgScorePercentage,
      postAvgScorePercentage,
      preAvgScore,
      postAvgScore,
      preBand,
      postBand,
      preBandProfile,
      postBandProfile,
    }
  })
  return tableData
}
