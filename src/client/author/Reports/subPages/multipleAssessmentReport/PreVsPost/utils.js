import {
  reportUtils,
  roleuser,
  colors as colorUtils,
} from '@edulastic/constants'
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
} from 'lodash'

const HSL_COLOR_GREEN = [116, 34, 52]
const HSL_COLOR_RED = [0, 73, 63]

const { getProficiencyBand, percentage } = reportUtils.common
const { getColorsByInterpolation } = colorUtils

const groupByCompareByKey = (metricInfo, compareBy) => {
  switch (compareBy) {
    case 'school':
      return groupBy(metricInfo, 'schoolId')
    case 'student':
      return groupBy(metricInfo, 'studentId')
    case 'group':
      return groupBy(metricInfo, 'groupId')
    case 'teacher':
      return groupBy(metricInfo, 'teacherId')
    case 'race':
      return groupBy(metricInfo, 'race')
    case 'gender':
      return groupBy(metricInfo, 'gender')
    case 'ellStatus':
      return groupBy(metricInfo, 'ellStatus')
    case 'iepStatus':
      return groupBy(metricInfo, 'iepStatus')
    case 'hispanicEthnicity':
      return groupBy(metricInfo, 'hispanicEthnicity')
    case 'frlStatus':
      return groupBy(metricInfo, 'frlStatus')
    case 'standard':
      return groupBy(metricInfo, 'standardId')
    default:
      return {}
  }
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
      const preVsPostCellStudentCount =
        summaryMetricInfo.find(
          (m) =>
            parseInt(m.preBandScore, 10) == pb2.threshold &&
            parseInt(m.postBandScore, 10) == pb1.threshold
        )?.totalStudentCount || 0
      const preVsPostCellStudentPercentage = round(
        percentage(preVsPostCellStudentCount, totalStudentCount),
        2
      )
      return { preVsPostCellStudentCount, preVsPostCellStudentPercentage }
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
  compareBy,
  preTestName,
  postTestName,
  cellBandInfo,
  userRole
) => {
  // if matrix cell is clicked - filter metricInfo by preBandScore and postBandScore
  let groupedByCompareByKey
  if (!isEmpty(cellBandInfo)) {
    const filteredMetricInfo = metricInfo.filter(
      (m) =>
        parseInt(m.preBandScore, 10) === cellBandInfo.preBandScore &&
        parseInt(m.postBandScore, 10) === cellBandInfo.postBandScore
    )
    groupedByCompareByKey =
      userRole === roleuser.TEACHER
        ? groupByCompareByKey(filteredMetricInfo, 'student')
        : groupByCompareByKey(filteredMetricInfo, compareBy)
  } else {
    groupedByCompareByKey = groupByCompareByKey(metricInfo, compareBy)
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
      if (compareBy === 'student') {
        rowTitle = data[0].firstName
        lastName = data[0].lastName
        schoolName = data[0].schoolName
        teacherName = data[0].teacherName
        className = data[0].groupName
        studentId = key
      } else rowTitle = data[0][`${compareBy}Name`]
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
