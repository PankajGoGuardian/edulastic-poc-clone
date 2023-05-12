import { DW_GOALS_AND_INTERVENTIONS_URL } from '../../../../common/constants/dataWarehouseReports'

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

export const compareByFieldKeys = {
  [compareByKeys.SCHOOL]: 'schoolId',
  [compareByKeys.TEACHER]: 'teacherId',
  [compareByKeys.CLASS]: 'groupId',
  [compareByKeys.GROUP]: 'groupId',
  [compareByKeys.STUDENT]: 'studentId',
  [compareByKeys.RACE]: compareByKeys.RACE,
  [compareByKeys.GENDER]: compareByKeys.GENDER,
  [compareByKeys.FRL_STATUS]: compareByKeys.FRL_STATUS,
  [compareByKeys.ELL_STATUS]: compareByKeys.ELL_STATUS,
  [compareByKeys.IEP_STATUS]: compareByKeys.IEP_STATUS,
  [compareByKeys.HISPANIC_ETHNICITY]: compareByKeys.HISPANIC_ETHNICITY,
}

export const compareBylabels = {
  [compareByKeys.SCHOOL]: 'schoolName',
  [compareByKeys.TEACHER]: 'teacherName',
  [compareByKeys.CLASS]: 'groupName',
  [compareByKeys.GROUP]: 'groupName',
  [compareByKeys.RACE]: compareByKeys.RACE,
  [compareByKeys.GENDER]: compareByKeys.GENDER,
  [compareByKeys.FRL_STATUS]: compareByKeys.FRL_STATUS,
  [compareByKeys.ELL_STATUS]: compareByKeys.ELL_STATUS,
  [compareByKeys.IEP_STATUS]: compareByKeys.IEP_STATUS,
  [compareByKeys.HISPANIC_ETHNICITY]: compareByKeys.HISPANIC_ETHNICITY,
}

export const compareByFilterFieldKeys = {
  [compareByKeys.SCHOOL]: 'schoolIds',
  [compareByKeys.TEACHER]: 'teacherIds',
  [compareByKeys.CLASS]: 'classIds',
  [compareByKeys.GROUP]: 'groupIds',
}

export const nextCompareByOptionsMap = {
  [compareByKeys.SCHOOL]: compareByKeys.TEACHER,
  [compareByKeys.TEACHER]: compareByKeys.CLASS,
  [compareByKeys.CLASS]: compareByKeys.STUDENT,
  [compareByKeys.GROUP]: compareByKeys.STUDENT,
}

export const compareByOptions = [
  { key: compareByKeys.SCHOOL, title: 'School', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.TEACHER, title: 'Teacher', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.CLASS, title: 'Class' },
  // { key: compareByKeys.GROUP, title: 'Student Group' },
  // { key: compareByKeys.STUDENT, title: 'Student' },
  { key: compareByKeys.RACE, title: 'Race' },
  { key: compareByKeys.GENDER, title: 'Gender' },
  { key: compareByKeys.FRL_STATUS, title: 'FRL Status' },
  { key: compareByKeys.ELL_STATUS, title: 'ELL Status' },
  { key: compareByKeys.IEP_STATUS, title: 'IEP Status' },
  { key: compareByKeys.HISPANIC_ETHNICITY, title: 'Hispanic Ethnicity' },
]

export const trendPeriodDateFormat = `MMM'YY`
export const trendPeriodPrefix = 'vs '

export const createStudentGroupUrl = `${DW_GOALS_AND_INTERVENTIONS_URL}?subActiveKey=2`
