import { percentage } from '@edulastic/constants/reportUtils/common'
import { groupBy, isEmpty, keyBy, mapValues, map, max, sum } from 'lodash'

export const getDenormalizedChartData = (chartData) => {
  if (isEmpty(chartData) || isEmpty(chartData.data)) return []

  const { data: metrics, rubric } = chartData

  // const allCriterias

  const denormalizedData = metrics
    .map((m) => {
      const criteria = rubric.criteria.find((crit) => crit.id === m.criteriaId)
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

      return {
        ...m,
        rubric,
        rubricName: rubric.name,
        criteria,
        criteriaName,
        totalResponsesPerCriteria,
        pointSumPerCriteria,
        scorePercentagePerCriteria,
        avgScorePerCriteria,
      }
    })
    .flatMap((m) =>
      m.criteria.ratings.map((r) => {
        const totalResponsesPerRating = m.responsesByRating[r.id] || 0

        return {
          ...m,
          ratingId: r.id,
          ratingName: r.name,
          totalResponsesPerRating,
          responsePercentagePerRating: percentage(
            totalResponsesPerRating,
            m.totalResponsesPerCriteria,
            true
          ),
          rating: r,
          fill: '#FF0',
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

  const flatData = metrics
    .map((m) => {
      const criteria = rubric.criteria.find((ct) => ct.id === m.criteriaId)
      return {
        ...m,
        rubric,
        criteria,
        maxRatingPoints: max(criteria.ratings.map((r) => r.points)),
      }
    })
    .flatMap((m) =>
      compareByNames.map((rowRef) => ({
        ...m,
        compareById: rowRef._id,
        compareByName: rowRef.name,
      }))
    )
  const denormalizedData = Object.values(groupBy(flatData, 'compareById')).map(
    (rowArr) => {
      const columnValues = mapValues(keyBy(rowArr, 'criteriaId'), (cell) => ({
        avgScore: cell.scoreGrouped[cell.compareById],
        avgScorePercentage:
          cell.scoreGrouped[cell.compareById] / max(cell.maxRatingPoints),
      }))
      return {
        // for reference only.
        rowName: rowArr[0].compareByName,
        rowId: rowArr[0].compareById,
        ...columnValues,
      }
    }
  )
  return denormalizedData
}

export const getTableData = (tableApiResponse, chartData) => {
  if (isEmpty(chartData)) return []
  const denormalizedData = getDenormalizedTableData(
    tableApiResponse,
    chartData.rubric
  )
  return map(denormalizedData, (row) => ({
    ...row,
    /// append colors ?
  }))
}
