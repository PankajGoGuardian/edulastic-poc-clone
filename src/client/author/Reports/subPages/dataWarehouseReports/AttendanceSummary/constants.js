export const sortOrderMap = {
  ascend: 'asc',
  descend: 'desc',
}

export const pageSize = 25

export const compareByEnums = {
  CLASS: 'class',
  SCHOOL: 'school',
  TEACHER: 'teacher',
  STUDENT: 'student',
}

export const compareByToPluralName = {
  school: 'Schools',
  teacher: 'Teachers',
  class: 'Classes',
  student: 'Student',
}

export const compareByOptions = [
  { key: compareByEnums.SCHOOL, title: 'School', hiddenFromRole: ['teacher'] },
  {
    key: compareByEnums.TEACHER,
    title: 'Teacher',
    hiddenFromRole: ['teacher'],
  },
  { key: compareByEnums.CLASS, title: 'Class' },
  { key: compareByEnums.STUDENT, title: 'Student' },
]

export const AttendanceSummaryLegends = [
  { name: 'Attendance', color: '#9FC6D2' },
]

export const yAxisTickValues = [0, 100]

export const groupByConstants = {
  WEEK: 'week',
  MONTH: 'month',
}
