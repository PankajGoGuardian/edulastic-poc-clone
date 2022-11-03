import { percentage } from '@edulastic/constants/reportUtils/common'
import { flatMap, groupBy, isEmpty, keyBy, mapValues, max, sum } from 'lodash'

export const getDenormalizedChartData = (chartData) => {
  if (isEmpty(chartData) || isEmpty(chartData.data)) return []

  const {data: metrics, rubric} = chartData

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
      m.criteria.ratings.map(r => {
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

export const getDenormalizedTableData = (tableData, rubric) => {
  if (isEmpty(tableData) || isEmpty(tableData.data) || isEmpty(rubric))
    return []
}
