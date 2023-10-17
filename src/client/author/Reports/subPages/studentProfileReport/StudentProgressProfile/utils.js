import { uniqBy } from 'lodash'

export function getTestsFilterDropdownOptions(metricInfo) {
  const uniqueAssignments = uniqBy(metricInfo, 'assignmentId')
  return uniqueAssignments.map(({ assignmentId, testName }) => ({
    key: assignmentId,
    title: testName,
  }))
}
