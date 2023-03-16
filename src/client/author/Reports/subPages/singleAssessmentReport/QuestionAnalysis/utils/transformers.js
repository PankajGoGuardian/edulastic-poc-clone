import { reportUtils } from '@edulastic/constants'
import { getHSLFromRange1 } from '../../../../common/util'

const { sortByAvgPerformanceAndLabel } = reportUtils.questionAnalysis

export const getChartData = (qSummary = [], sortKey) => {
  const percent_100 = 100
  const milliseconds_1000 = 1000
  const arr = qSummary.map((item) => {
    const {
      avgPerformance: _avgPerformance,
      questionLabel: qLabel,
      avgTimeSpent: avgTimeMins,
      districtAvgPerf,
      ...rest
    } = item
    const avgPerformance = !Number.isNaN(_avgPerformance)
      ? Math.round(_avgPerformance)
      : 0
    const avgIncorrect = Math.round(percent_100 - avgPerformance)
    const districtAvg = Math.round(districtAvgPerf)
    const avgTimeSecs = Math.floor(avgTimeMins / milliseconds_1000)
    return {
      ...rest,
      qLabel,
      avgPerformance,
      avgIncorrect,
      avgTime: avgTimeMins,
      avgTimeSecs,
      avgTimeMins,
      districtAvg,
      fill: getHSLFromRange1(avgPerformance),
    }
  })
  return sortByAvgPerformanceAndLabel(arr, sortKey)
}
