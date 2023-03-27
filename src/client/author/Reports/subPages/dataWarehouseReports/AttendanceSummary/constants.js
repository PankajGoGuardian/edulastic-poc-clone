export const sortOrderMap = {
  ascend: 'asc',
  descend: 'desc',
}
export const compareByKeys = {
  SCHOOL: 'school',
  TEACHER: 'teacher',
  CLASS: 'class',
}

export const pageSize = 25

export const compareByEnums = {
  CLASS: 'class',
  SCHOOL: 'school',
  TEACHER: 'teacher',
}

export const compareByToPluralName = {
  school: 'Schools',
  teacher: 'Teachers',
  class: 'Classes',
}

export const compareByOptions = [
  { key: compareByKeys.SCHOOL, title: 'School', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.TEACHER, title: 'Teacher', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.CLASS, title: 'Class' },
]
