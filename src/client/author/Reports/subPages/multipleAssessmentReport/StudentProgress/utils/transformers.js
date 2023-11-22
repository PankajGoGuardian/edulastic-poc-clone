import { map, forEach, find, orderBy } from 'lodash'
import next from 'immer'
import { getProficiencyBand } from '../../../../common/util'

export const augmentWithBand = (metricInfo = [], bandInfo = []) =>
  map(metricInfo, (metric) => {
    return next(metric, (draftMetric) => {
      forEach(draftMetric.tests, (test, testId) => {
        draftMetric.tests[testId].proficiencyBand = getProficiencyBand(
          test.score,
          bandInfo
        )
      })
    })
  })

export const augmentWithStudentInfo = (metricInfo = [], orgData = []) => {
  const data = map(metricInfo, (student) => {
    // get the related organisation
    const relatedOrg =
      find(orgData, (org) => org.groupId === student.groupId) || {}
    const { groupName = '-', schoolName = '-', teacherName = '-' } = relatedOrg
    return { ...student, groupName, schoolName, teacherName }
  })

  // sorting data in accessending order of student name
  return orderBy(data, ['firstName', 'lastName'], ['asc', 'asc'])
}
