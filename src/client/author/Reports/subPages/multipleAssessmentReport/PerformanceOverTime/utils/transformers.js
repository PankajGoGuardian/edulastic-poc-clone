import { getAllTestTypesMap } from '../../../../../../common/utils/testTypeUtils'
import {
  groupBy,
  sumBy,
  round,
  maxBy,
  minBy,
  get,
  map,
  forEach,
  values,
  reduce,
} from 'lodash'
import {
  percentage,
  getLeastProficiencyBand,
  formatDate,
} from '../../../../common/util'

export const convertToBandData = (metricInfo = [], bandInfo = []) => {
  const leastProficiency = getLeastProficiencyBand(bandInfo)

  // add default scale information
  const defaultScaleData = reduce(
    bandInfo,
    (result, band) => {
      result[band.name] = 0
      result[`${band.name} Percentage`] = 0
      return result
    },
    {
      aboveStandard: 0,
      belowStandard: 0,
      'aboveStandard Percentage': 0,
      'belowStandard Percentage': 0,
    }
  )

  const convertedBandData = map(metricInfo, (metric) => {
    const scaleData = { ...defaultScaleData }
    const totalGraded = sumBy(metric.records, (el) =>
      parseInt(el.totalGraded, 10)
    )

    forEach(metric.records, (record) => {
      scaleData[record.bandName] = parseInt(record.totalAssigned, 10)
      const calculatedPercentage = round(
        percentage(parseInt(record.totalGraded, 10), totalGraded)
      )
      scaleData[`${record.bandName} Percentage`] =
        record.bandName == leastProficiency.name
          ? -calculatedPercentage
          : calculatedPercentage

      if (parseInt(record.aboveStandard, 10) > 0) {
        scaleData.aboveStandard += parseInt(record.totalGraded, 10)
      } else {
        scaleData.belowStandard += parseInt(record.totalGraded, 10)
      }
    })

    scaleData['aboveStandard Percentage'] = round(
      percentage(scaleData.aboveStandard, totalGraded)
    )
    scaleData['belowStandard Percentage'] = -round(
      percentage(scaleData.belowStandard, totalGraded)
    )

    return {
      ...scaleData,
      testName: metric.testName,
      isIncomplete: metric.isIncomplete,
      testId: metric.testId,
      uniqId: metric.uniqId,
    }
  })
  return convertedBandData
}

export const parseData = (rawData = {}) => {
  const { metricInfo = [], incompleteTests = [] } = rawData

  if (!metricInfo.length) {
    return []
  }

  const groupedByTest = groupBy(metricInfo, 'testId')

  const groupedTestsByType = reduce(
    groupedByTest,
    (data, value) => {
      const groupedByType = groupBy(value, 'testType')
      return data.concat(values(groupedByType))
    },
    []
  )

  const parsedData = map(groupedTestsByType, (records) => {
    const {
      assessmentDate,
      testId,
      testName,
      totalTestItems,
      testType,
    } = records[0]

    const totalAssigned = sumBy(records, (test) =>
      parseInt(test.totalAssigned || 0, 10)
    )
    const totalGraded = sumBy(records, (test) =>
      parseInt(test.totalGraded || 0, 10)
    )
    const totalScore = sumBy(records, (test) =>
      parseFloat(test.totalScore || 0)
    )
    const totalMaxScore = sumBy(
      records,
      (test) =>
        parseFloat(test.maxPossibleScore || 0) * parseInt(test.totalGraded, 10)
    )

    const score = round(percentage(totalScore, totalMaxScore))
    const rawScore = totalScore / totalGraded || 0
    const assessmentDateFormatted = formatDate(assessmentDate)
    const testTypes = getAllTestTypesMap()

    return {
      maxScore: get(maxBy(records, 'maxScore'), 'maxScore', 0),
      minScore: get(minBy(records, 'minScore'), 'minScore', 0),
      maxPossibleScore: (records.find((r) => r.maxPossibleScore) || records[0])
        .maxPossibleScore,
      totalAbsent: sumBy(records, (test) => parseInt(test.totalAbsent, 10)),
      totalGraded,
      diffScore: 100 - round(score),
      testId,
      testName,
      totalTestItems,
      uniqId: testId + testType,
      testType: testTypes[testType.toLowerCase()],
      assessmentDate,
      assessmentDateFormatted,
      totalAssigned,
      totalScore,
      totalMaxScore,
      score,
      rawScore,
      records,
      isIncomplete: incompleteTests.includes(testId),
    }
  })

  return parsedData
}
