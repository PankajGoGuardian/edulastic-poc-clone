import { invert } from 'lodash'
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

export const compareByOptionsInfo = {
  [compareByKeys.SCHOOL]: { key: 'schoolId', name: 'schoolName' },
  [compareByKeys.TEACHER]: { key: 'teacherId', name: 'teacherName' },
  [compareByKeys.CLASS]: { key: 'groupId', name: 'groupName' },
  [compareByKeys.GROUP]: { key: 'groupId', name: 'groupName' },
  [compareByKeys.RACE]: {
    key: compareByKeys.RACE,
    name: compareByKeys.RACE,
  },
  [compareByKeys.GENDER]: {
    key: compareByKeys.GENDER,
    name: compareByKeys.GENDER,
  },
  [compareByKeys.FRL_STATUS]: {
    key: compareByKeys.FRL_STATUS,
    name: compareByKeys.FRL_STATUS,
  },
  [compareByKeys.ELL_STATUS]: {
    key: compareByKeys.ELL_STATUS,
    name: compareByKeys.ELL_STATUS,
  },
  [compareByKeys.IEP_STATUS]: {
    key: compareByKeys.IEP_STATUS,
    name: compareByKeys.IEP_STATUS,
  },
  [compareByKeys.HISPANIC_ETHNICITY]: {
    key: compareByKeys.HISPANIC_ETHNICITY,
    name: compareByKeys.HISPANIC_ETHNICITY,
  },
}

export const compareByKeysToFilterKeys = {
  [compareByKeys.SCHOOL]: 'schoolIds',
  [compareByKeys.TEACHER]: 'teacherIds',
  [compareByKeys.CLASS]: 'classIds',
  [compareByKeys.GROUP]: 'groupIds',
}

export const filterKeysToCompareByKeys = invert(compareByKeysToFilterKeys)

export const commonFilterKeys = [
  compareByKeysToFilterKeys[compareByKeys.SCHOOL],
  compareByKeysToFilterKeys[compareByKeys.TEACHER],
  compareByKeysToFilterKeys[compareByKeys.CLASS],
  compareByKeysToFilterKeys[compareByKeys.GROUP],
]

export const nextCompareByKeys = {
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
