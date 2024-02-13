import { mapValues } from 'lodash'

export const sortKeys = {
  COMPARE_BY: 'compareBy',
}

export const tableColumnsData = [
  {
    dataIndex: sortKeys.COMPARE_BY,
    key: sortKeys.COMPARE_BY,
    align: 'left',
    fixed: 'left',
    width: 200,
    sorter: true,
  },
  // next up are dynamic columns for each assessment
]
export const compareByKeys = {
  SCHOOL: 'school',
  TEACHER: 'teacher',
  CLASS: 'class',
}

const compareByOptionsInfo = {
  [compareByKeys.SCHOOL]: { key: 'schoolId', name: 'schoolName' },
  [compareByKeys.TEACHER]: { key: 'teacherId', name: 'teacherName' },
  [compareByKeys.CLASS]: { key: 'groupId', name: 'groupName' },
}

export const compareByMap = mapValues(compareByOptionsInfo, ({ name }) => name)
