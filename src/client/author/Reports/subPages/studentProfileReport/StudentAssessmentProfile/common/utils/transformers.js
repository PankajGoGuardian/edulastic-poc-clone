import { map, get, find, round, sumBy } from 'lodash'
import { getAllTestTypesMap } from '../../../../../../../common/utils/testTypeUtils'
import { formatDate } from '../../../../../common/util'

export const getData = (rawData = {}, tests = []) => {
  if (!tests.length) {
    return []
  }

  const { districtAvg = [], groupAvg = [], schoolAvg = [] } = rawData

  const parsedData = map(tests, (test) => {
    const { testType, testId, assignments } = test

    const testInfo = { testId }

    const testDistrictAvg = round(
      get(find(districtAvg, testInfo), 'districtAvgPerf', 0)
    )
    const testGroupAvg = round(get(find(groupAvg, testInfo), 'groupAvgPerf', 0))
    const testSchoolAvg = round(
      get(find(schoolAvg, testInfo), 'schoolAvgPerf', 0)
    )
    const rawScore = `${
      sumBy(assignments, 'score')?.toFixed(2) || '0.00'
    } / ${round(sumBy(assignments, 'maxScore'), 2)}`

    const assignmentDateFormatted = formatDate(test.assignmentDate)
    const testTypes = getAllTestTypesMap()

    return {
      totalQuestions: 0,
      ...test,
      testType: testTypes[testType.toLowerCase()],
      assignmentDateFormatted,
      districtAvg: testDistrictAvg,
      groupAvg: testGroupAvg,
      schoolAvg: testSchoolAvg,
      rawScore,
    }
  })

  return parsedData
}
