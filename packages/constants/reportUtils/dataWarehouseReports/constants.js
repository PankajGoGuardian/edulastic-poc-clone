const { invert } = require('lodash')

const testTypes = require('../../const/testTypes')

const { TEST_TYPES_VALUES_MAP, ALL_TEST_TYPES_VALUES } = testTypes

const compareByKeys = {
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

const compareByOptionsInfo = {
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

const compareByFieldKeys = Object.keys(compareByOptionsInfo).reduce(
  (res, ele) => {
    return { ...res, [ele]: compareByOptionsInfo[ele].key }
  },
  {}
)

const compareByKeysToFilterKeys = {
  [compareByKeys.SCHOOL]: 'schoolIds',
  [compareByKeys.TEACHER]: 'teacherIds',
  [compareByKeys.CLASS]: 'classIds',
  [compareByKeys.GROUP]: 'groupIds',
  ...demographicFilterFields,
}

const filterKeysToCompareByKeys = invert(compareByKeysToFilterKeys)

const commonFilterKeys = [
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

const nextCompareByKeys = {
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

const compareByOptions = [
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

const INTERNAL_TEST_TYPES_ORDER = ALL_TEST_TYPES_VALUES.reduce(
  (acc, curr, currIndex) => {
    if (curr === TEST_TYPES_VALUES_MAP.COMMON_ASSESSMENT) acc[curr] = 0
    else if (curr === TEST_TYPES_VALUES_MAP.SCHOOL_COMMON_ASSESSMENT)
      acc[curr] = 1
    else if (curr === TEST_TYPES_VALUES_MAP.ASSESSMENT) acc[curr] = 2
    else acc[curr] = currIndex
    return acc
  },
  {}
)

const trendPeriodDateFormat = `MMM'YY`

const trendPeriodPrefix = 'vs '

const PIE_CHART_LABEL_THRESHOLD = 5

const EXTERNAL_SCORE_TYPES = {
  SCALED_SCORE: 'score',
  LEXILE_SCORE: 'lexileScore',
  QUANTILE_SCORE: 'quantileScore',
}

const EXTERNAL_SCORE_TYPES_LIST = [
  { key: EXTERNAL_SCORE_TYPES.SCALED_SCORE, title: 'Scaled Score' },
  { key: EXTERNAL_SCORE_TYPES.LEXILE_SCORE, title: 'Lexile Score' },
  { key: EXTERNAL_SCORE_TYPES.QUANTILE_SCORE, title: 'Quantile Score' },
]

const EXTERNAL_SCORE_TYPES_TO_TEST_TYPES = {
  [EXTERNAL_SCORE_TYPES.LEXILE_SCORE]: [
    testTypes.CAASPP,
    testTypes.iReady_ELA,
    testTypes.NWEA,
    testTypes.GMAS_EOC,
    testTypes.GMAS_EOG,
    testTypes.ILEARN,
    testTypes.STARR,
  ],
  [EXTERNAL_SCORE_TYPES.QUANTILE_SCORE]: [
    testTypes.CAASPP,
    testTypes.iReady_Math,
    testTypes.NWEA,
    testTypes.ILEARN,
  ],
}

const EXTERNAL_SCORE_PREFIX = {
  [EXTERNAL_SCORE_TYPES.LEXILE_SCORE]: 'BR',
  [EXTERNAL_SCORE_TYPES.QUANTILE_SCORE]: 'EM',
}

const EXTERNAL_SCORE_SUFFIX = {
  [EXTERNAL_SCORE_TYPES.LEXILE_SCORE]: 'L',
  [EXTERNAL_SCORE_TYPES.QUANTILE_SCORE]: 'Q',
}

const EXTERNAL_SCORE_TOOLTIP_TEXT = {
  [EXTERNAL_SCORE_TYPES.SCALED_SCORE]: '',
  [EXTERNAL_SCORE_TYPES.LEXILE_SCORE]:
    'Lexile score is applicable for ELA assessments only',
  [EXTERNAL_SCORE_TYPES.QUANTILE_SCORE]:
    'Quantile score is applicable for Math assessments only',
}

const ATTENDANCE_EVENT_CATEGORY_LABELS = {
  inAttendanceDays: 'In Attendance',
  excusedAbsenceDays: 'Excused Absences',
  unexcusedAbsenceDays: 'Unexcused Absences',
  tardyDays: 'Tardy',
  earlyDepartureDays: 'Early Departure',
  partialDays: 'Partial',
}

module.exports = {
  compareByKeys,
  demographicFilterFields,
  compareByOptionsInfo,
  compareByFieldKeys,
  compareByKeysToFilterKeys,
  filterKeysToCompareByKeys,
  commonFilterKeys,
  nextCompareByKeys,
  compareByOptions,
  INTERNAL_TEST_TYPES_ORDER,
  trendPeriodDateFormat,
  trendPeriodPrefix,
  PIE_CHART_LABEL_THRESHOLD,
  EXTERNAL_SCORE_TYPES,
  EXTERNAL_SCORE_TYPES_LIST,
  EXTERNAL_SCORE_TYPES_TO_TEST_TYPES,
  EXTERNAL_SCORE_PREFIX,
  EXTERNAL_SCORE_SUFFIX,
  EXTERNAL_SCORE_TOOLTIP_TEXT,
  ATTENDANCE_EVENT_CATEGORY_LABELS,
}
