import { get, groupBy, isEmpty } from 'lodash'
import {
  getDropDownTestIds,
  processClassAndGroupIds,
  processFilteredClassAndGroupIds,
} from '../../../../common/util'

export const transformFiltersForMAR = (requestFilters) => {
  let classIds = ''
  let groupIds = ''
  let schoolIds = ''
  if (requestFilters?.classIds && Array.isArray(requestFilters?.classIds)) {
    classIds = requestFilters.classIds.join(',')
  } else if (requestFilters?.classId) {
    classIds = requestFilters.classId
  }
  if (requestFilters?.groupIds && Array.isArray(requestFilters?.groupIds)) {
    groupIds = requestFilters.groupIds.join(',')
  } else if (requestFilters?.groupId) {
    groupIds = requestFilters.groupId
  }
  if (requestFilters?.schoolIds && Array.isArray(requestFilters?.schoolIds)) {
    schoolIds = requestFilters.schoolIds.join(',')
  }
  if (requestFilters?.schoolId) {
    // overwrite schoolIds if schoolId is selected
    schoolIds = requestFilters.schoolId
  }
  return {
    ...requestFilters,
    classIds,
    groupIds,
    schoolIds,
  }
}

const processSchoolYear = (user) => {
  let schoolYear = []
  const arr = get(user, 'orgData.terms', [])
  if (arr.length) {
    schoolYear = arr.map((item) => ({ key: item._id, title: item.name }))
  }
  return schoolYear
}

const processCourseIds = (orgDataArr) => {
  const byCourseId = groupBy(
    orgDataArr.filter((item) => !!item.courseId),
    'courseId'
  )
  const courseIdArr = Object.keys(byCourseId).map((item) => ({
    key: item,
    title:
      byCourseId[item][0].courseName ||
      `(Course ID: ${item.substring(item.length - 5)})`,
  }))
  courseIdArr.unshift({
    key: 'All',
    title: 'All Courses',
  })

  return courseIdArr
}

const processSchoolIds = (orgDataArr) => {
  const bySchoolId = groupBy(
    orgDataArr.filter((item) => !!item.schoolId),
    'schoolId'
  )
  const schoolIdArr = Object.keys(bySchoolId).map((item) => ({
    key: bySchoolId[item][0].schoolId,
    title: bySchoolId[item][0].schoolName,
  }))
  schoolIdArr.unshift({
    key: 'All',
    title: 'All Schools',
  })

  return schoolIdArr
}

const processTeacherIds = (orgDataArr) => {
  const byTeacherId = groupBy(
    orgDataArr.filter((item) => !!item.teacherId),
    'teacherId'
  )
  const teacherIdArr = Object.keys(byTeacherId).map((item) => ({
    key: byTeacherId[item][0].teacherId,
    title: byTeacherId[item][0].teacherName,
  }))
  teacherIdArr.unshift({
    key: 'All',
    title: 'All Teachers',
  })

  return teacherIdArr
}

export const getDropDownData = (SARFilterData, user) => {
  const schoolYear = processSchoolYear(user)

  const orgDataArr = get(SARFilterData, 'data.result.orgData', [])
  const testDataArr = get(SARFilterData, 'data.result.testData', [])

  // for class id & group id
  const [classIdArr, groupIdArr] = processClassAndGroupIds(orgDataArr)

  // For Course Id
  const courseIdArr = processCourseIds(orgDataArr)

  // Only For district admin
  // For School Id
  const schoolIdArr = processSchoolIds(orgDataArr)

  // For Teacher Id
  const teacherIdArr = processTeacherIds(orgDataArr)

  const testIdArr = getDropDownTestIds(testDataArr)

  return {
    orgDataArr,
    testDataArr,

    schoolYear,
    classes: classIdArr,
    groups: groupIdArr,
    courses: courseIdArr,
    schools: schoolIdArr,
    teachers: teacherIdArr,

    testIdArr,
  }
}

export const filteredDropDownData = (SARFilterData, user, currentFilter) => {
  const schoolYear = processSchoolYear(user)

  const orgDataArr = get(SARFilterData, 'data.result.orgData', [])
  const testDataArr = get(SARFilterData, 'data.result.testData', [])

  // for class & group id
  const [classIdArr, groupIdArr] = processFilteredClassAndGroupIds(
    orgDataArr,
    currentFilter
  )

  // set default class id
  if (!classIdArr.find((item) => item.key === currentFilter.classId)) {
    currentFilter.classId = classIdArr[0]
  }

  // set default group id
  if (!groupIdArr.find((item) => item.key === currentFilter.groupId)) {
    currentFilter.groupId = groupIdArr[0]
  }

  // For Course Id
  const courseIdArr = processCourseIds(orgDataArr)

  // Only For district admin
  // For School Id
  const schoolIdArr = processSchoolIds(orgDataArr)

  // For Teacher Id
  const teacherIdArr = processTeacherIds(orgDataArr)

  const testIdArr = getDropDownTestIds(testDataArr)

  return {
    orgDataArr,
    testDataArr,

    schoolYear,
    classes: classIdArr,
    groups: groupIdArr,
    courses: courseIdArr,
    schools: schoolIdArr,
    teachers: teacherIdArr,

    testIdArr,

    currentFilter,
  }
}

export const processTestIds = (
  _dropDownData,
  currentFilter,
  urlTestId,
  role
) => {
  if (!(_dropDownData.testDataArr && _dropDownData.testDataArr.length)) {
    const finalTestIds = []
    return { testIds: finalTestIds, validTestId: { key: '', title: '' } }
  }

  const filtered = _dropDownData.orgDataArr.filter((item) => {
    const checkForClassAndGroup =
      item.groupType === 'class'
        ? item.groupId === currentFilter.classId ||
          currentFilter.classId === 'All'
        : !isEmpty(currentFilter.groupId)
    // keep all custom groups to get all tests assigned to any one group NOTE: its always true
    const checkForGrades =
      (item.grades || '')
        .split(',')
        .filter((g) => g.length)
        .includes(currentFilter.grade) || currentFilter.grade === 'All'
    if (role !== 'teacher') {
      if (
        item.termId === currentFilter.termId &&
        (item.subject === currentFilter.subject ||
          currentFilter.subject === 'All') &&
        (item.courseId === currentFilter.courseId ||
          currentFilter.courseId === 'All') &&
        (item.schoolId === currentFilter.schoolId ||
          currentFilter.schoolId === 'All') &&
        (item.teacherId === currentFilter.teacherId ||
          currentFilter.teacherId === 'All') &&
        checkForGrades &&
        checkForClassAndGroup
      ) {
        return true
      }
    } else if (
      item.termId === currentFilter.termId &&
      (item.subject === currentFilter.subject ||
        currentFilter.subject === 'All') &&
      (item.courseId === currentFilter.courseId ||
        currentFilter.courseId === 'All') &&
      checkForGrades &&
      checkForClassAndGroup
    ) {
      return true
    }
    return false
  })

  const groupIdMap = {}
  for (const item of filtered) {
    if (!groupIdMap[item.groupId]) {
      groupIdMap[item.groupId] = item
    }
  }

  const arr = _dropDownData.testDataArr.filter(
    (item) =>
      groupIdMap[item.groupId] &&
      (item.assessmentType === currentFilter.assessmentType ||
        currentFilter.assessmentType === 'All')
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
