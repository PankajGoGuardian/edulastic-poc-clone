import { map, forEach, find, orderBy, isEmpty, toLower } from 'lodash'
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
    const {
      groupName = 'N/A',
      schoolName = 'N/A',
      teacherName = 'N/A',
    } = relatedOrg
    return { ...student, groupName, schoolName, teacherName }
  })

  // sorting data in accessending order of student name
  return orderBy(data, ['firstName', 'lastName'], ['asc', 'asc'])
}

export const filterMetricInfoByDDFilters = (metricInfo = [], ddfilter) =>
  metricInfo.filter((info) => {
    if (
      !isEmpty(ddfilter.gender) &&
      toLower(ddfilter.gender) !== toLower(info.gender)
    ) {
      return false
    }
    if (
      !isEmpty(ddfilter.frlStatus) &&
      toLower(ddfilter.frlStatus) !== toLower(info.frlStatus)
    ) {
      return false
    }
    if (
      !isEmpty(ddfilter.ellStatus) &&
      toLower(ddfilter.ellStatus) !== toLower(info.ellStatus)
    ) {
      return false
    }
    if (
      !isEmpty(ddfilter.iepStatus) &&
      toLower(ddfilter.iepStatus) !== toLower(info.iepStatus)
    ) {
      return false
    }
    if (
      !isEmpty(ddfilter.race) &&
      toLower(ddfilter.race) !== toLower(info.race)
    ) {
      return false
    }
    return true
  })
