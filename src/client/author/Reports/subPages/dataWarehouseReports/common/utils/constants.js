import { invert } from 'lodash'
import {
  TEST_TYPES_VALUES_MAP,
  ALL_TEST_TYPES_VALUES,
} from '@edulastic/constants/const/testTypes'
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

const demographicFilterFields = {
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
  [compareByKeys.STUDENT]: { key: 'studentId', name: 'studentName' },
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

export const compareByFieldKeys = Object.keys(compareByOptionsInfo).reduce(
  (res, ele) => {
    return { ...res, [ele]: compareByOptionsInfo[ele].key }
  },
  {}
)

export const compareByKeysToFilterKeys = {
  [compareByKeys.SCHOOL]: 'schoolIds',
  [compareByKeys.TEACHER]: 'teacherIds',
  [compareByKeys.CLASS]: 'classIds',
  [compareByKeys.GROUP]: 'groupIds',
  ...demographicFilterFields,
}

export const filterKeysToCompareByKeys = invert(compareByKeysToFilterKeys)

export const commonFilterKeys = [
  compareByKeysToFilterKeys[compareByKeys.SCHOOL],
  compareByKeysToFilterKeys[compareByKeys.TEACHER],
  compareByKeysToFilterKeys[compareByKeys.CLASS],
  compareByKeysToFilterKeys[compareByKeys.GROUP],
  compareByKeys.RACE,
  compareByKeys.GENDER,
  compareByKeys.FRL_STATUS,
  compareByKeys.ELL_STATUS,
  compareByKeys.IEP_STATUS,
  compareByKeys.HISPANIC_ETHNICITY,
]

export const nextCompareByKeys = {
  [compareByKeys.SCHOOL]: compareByKeys.TEACHER,
  [compareByKeys.TEACHER]: compareByKeys.CLASS,
  [compareByKeys.CLASS]: compareByKeys.STUDENT,
  [compareByKeys.GROUP]: compareByKeys.STUDENT,
  [compareByKeys.RACE]: compareByKeys.STUDENT,
  [compareByKeys.GENDER]: compareByKeys.STUDENT,
  [compareByKeys.FRL_STATUS]: compareByKeys.STUDENT,
  [compareByKeys.ELL_STATUS]: compareByKeys.STUDENT,
  [compareByKeys.IEP_STATUS]: compareByKeys.STUDENT,
  [compareByKeys.HISPANIC_ETHNICITY]: compareByKeys.STUDENT,
}

export const compareByOptions = [
  { key: compareByKeys.SCHOOL, title: 'School', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.TEACHER, title: 'Teacher', hiddenFromRole: ['teacher'] },
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

export const INTERNAL_TEST_TYPES_ORDER = ALL_TEST_TYPES_VALUES.reduce(
  (acc, curr, currIndex) => {
    if (curr === TEST_TYPES_VALUES_MAP.COMMON_ASSESSMENT) acc[curr] = 0
    else if (curr === TEST_TYPES_VALUES_MAP.ASSESSMENT) acc[curr] = 1
    else acc[curr] = currIndex
    return acc
  },
  {}
)

export const trendPeriodDateFormat = `MMM'YY`
export const trendPeriodPrefix = 'vs '

export const createStudentGroupUrl = `${DW_GOALS_AND_INTERVENTIONS_URL}?subActiveKey=2`

export const PIE_CHART_LABEL_THRESHOLD = 5
