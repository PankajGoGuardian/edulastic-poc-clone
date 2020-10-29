import { get } from 'lodash'
import { getDropDownTestIds } from '../../../../common/util'

const processSchoolYear = (user) => {
  let schoolYear = []
  const arr = get(user, 'orgData.terms', [])
  if (arr.length) {
    schoolYear = arr.map((item) => ({ key: item._id, title: item.name }))
  }
  return schoolYear
}

export const getDropDownData = (SARFilterData, user) => {
  const schoolYear = processSchoolYear(user)
  const testDataArr = get(SARFilterData, 'data.result.testData', [])
  const testIdArr = getDropDownTestIds(testDataArr)
  return {
    testDataArr,
    schoolYear,
    testIdArr,
  }
}

export const filteredDropDownData = (SARFilterData, user, currentFilter) => {
  const schoolYear = processSchoolYear(user)
  const testDataArr = get(SARFilterData, 'data.result.testData', [])
  const testIdArr = getDropDownTestIds(testDataArr)
  return {
    testDataArr,
    schoolYear,
    testIdArr,
    currentFilter,
  }
}

export const processTestIds = (_dropDownData, currentFilter, urlTestId) => {
  if (!(_dropDownData.testDataArr && _dropDownData.testDataArr.length)) {
    const finalTestIds = []
    return { testIds: finalTestIds, validTestId: { key: '', title: '' } }
  }
  _dropDownData.testDataArr.sort((a, b) => b.assessmentDate - a.assessmentDate)
  const arr = _dropDownData.testDataArr.filter(
    (item) =>
      (item.assessmentType === currentFilter.assessmentType ||
        currentFilter.assessmentType === 'All') &&
      (item.groupId === currentFilter.groupId ||
        currentFilter.groupId === 'All' ||
        currentFilter.groupId === '') &&
      (item.groupId === currentFilter.classId ||
        currentFilter.classId === 'All' ||
        currentFilter.classId === '')
  )
  const finalTestIds = []
  const makeUniqueMap = {}
  for (const item of arr) {
    if (!makeUniqueMap[item.testId]) {
      finalTestIds.push({ key: item.testId, title: item.testName })
      makeUniqueMap[item.testId] = true
    }
  }

  const validTestId = finalTestIds.find((item) => urlTestId === item.key)
  return {
    testIds: finalTestIds,
    validTestId: validTestId ? validTestId.key : '',
  }
}

export const transformMetricForStudentGroups = (groups, metricInfo) => {
  const studentGroupsMap = {}
  groups.forEach((group) => {
    if (group.groupType === 'custom') {
      if (!studentGroupsMap[group.studentId]) {
        studentGroupsMap[group.studentId] = []
      }
      studentGroupsMap[group.studentId].push({
        groupId: group.groupId,
        groupName: group.groupName,
      })
    }
  })

  // filter student based on student groups
  // and replace group info with student group info in meticInfo
  const metics = []
  metricInfo.forEach((info) => {
    if (studentGroupsMap[info.studentId]) {
      metics.push(
        ...studentGroupsMap[info.studentId].map(({ groupId, groupName }) => ({
          ...info,
          groupId,
          groupName,
        }))
      )
    }
  })
  return metics
}
