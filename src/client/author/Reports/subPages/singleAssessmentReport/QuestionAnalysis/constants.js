export const pickDataForSummary = [
  'reportId',
  'termId',
  'assessmentTypes',
  'assignedBy',
  'classIds',
  'courseId',
  'grades',
  'groupIds',
  'networkIds',
  'schoolIds',
  'subjects',
  'teacherIds',
  'testId',
  'race',
  'gender',
  'iepStatus',
  'frlStatus',
  'ellStatus',
  'hispanicEthnicity',
]

export const pickDataForDetails = [
  ...pickDataForSummary,
  'compareBy',
  'page',
  'pageSize',
  'recompute',
  'sortOrder',
]

export const pageSize = 200

export const compareByEnums = {
  CLASS: 'class',
  SCHOOL: 'school',
  TEACHER: 'teacher',
}

export const comparedByToToolTipLabel = {
  [compareByEnums.SCHOOL]: {
    name: 'School Name',
    type: 'School (% Score)',
    all: 'All Schools (% Score)',
    nameKey: 'schoolName',
  },
  [compareByEnums.TEACHER]: {
    name: 'Teacher Name',
    type: 'Teacher (% Score)',
    all: 'All Teachers (% Score)',
    nameKey: 'teacherName',
  },
  [compareByEnums.CLASS]: {
    name: 'Class Name',
    type: 'Class (% Score)',
    all: 'All Classes (% Score)',
    nameKey: 'className',
  },
}

export const compareByDropDownData = [
  { key: 'school', title: 'School' },
  { key: 'teacher', title: 'Teacher' },
  { key: 'class', title: 'Class' },
]

export const dropDownKeyToLabel = {
  school: 'School',
  teacher: 'Teacher',
  class: 'Class',
}

export const sortOrderMap = {
  ascend: 'asc',
  descend: 'desc',
}
