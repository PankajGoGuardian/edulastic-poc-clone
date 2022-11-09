import { getColorBandBySize } from '@edulastic/constants/const/colors'
import { percentage } from '@edulastic/constants/reportUtils/common'
import {
  groupBy,
  isEmpty,
  keyBy,
  mapValues,
  map,
  max,
  sum,
  round,
} from 'lodash'

export const getDenormalizedChartData = (chartData) => {
  if (isEmpty(chartData) || isEmpty(chartData.data)) return []

  const {data: metrics, rubric} = chartData

  // const allCriterias

  const denormalizedData = rubric.criteria
    .flatMap((ct) =>
      metrics.filter((m) => m.criteriaId === ct.id).map((v) => [v, ct])
    )
    .map(([m, criteria]) => {
      const criteriaName = criteria.name
      const totalResponsesPerCriteria = sum(Object.values(m.responsesByRating))
      const pointSumPerCriteria = sum(
        criteria.ratings.map((r) => r.points * (m.responsesByRating[r.id] || 0))
      )
      const avgScorePerCriteria =
        pointSumPerCriteria / totalResponsesPerCriteria
      const scorePercentagePerCriteria = percentage(
        avgScorePerCriteria,
        max(criteria.ratings.map((r) => r.points)),
        true
      )

      return ({
        ...m,
        rubric,
        rubricName: rubric.name,
        criteria,
        criteriaName,
        totalResponsesPerCriteria,
        pointSumPerCriteria,
        scorePercentagePerCriteria,
        avgScorePerCriteria,
    })})
    .flatMap((m) =>
      m.criteria.ratings.map((r, i) => {
        const totalResponsesPerRating = m.responsesByRating[r.id] || 0
        const colorBand = getColorBandBySize(
          Math.min(m.criteria.ratings.length, 10)
        ).reverse()
        const fill = colorBand[Math.min(i, colorBand.length - 1)]
        return {
          ...m,
          avgScorePerCriteria: round(m.avgScorePerCriteria, 2),
          ratingId: r.id,
          ratingName: r.name,
          totalResponsesPerRating,
          responsePercentagePerRating: percentage(
            totalResponsesPerRating,
            m.totalResponsesPerCriteria,
            true
          ),
          rating: r,
          fill,
        }
      })
    )
  return denormalizedData
}

export const getChartData = (denormalizedData) => {
  const ratingsMap = groupBy(denormalizedData, 'ratingId')
  const barsData = Object.keys(ratingsMap).map((ratingKey, index) => {
    const { ratingId, ratingName, fill } = ratingsMap[ratingKey][0]
    return {
      key: ratingId,
      insideLabelKey: `inside-label-bar${index + 1}`,
      topLabelKey: `top-label-bar${index + 1}`,
      stackId: 'a',
      fill,
      name: ratingName,
      ratingId,
    }
  })

  const metricsGroupedByCriteria = groupBy(denormalizedData, 'criteriaId')
  const _renderData = Object.keys(metricsGroupedByCriteria).map((metricKey) => {
    const data = barsData.reduce((res, ele) => {
      const barData = metricsGroupedByCriteria[metricKey].find(
        (metric) => metric.ratingId === ele.key
      )
      return {
        ...res,
        [ele.key]: barData?.responsePercentagePerRating || 0,
        [ele.insideLabelKey]: barData?.responsePercentagePerRating || 0,
      }
    }, {})
    const _topLabelKey = `top-label-bar${barsData.length}`
    return {
      ...data,
      ...metricsGroupedByCriteria[metricKey][0],
      [_topLabelKey]: `${
        metricsGroupedByCriteria[metricKey][0].scorePercentagePerCriteria || 0
      }%`,
    }
  })

  let currentRubricId = null
  const renderData = _renderData
    .sort((a, b) => `${a.rubricId}`.localeCompare(`${b.rubricId}`))
    .map((d) => {
      if (currentRubricId !== d.rubricId) {
        currentRubricId = d.rubricId
        return {
          ...d,
          secondaryAxisLabel: d.rubricName,
        }
      }
      return {
        ...d,
      }
    })

  return { barsData, renderData }
}

export const getDenormalizedTableData = (tableApiResponse, rubric) => {
  if (
    isEmpty(tableApiResponse) ||
    isEmpty(tableApiResponse.data) ||
    isEmpty(rubric)
  )
    return []
  const { data: metrics, compareByNames } = tableApiResponse
  const maxRubricPoints = sum(
    rubric.criteria.map((ct) => max(ct.ratings.map((rt) => rt.points)))
  )
  const flatData = metrics
    .map((m) => {
      const criteria = rubric.criteria.find((ct) => ct.id === m.criteriaId)
      if (!criteria) return null
      return {
        ...m,
        rubric,
        criteria,
        maxRatingPoints: max(criteria.ratings.map((r) => r.points)),
        maxRubricPoints,
      }
    })
    .filter(Boolean)
    .flatMap((m) =>
      compareByNames.map((rowRef) => ({
        ...m,
        compareById: rowRef._id,
        compareByName: rowRef.name,
      }))
    )
  const denormalizedData = Object.values(groupBy(flatData, 'compareById')).map(
    (rowArr) => {
      const criteriaColumnValues = mapValues(
        keyBy(rowArr, 'criteriaId'),
        (cell) => ({
          avgScore: round(cell.scoreGrouped[cell.compareById], 2),
          avgScorePercentage: percentage(
            cell.scoreGrouped[cell.compareById],
            cell.maxRatingPoints,
            true
          ),
          maxScore: round(cell.maxRatingPoints),
          responseCount: round(cell.countGrouped[cell.compareById] || 0, 2),
        })
      )
      const totalResponses = max(
        rowArr.map((cell) => cell.countGrouped[cell.compareById] || 0)
      )
      const averageRatingPoints =
        sum(
          rowArr.map(
            (cell) =>
              cell.countGrouped[cell.compareById] *
              cell.scoreGrouped[cell.compareById]
          )
        ) / totalResponses
      const averageRatingPercPoints = percentage(
        averageRatingPoints,
        maxRubricPoints,
        true
      )
      return {
        // for reference only.
        rowName: rowArr[0].compareByName,
        rowId: rowArr[0].compareById,
        averageRatingPoints: round(averageRatingPoints, 2),
        totalResponses,
        maxRubricPoints: round(maxRubricPoints, 2),
        averageRatingPercPoints: round(averageRatingPercPoints, 2),
        ...criteriaColumnValues,
      }
    }
  )
  return denormalizedData
}

export const getTableData = (tableApiResponse, chartData) => {
  const denormalizedData = getDenormalizedTableData(
    tableApiResponse,
    chartData.rubric
  )
  return map(denormalizedData, (row) => ({
    ...row,
    /// append colors ?
  }))
}
