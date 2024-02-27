import { map, get, find, round, sumBy } from 'lodash'
import { formatDate } from '../../../../../common/util'

export const getData = (rawData = {}, tests = []) => {
  if (!tests.length) {
    return []
  }

  const { districtAvg = [], groupAvg = [], schoolAvg = [] } = rawData

  const parsedData = map(tests, (test) => {
    const { testId, assignments } = test

    const testInfo = { testId }

    const testDistrictAvg = round(
      get(find(districtAvg, testInfo), 'districtAvgPerf', 0)
    )
    const testGroupAvg = round(get(find(groupAvg, testInfo), 'groupAvgPerf', 0))
    const testSchoolAvg = round(
      get(find(schoolAvg, testInfo), 'schoolAvgPerf', 0)
    )
    const testSchoolId = get(find(schoolAvg, testInfo), 'schoolId', null)
    const rawScore = `${
      sumBy(assignments, 'score')?.toFixed(2) || '0.00'
    } / ${round(sumBy(assignments, 'maxScore'), 2)}`

    const assignmentDateFormatted = formatDate(test.assignmentDate)

    return {
      totalQuestions: 0,
      ...test,
      assignmentDateFormatted,
      districtAvg: testDistrictAvg,
      groupAvg: testGroupAvg,
      schoolAvg: testSchoolAvg,
      schoolId: testSchoolId,
      rawScore,
    }
  })

  return parsedData
}
