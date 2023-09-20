import { get, isEmpty, some } from 'lodash'
import { useMemo } from 'react'
import {
  bandKeys,
  getExternalBandInfoByExternalTest,
  getPerformanceMatrixData,
  getSummaryDataFromSummaryMetrics,
  transformTestInfo,
} from '../utils'

const useSummaryMetrics = ({
  reportSummaryData,
  reportFilters,
  externalBands,
  externalTests,
  selectedPrePerformanceBand,
  selectedPostPerformanceBand,
}) => {
  return useMemo(() => {
    const summaryMetricInfo = get(reportSummaryData, 'metricInfo', [])
    if (isEmpty(summaryMetricInfo)) return {}
    const [common] = summaryMetricInfo
    const { preStudentCount, postStudentCount } = common
    const testInfoFromSummaryData = get(reportSummaryData, 'testInfo', [])

    const testInfo = transformTestInfo(
      testInfoFromSummaryData,
      externalTests,
      reportFilters
    )
    const { preTestInfo, postTestInfo } = testInfo

    let preBandInfo = selectedPrePerformanceBand
    let postBandInfo = selectedPostPerformanceBand
    let preBandSortKey = bandKeys.INTERNAL
    let postBandSortKey = bandKeys.INTERNAL

    if (preTestInfo.isExternal) {
      preBandInfo = getExternalBandInfoByExternalTest({
        testId: reportFilters.preTestId,
        externalBands,
        testInfo: externalTests,
      })
      preBandSortKey = bandKeys.EXTERNAL
    }

    if (postTestInfo.isExternal) {
      postBandInfo = getExternalBandInfoByExternalTest({
        testId: reportFilters.postTestId,
        externalBands,
        testInfo: externalTests,
      })
      postBandSortKey = bandKeys.EXTERNAL
    }

    let isSamePerformanceBand = false
    if (preTestInfo.isExternal && postTestInfo.isExternal) {
      isSamePerformanceBand =
        preBandInfo.testCategory === postBandInfo.testCategory &&
        preBandInfo.testTitle === postBandInfo.testTitle
    } else if (!preTestInfo.isExternal && !postTestInfo.isExternal) {
      isSamePerformanceBand = preBandInfo?._id === postBandInfo?._id
    }

    const prePerformanceBand = (
      preBandInfo?.bands || preBandInfo?.performanceBand
    )?.sort((a, b) => a[preBandSortKey] - b[preBandSortKey])
    const postPerformanceBand = (
      postBandInfo?.bands || postBandInfo?.performanceBand
    )?.sort((a, b) => a[postBandSortKey] - b[postBandSortKey])

    const summaryData = getSummaryDataFromSummaryMetrics(
      summaryMetricInfo,
      testInfo,
      prePerformanceBand,
      postPerformanceBand
    )
    const {
      performanceMatrixColumnHeaders,
      performanceMatrixRowsData,
    } = getPerformanceMatrixData(
      testInfo,
      summaryMetricInfo,
      prePerformanceBand,
      postPerformanceBand,
      summaryData.totalStudentCount
    )

    return {
      performanceMatrixColumnHeaders,
      performanceMatrixRowsData,
      ...summaryData,
      prePerformanceBand,
      postPerformanceBand,
      hasIncompleteTests: some(
        testInfo,
        ({ incompleteCount = 0 }) => +incompleteCount > 0
      ),
      testInfo,
      isSamePerformanceBand,
      preStudentCount,
      postStudentCount,
    }
  }, [reportSummaryData, reportFilters, externalBands])
}

export default useSummaryMetrics
