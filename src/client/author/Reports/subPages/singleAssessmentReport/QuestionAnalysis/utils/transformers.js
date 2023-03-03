import { groupBy, keyBy, orderBy } from 'lodash'
import { getHSLFromRange1 } from '../../../../common/util'
import { getFormattedTimeInMins } from './helpers'

const sortByAvgPerformanceAndLabel = (arr) =>
  orderBy(arr, [
    'avgPerformance',
    (item) => Number((item.qLabel || '').substring(1)),
  ])

export const getChartData = (qSummary = []) => {
  const arr = qSummary.map((item) => {
    const avgPerformance = !isNaN(item.avgPerformance) ? Math.round(item.avgPerformance) : 0
    const avgIncorrect = Math.round(100 - item.avgPerformance)
    const districtAvg = Math.round(item.districtAvgPerf)
    const avgTimeSecs = Math.floor(item.avgTimeSpent / 1000)
    const avgTimeMins = item.avgTimeSpent
    return {
      ...item,
      qLabel: item.questionLabel,
      avgPerformance,
      avgIncorrect,
      avgTime: item.avgTimeSpent,
      avgTimeSecs,
      avgTimeMins,
      districtAvg,
      fill: getHSLFromRange1(avgPerformance),
    }
  })
  return sortByAvgPerformanceAndLabel(arr)
}

export const getTableData = ({ metaInfo = [], metricInfo = [] }) => {
  const metaInfoGroupIdMap = keyBy(metaInfo, 'groupId')
  const normalizedMetricInfo = metricInfo.map((item) => ({
    ...item,
    ...metaInfoGroupIdMap[item.groupId],
  }))

  const groupedMetricInfo = groupBy(normalizedMetricInfo, 'questionId')
  const groupedMetricInfoKeys = Object.keys(groupedMetricInfo)
  let groupedBySchoolKeys = []
  let groupedByTeacherKeys = []
  let groupedByClassKeys = []
  if (groupedMetricInfoKeys.length) {
    const groupedItem = groupedMetricInfo[groupedMetricInfoKeys[0]]
    groupedBySchoolKeys = Object.keys(groupBy(groupedItem, 'schoolId'))
    groupedByTeacherKeys = Object.keys(groupBy(groupedItem, 'teacherId'))
    groupedByClassKeys = Object.keys(groupBy(groupedItem, 'groupId'))
  }

  const arr = Object.keys(groupedMetricInfo).map((item) => {
    const groupedItem = groupedMetricInfo[item]
    const districtAvg = Math.round(groupedItem[0].districtAvgPerf)

    // -----|-----|-----|-----| SCHOOL BEGIN |-----|-----|-----|----- //
    const groupedBySchool = groupBy(groupedItem, 'schoolId')
    const comparedBySchool = groupedBySchoolKeys.map((_item) => {
      const __item =
        groupedBySchool?.[_item]?.reduce(
          (total, currentValue) => {
            const {
              totalTotalMaxScore = 0,
              totalTotalScore = 0,
              totalTimeSpent = 0,
            } = total
            const {
              totalMaxScore = 0,
              totalScore = 0,
              timeSpent = 0,
            } = currentValue
            return {
              totalTotalScore: totalTotalScore + totalScore,
              totalTotalMaxScore: totalTotalMaxScore + totalMaxScore,
              totalTimeSpent: totalTimeSpent + parseInt(timeSpent),
            }
          },
          {
            totalTotalMaxScore: 0,
            totalTotalScore: 0,
            totalTimeSpent: 0,
          }
        ) || {}
      let avgPerformance =
        (__item.totalTotalScore / __item.totalTotalMaxScore) * 100
      avgPerformance = !isNaN(avgPerformance) ? Math.round(avgPerformance) : 0
      return {
        ...groupedBySchool?.[_item]?.[0],
        ...__item,
        avgPerformance,
      }
    })

    // -----|-----|-----|-----| SCHOOL ENDED |-----|-----|-----|----- //

    // -----|-----|-----|-----| TEACHER BEGIN |-----|-----|-----|----- //
    const groupedByTeacher = groupBy(groupedItem, 'teacherId')
    const comparedByTeacher = groupedByTeacherKeys.map((_item) => {
      const __item =
        groupedByTeacher?.[_item]?.reduce(
          (total, currentValue) => {
            const {
              totalTotalMaxScore = 0,
              totalTotalScore = 0,
              totalTimeSpent = 0,
            } = total
            const {
              totalMaxScore = 0,
              totalScore = 0,
              timeSpent = 0,
            } = currentValue
            return {
              totalTotalScore: totalTotalScore + totalScore,
              totalTotalMaxScore: totalTotalMaxScore + totalMaxScore,
              totalTimeSpent: totalTimeSpent + parseInt(timeSpent),
            }
          },
          {
            totalTotalMaxScore: 0,
            totalTotalScore: 0,
            totalTimeSpent: 0,
          }
        ) || {}
      let avgPerformance =
        (__item.totalTotalScore / __item.totalTotalMaxScore) * 100
      avgPerformance = !isNaN(avgPerformance) ? Math.round(avgPerformance) : 0
      return {
        ...groupedByTeacher?.[_item]?.[0],
        ...__item,
        avgPerformance,
      }
    })
    // -----|-----|-----|-----| TEACHER ENDED |-----|-----|-----|----- //

    // -----|-----|-----|-----| CLASS ENDED |-----|-----|-----|----- //
    const groupedByClass = groupBy(groupedItem, 'groupId')
    const comparedByClass = groupedByClassKeys.map((_item) => {
      const __item =
        groupedByClass?.[_item]?.reduce(
          (total, currentValue) => {
            const {
              totalTotalMaxScore = 0,
              totalTotalScore = 0,
              totalTimeSpent = 0,
            } = total
            const {
              totalMaxScore = 0,
              totalScore = 0,
              timeSpent = 0,
            } = currentValue
            return {
              totalTotalScore: totalTotalScore + totalScore,
              totalTotalMaxScore: totalTotalMaxScore + totalMaxScore,
              totalTimeSpent: totalTimeSpent + parseInt(timeSpent),
            }
          },
          {
            totalTotalMaxScore: 0,
            totalTotalScore: 0,
            totalTimeSpent: 0,
          }
        ) || {}
      let avgPerformance =
        (__item.totalTotalScore / __item.totalTotalMaxScore) * 100
      avgPerformance = !isNaN(avgPerformance) ? Math.round(avgPerformance) : 0
      return {
        ...groupedByClass?.[_item]?.[0],
        ...__item,
        avgPerformance,
      }
    })
    // -----|-----|-----|-----| CLASS ENDED |-----|-----|-----|----- //

    const reduced = groupedItem.reduce(
      (total, currentValue) => {
        const {
          totalTotalMaxScore = 0,
          totalTotalScore = 0,
          totalTimeSpent = 0,
        } = total
        const {
          totalMaxScore = 0,
          totalScore = 0,
          timeSpent = 0,
        } = currentValue
        return {
          totalTotalScore: totalTotalScore + totalScore,
          totalTotalMaxScore: totalTotalMaxScore + totalMaxScore,
          totalTimeSpent: totalTimeSpent + parseInt(timeSpent),
        }
      },
      {
        totalTotalMaxScore: 0,
        totalTotalScore: 0,
        totalTimeSpent: 0,
      }
    )

    let avgPerformance =
      (reduced.totalTotalScore / reduced.totalTotalMaxScore) * 100
    avgPerformance = !isNaN(avgPerformance) ? Math.round(avgPerformance) : 0

    return {
      ...groupedMetricInfo[item][0],
      avgPerformance,
      districtAvg,
      comparedBySchool,
      comparedByTeacher,
      comparedByClass,
    }
  })

  return sortByAvgPerformanceAndLabel(arr)
}
