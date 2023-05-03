import { reportUtils } from '@edulastic/constants'
import { sumBy, round, maxBy } from 'lodash'

import { bandKeys, dataKeys } from './constants'
import { getTestTitle } from '../../../../common/util'

const {
  getProficiencyBand,
  percentage,
  DECIMAL_BASE,
  ROUND_OFF_TO_INTEGER,
  EXTERNAL_TEST_KEY_SEPARATOR,
} = reportUtils.common

export const getAvgValue = (metricInfo, key, totalStudentCount) => {
  return round(
    sumBy(metricInfo, (m) => m.totalStudentCount * m[key]) / totalStudentCount
  )
}

const getSummaryCardInfo = (
  metricInfo,
  totalStudentCount,
  prefix,
  testInfo,
  performanceBand
) => {
  const isExternaltest = testInfo.isExternal
  const cardInfo = {}
  const avgScoreKey = `${prefix}TestScore`
  const avgScore = getAvgValue(metricInfo, avgScoreKey, totalStudentCount)

  if (isExternaltest) {
    const achievementLevelKey = `${prefix}${dataKeys.EXTERNAL}`
    const avgAchievementLevel = getAvgValue(
      metricInfo,
      achievementLevelKey,
      totalStudentCount
    )
    const color = performanceBand.find(
      (achievementLevel) => achievementLevel.rank === avgAchievementLevel
    )?.color
    Object.assign(cardInfo, {
      score: avgScore,
      color,
    })
  } else {
    const maxScore =
      maxBy(metricInfo, `${prefix}TestMaxScore`)?.[`${prefix}TestMaxScore`] || 0
    const avgPercentage = percentage(avgScore, maxScore, ROUND_OFF_TO_INTEGER)
    Object.assign(cardInfo, {
      score: avgPercentage,
      showPercent: true,
      text: ` (${avgScore}/${maxScore})`,
      color: getProficiencyBand(avgPercentage, performanceBand)?.color,
    })
  }
  return cardInfo
}

export const getSummaryDataFromSummaryMetrics = (
  summaryMetricInfo,
  testInfo,
  prePerformanceBand = [],
  postPerformanceBand = []
) => {
  const { preTestInfo, postTestInfo } = testInfo
  const totalStudentCount = sumBy(
    summaryMetricInfo,
    (m) => parseInt(m.totalStudentCount, DECIMAL_BASE) || 0
  )

  const preCardInfo = getSummaryCardInfo(
    summaryMetricInfo,
    totalStudentCount,
    'pre',
    preTestInfo,
    prePerformanceBand
  )

  const postCardInfo = getSummaryCardInfo(
    summaryMetricInfo,
    totalStudentCount,
    'post',
    postTestInfo,
    postPerformanceBand
  )

  const change =
    preTestInfo.isExternal || postTestInfo.isExternal
      ? null
      : postCardInfo.score - preCardInfo.score

  return {
    totalStudentCount,
    summaryData: {
      preCardInfo,
      postCardInfo,
      change,
    },
  }
}

// curate performance matrix data from summary metrics for selected performance band
export const getDataKeys = (testInfo = {}) => {
  const { preTestInfo = {}, postTestInfo = {} } = testInfo
  const preDataKey = preTestInfo.isExternal
    ? `pre${dataKeys.EXTERNAL}`
    : `pre${dataKeys.INTERNAL}`
  const postDataKey = postTestInfo.isExternal
    ? `post${dataKeys.EXTERNAL}`
    : `post${dataKeys.INTERNAL}`
  return [preDataKey, postDataKey]
}

export const getbandKeys = (testInfo = {}) => {
  const { preTestInfo = {}, postTestInfo = {} } = testInfo
  const { EXTERNAL, INTERNAL } = bandKeys
  const preBandIdentifier = preTestInfo.isExternal ? EXTERNAL : INTERNAL
  const postBandIdentifier = postTestInfo.isExternal ? EXTERNAL : INTERNAL
  return [preBandIdentifier, postBandIdentifier]
}

const getPerformanceMatrixColumnHeaders = (
  performanceBand,
  metricInfo,
  postDataKey,
  postBandIdentifier,
  totalStudentCount
) => {
  return performanceBand.map((pb) => {
    const threshold = pb[postBandIdentifier]
    const testData = metricInfo.filter(
      (m) => parseInt(m[postDataKey], DECIMAL_BASE) === threshold
    )
    const studentsCount = sumBy(testData, (d) =>
      parseInt(d.totalStudentCount, DECIMAL_BASE)
    )
    const studentsPercentage = percentage(
      studentsCount,
      totalStudentCount,
      ROUND_OFF_TO_INTEGER
    )
    return {
      studentsCount,
      studentsPercentage,
      color: pb.color,
      threshold,
    }
  })
}

const getPerformanceMatrixCellData = (
  postPerformanceBand,
  pb1,
  metricInfo,
  totalStudentCount,
  preDataKey,
  postDataKey,
  preBandIdentifier,
  postBandIdentifier
) => {
  return postPerformanceBand.map((pb2) => {
    const preThreshold = pb1[preBandIdentifier]
    const postThreshold = pb2[postBandIdentifier]
    const preVsPostCellStudentCount =
      metricInfo.find(
        (m) =>
          parseInt(m[preDataKey], DECIMAL_BASE) == preThreshold &&
          parseInt(m[postDataKey], DECIMAL_BASE) == postThreshold
      )?.totalStudentCount || 0
    const preVsPostCellStudentPercentage = percentage(
      preVsPostCellStudentCount,
      totalStudentCount,
      ROUND_OFF_TO_INTEGER
    )

    return {
      preThreshold,
      postThreshold,
      preVsPostCellStudentCount,
      preVsPostCellStudentPercentage,
    }
  })
}

const getPerformanceMatrixRowsData = (
  prePerformanceBand,
  postPerformanceBand,
  totalStudentCount,
  metricInfo,
  preDataKey,
  postDataKey,
  preBandIdentifier,
  postBandIdentifier
) => {
  return prePerformanceBand.map((pb1) => {
    const preTestData = metricInfo.filter(
      (m) => parseInt(m[preDataKey], DECIMAL_BASE) === pb1[preBandIdentifier]
    )
    const studentsCount = sumBy(preTestData, (d) =>
      parseInt(d.totalStudentCount, DECIMAL_BASE)
    )
    const studentsPercentage = percentage(
      studentsCount,
      totalStudentCount,
      ROUND_OFF_TO_INTEGER
    )

    const preVsPostCellsData = getPerformanceMatrixCellData(
      postPerformanceBand,
      pb1,
      metricInfo,
      totalStudentCount,
      preDataKey,
      postDataKey,
      preBandIdentifier,
      postBandIdentifier
    )

    return {
      ...pb1,
      threshold: pb1[preBandIdentifier],
      studentsCount,
      studentsPercentage,
      preVsPostCellsData,
    }
  })
}

export const getPerformanceMatrixData = (
  testInfo,
  summaryMetricInfo,
  prePerformanceBand = [],
  postPerformanceBand = [],
  totalStudentCount
) => {
  const [preDataKey, postDataKey] = getDataKeys(testInfo)
  const [preBandIdentifier, postBandIdentifier] = getbandKeys(testInfo)

  const performanceMatrixColumnHeaders = getPerformanceMatrixColumnHeaders(
    postPerformanceBand,
    summaryMetricInfo,
    postDataKey,
    postBandIdentifier,
    totalStudentCount
  )

  const performanceMatrixRowsData = getPerformanceMatrixRowsData(
    prePerformanceBand,
    postPerformanceBand,
    totalStudentCount,
    summaryMetricInfo,
    preDataKey,
    postDataKey,
    preBandIdentifier,
    postBandIdentifier
  )

  return { performanceMatrixColumnHeaders, performanceMatrixRowsData }
}

const getInternalTestInfoByTestId = (testInfo, testId) => {
  const test = testInfo.find((t) => t.testId === testId) ?? {}
  const { title = '', incompleteCount = 0 } = test
  const name = `${title} ${+incompleteCount > 0 ? '*' : ''}`.trim()
  return { incompleteCount: +incompleteCount, name, isExternal: false }
}

const getExternalTestInfoByTestId = (testId) => {
  const testIdSplit = testId.split(EXTERNAL_TEST_KEY_SEPARATOR)
  const [testCategory, testTitle] = testIdSplit.splice(-2)
  const testName = testIdSplit.join(EXTERNAL_TEST_KEY_SEPARATOR)
  return { name: testName, category: testCategory, testTitle, isExternal: true }
}

export const transformTestInfo = (testInfo, reportFilters) => {
  const { preTestId, postTestId } = reportFilters
  const preTestInfo = preTestId.includes(EXTERNAL_TEST_KEY_SEPARATOR)
    ? getExternalTestInfoByTestId(preTestId)
    : getInternalTestInfoByTestId(testInfo, preTestId)
  const postTestInfo = postTestId.includes(EXTERNAL_TEST_KEY_SEPARATOR)
    ? getExternalTestInfoByTestId(postTestId)
    : getInternalTestInfoByTestId(testInfo, postTestId)
  return { preTestInfo, postTestInfo }
}

export const getExternalBandInfoByExternalTest = ({
  testId,
  externalBands,
}) => {
  const testIdSplit = testId.split(EXTERNAL_TEST_KEY_SEPARATOR)
  const [_testCategory, _testTitle] = testIdSplit.splice(-2)

  return externalBands.find(({ testTitle, testCategory }) => {
    const checkForTestTitle = !testTitle || testTitle === _testTitle
    const checkForTestCategory = testCategory === _testCategory
    return checkForTestCategory && checkForTestTitle
  })
}

export const getExternalBandsListFromBandInfo = (externalBandInfo) => {
  return [externalBandInfo].map(({ testTitle, testCategory }) => {
    const _testTitle = getTestTitle(testCategory, testTitle)
    return {
      key: `${testCategory}__${testTitle || ''}`,
      title: `${testCategory} ${_testTitle}`,
    }
  })
}
