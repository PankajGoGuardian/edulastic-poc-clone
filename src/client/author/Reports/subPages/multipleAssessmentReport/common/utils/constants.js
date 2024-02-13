export const trendTypes = {
  up: {
    color: '#99cb76',
    rotation: 45,
  },
  flat: {
    color: '#ffe6c0',
    rotation: 90,
  },
  down: {
    color: '#eb7b65',
    rotation: 135,
  },
}

export const reportLinkColor = 'rgba(0, 0, 0, 0.65)'

export const compareByKeys = {
  SCHOOL: 'school',
  TEACHER: 'teacher',
  CLASS: 'class',
  GROUP: 'group',
  STUDENT: 'student',
  RACE: 'race',
  GENDER: 'gender',
  FRL_STATUS: 'frlStatus',
  ELL_STATUS: 'ellStatus',
  IEP_STATUS: 'iepStatus',
  HISPANIC_ETHNICITY: 'hispanicEthnicity',
}

export const compareByOptions = [
  { key: compareByKeys.SCHOOL, title: 'School' },
  { key: compareByKeys.TEACHER, title: 'Teacher' },
  { key: compareByKeys.CLASS, title: 'Class' },
  { key: compareByKeys.GROUP, title: 'Student Group' },
  { key: compareByKeys.STUDENT, title: 'Student' },
  { key: compareByKeys.RACE, title: 'Race' },
  { key: compareByKeys.GENDER, title: 'Gender' },
  { key: compareByKeys.FRL_STATUS, title: 'FRL Status' },
  { key: compareByKeys.ELL_STATUS, title: 'ELL Status' },
  { key: compareByKeys.IEP_STATUS, title: 'IEP Status' },
  { key: compareByKeys.HISPANIC_ETHNICITY, title: 'Hispanic Ethnicity' },
]
