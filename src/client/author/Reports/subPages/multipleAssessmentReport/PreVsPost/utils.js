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

const { getProficiencyBand, percentage, getFormattedName } = reportUtils.common
const { getColorsByInterpolation } = colorUtils

// decimal base value for parseInt()
export const DECIMAL_BASE = 10

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

const compareByFieldKeys = {
  [compareByKeys.SCHOOL]: 'schoolId',
  [compareByKeys.TEACHER]: 'teacherId',
  [compareByKeys.CLASS]: 'groupId',
  [compareByKeys.STUDENT]: 'studentId',
  [compareByKeys.RACE]: compareByKeys.RACE,
  [compareByKeys.GENDER]: compareByKeys.GENDER,
  [compareByKeys.FRL_STATUS]: compareByKeys.FRL_STATUS,
  [compareByKeys.ELL_STATUS]: compareByKeys.ELL_STATUS,
  [compareByKeys.IEP_STATUS]: compareByKeys.IEP_STATUS,
  [compareByKeys.HISPANIC_ETHNICITY]: compareByKeys.HISPANIC_ETHNICITY,
}

export const compareBylabels = {
  [compareByKeys.SCHOOL]: 'schoolName',
  [compareByKeys.TEACHER]: 'teacherName',
  [compareByKeys.CLASS]: 'groupName',
  [compareByKeys.RACE]: compareByKeys.RACE,
  [compareByKeys.GENDER]: compareByKeys.GENDER,
  [compareByKeys.FRL_STATUS]: compareByKeys.FRL_STATUS,
  [compareByKeys.ELL_STATUS]: compareByKeys.ELL_STATUS,
  [compareByKeys.IEP_STATUS]: compareByKeys.IEP_STATUS,
  [compareByKeys.HISPANIC_ETHNICITY]: compareByKeys.HISPANIC_ETHNICITY,
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

export const matrixDisplayOptionTypes = {
  NUMBER: 'number',
  PERCENTAGE: 'percentage',
}

export const matrixDisplayOptions = [
  { key: matrixDisplayOptionTypes.NUMBER, title: 'Show numbers' },
  { key: matrixDisplayOptionTypes.PERCENTAGE, title: 'Show percentages' },
]

// utility function to validate pre and post testIds
export const validatePreAndPostTestIds = (payload) => {
  const { preTestId, postTestId } = payload
  if (isEmpty(preTestId) || isEmpty(postTestId)) return false
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
    (s) => parseInt(s.totalStudentCount, DECIMAL_BASE) || 0
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
  const preTestMaxScore =
    get(maxBy(summaryMetricInfo, 'preTestMaxScore'), 'preTestMaxScore') || 0
  const postTestMaxScore =
    get(maxBy(summaryMetricInfo, 'postTestMaxScore'), 'postTestMaxScore') || 0
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
      (m) => parseInt(m.preBandScore, DECIMAL_BASE) === pb1.threshold
    )
    const postTestData = summaryMetricInfo.filter(
      (m) => parseInt(m.postBandScore, DECIMAL_BASE) === pb1.threshold
    )
    const preStudentsCount = sumBy(preTestData, (d) =>
      parseInt(d.totalStudentCount, DECIMAL_BASE)
    )
    const postStudentsCount = sumBy(postTestData, (d) =>
      parseInt(d.totalStudentCount, DECIMAL_BASE)
    )
    const preStudentsPercentage = percentage(
      preStudentsCount,
      totalStudentCount,
      true
    )
    const postStudentsPercentage = percentage(
      postStudentsCount,
      totalStudentCount,
      true
    )
    const preVsPostStudentsPercentage =
      postStudentsPercentage - preStudentsPercentage

    const preVsPostCellsData = selectedPerformanceBand.map((pb2) => {
      const preThreshold = pb1.threshold
      const postThreshold = pb2.threshold
      const preVsPostCellStudentCount =
        summaryMetricInfo.find(
          (m) =>
            parseInt(m.preBandScore, DECIMAL_BASE) == preThreshold &&
            parseInt(m.postBandScore, DECIMAL_BASE) == postThreshold
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
      preStudentsCount,
      postStudentsCount,
      preStudentsPercentage,
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
        parseInt(m.preBandScore, DECIMAL_BASE) ===
          parseInt(preBandScore, DECIMAL_BASE) &&
        parseInt(m.postBandScore, DECIMAL_BASE) ===
          parseInt(postBandScore, DECIMAL_BASE)
    )
    groupedByCompareByKey = groupBy(
      filteredMetricInfo,
      compareByFieldKeys[compareByKey]
    )
  } else {
    groupedByCompareByKey = groupBy(
      metricInfo,
      compareByFieldKeys[compareByKey]
    )
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
    const studentsCount = sumBy(data, (d) =>
      parseInt(d.totalStudentCount, DECIMAL_BASE)
    )
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
        (d) => parseInt(d.preBandScore, DECIMAL_BASE) === pb.threshold
      )
      const postBandData = filter(
        data,
        (d) => parseInt(d.postBandScore, DECIMAL_BASE) === pb.threshold
      )
      preBandProfile[pb.name] = sumBy(preBandData, (d) =>
        parseInt(d.totalStudentCount, DECIMAL_BASE)
      )
      postBandProfile[pb.name] = sumBy(postBandData, (d) =>
        parseInt(d.totalStudentCount, DECIMAL_BASE)
      )
    })

    // field required only for compareBy student other than rowTitle
    let compareByColumnTitle = ''
    const {
      firstName,
      lastName,
      schoolName,
      teacherName,
      groupName,
      studentId,
    } = data[0]
    if (compareByKey === compareByKeys.STUDENT) {
      compareByColumnTitle = getFormattedName(
        `${firstName || ''} ${lastName || ''}`,
        false
      )
    } else compareByColumnTitle = data[0][compareBylabels[compareByKey]]
    return {
      compareByColumnTitle,
      firstName,
      lastName,
      schoolName,
      teacherName,
      className: groupName,
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
