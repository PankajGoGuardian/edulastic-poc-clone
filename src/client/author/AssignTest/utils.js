import { uniqBy } from 'lodash'

export const getListOfStudents = (students, classes) =>
  uniqBy(
    students.filter((student) => classes?.includes(student.groupId)),
    '_id'
  )

export const getListOfActiveStudents = (students, classes) =>
  students.filter(
    (student) => classes?.includes(student.groupId) && student.status === 1
  )

export const getInputIdList = (input = '') => {
  const commaSeparatedRegex = /^[a-f\d]{24}((,|, )[a-f\d]{24})*$/
  const spaceSeparatedRegex = /^[a-f\d]{24}( [a-f\d]{24})*$/
  const isCommaSeparatedIds = commaSeparatedRegex.test(input)
  if (isCommaSeparatedIds) {
    const idList = input?.split(',') || []
    if (Array.isArray(idList)) {
      return idList.map((id) => id?.trim() || '')
    }
  }
  const isSpaceSeparatedIds = spaceSeparatedRegex.test(input)
  if (isSpaceSeparatedIds) {
    const idList = input?.split(' ') || []
    if (Array.isArray(idList)) {
      return idList.map((id) => id?.trim() || '')
    }
  }
  return []
}
