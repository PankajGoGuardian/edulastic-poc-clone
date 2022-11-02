import { percentage } from '@edulastic/constants/reportUtils/common'
import { flatMap, groupBy, keyBy } from 'lodash'

export const getDenormalizedChartData = (metrics, rubrics) => {
  console.log(metrics, rubrics)
  const rubricsMap = keyBy(rubrics, 'id')
  const allCriterias = flatMap(rubrics, 'criteria')
  const criteriaMap = keyBy(allCriterias, 'id')
  const allRatings = flatMap(allCriterias, 'ratings')
  const ratingsMap = keyBy(allRatings, 'id')

  const denormalizedData = []

  metrics.forEach((metric) => {
    const { name: rubricName } = rubricsMap[metric.rubricId]
    const { name: criteriaName } = criteriaMap[metric.criteriaId]

    const totalResponsesPerCriteria = Object.keys(
      metric.responsesByRating
    ).reduce(
      (total, ratingKey) => total + metric.responsesByRating[ratingKey],
      0
    )
    const responsePercentagePerCriteria = percentage(
      totalResponsesPerCriteria,
      metric.totalResponses,
      true
    )

    Object.keys(metric.responsesByRating).forEach((ratingId) => {
      const { name: ratingName, fill } = ratingsMap[ratingId]
      const totalResponsesPerRating = metric.responsesByRating[ratingId]
      const responsePercentagePerRating = percentage(
        totalResponsesPerRating,
        metric.totalResponses,
        true
      )
      denormalizedData.push({
        ...metric,
        rubricName,
        criteriaName,
        ratingId,
        ratingName,
        totalResponsesPerCriteria,
        responsePercentagePerCriteria,
        totalResponsesPerRating,
        responsePercentagePerRating,
        fill,
      })
    })
  })

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
        [ele.topLabelKey]: `${metricsGroupedByCriteria[metricKey][0].responsePercentagePerCriteria}%`,
      }
    }, {})

    return {
      ...data,
      ...metricsGroupedByCriteria[metricKey][0],
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
