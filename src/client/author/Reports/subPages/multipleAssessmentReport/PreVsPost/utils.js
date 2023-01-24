import { reportUtils, roleuser } from '@edulastic/constants'
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
} from 'lodash'

const { getProficiencyBand, percentage } = reportUtils.common

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

// table data transformer
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
  // if matrix cell is clicked - filter metricInfo by preBandScore and postBandScore
  let groupedByCompareByKey
  if (
    cellBandInfo.preBandScore !== null &&
    cellBandInfo.postBandScore !== null
  ) {
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


  const totalStudents = sumBy(metricInfo, (m) =>
    parseInt(m.totalStudentCount, 10)
  )

  // get data required for table

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
  return { tableData, totalStudents }
}

// summary data transformer
export const getSummaryData = (summaryInfo, testInfo, filters) => {
  // get pre and post test names
  const { preTestId, postTestId } = filters
  const preTestInfo = filter(testInfo, (t) => t._id === preTestId)
  const preTestName = get(preTestInfo, '[0].title')
  const postTestInfo = filter(testInfo, (t) => t._id === postTestId)
  const postTestName = get(postTestInfo, '[0].title')

  // get avg and max scores
  const preTestAverageScore = round(
    meanBy(summaryInfo, 'preTestAverageScore'),
    meanBy(summaryInfo, 'preTestAverageScore'),
    2
  )
  const postTestAverageScore = round(
    meanBy(summaryInfo, 'postTestAverageScore'),
    meanBy(summaryInfo, 'postTestAverageScore'),
    2
  )
  const preTestMaxScore = get(
    maxBy(summaryInfo, 'preTestMaxScore'),
    'preTestMaxScore'
  )
  const postTestMaxScore = get(
    maxBy(summaryInfo, 'postTestMaxScore'),
    'postTestMaxScore'
  )
  const preTestMaxScore = get(
    maxBy(summaryInfo, 'preTestMaxScore'),
    'preTestMaxScore'
  )
  const postTestMaxScore = get(
    maxBy(summaryInfo, 'postTestMaxScore'),
    'postTestMaxScore'
  )
  return {
    summary: {
      preTestAverageScore,
      postTestAverageScore,
      preTestMaxScore,
      postTestMaxScore,
    },
    preTestName,
    postTestName,
    summary: {
      preTestAverageScore,
      postTestAverageScore,
      preTestMaxScore,
      postTestMaxScore,
    },
    preTestName,
    postTestName,
  }
}
