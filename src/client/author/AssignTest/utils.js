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
