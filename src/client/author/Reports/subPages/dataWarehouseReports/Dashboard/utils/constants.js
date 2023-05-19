import {
  GRADE_OPTIONS,
  PERIOD_NAMES,
  PERIOD_TYPES,
  SUBJECT_OPTIONS,
} from '@edulastic/constants/reportUtils/common'

export const availableTestTypes = [
  {
    key: 'common assessment',
    title: 'Common Assessment',
  },
  {
    key: 'assessment',
    title: 'Class Assessment',
  },
]

export const tableFilterTypes = {
  COMPARE_BY: 'compareBy',
  PAGE: 'page',
  PAGE_SIZE: 'pageSize',
  SORT_KEY: 'sortKey',
  SORT_ORDER: 'sortOrder',
  ABOVE_EQUAL_TO_AVG: 'aboveEqualToAvg',
  BELOW_AVG: 'belowAvg',
}

export const TABLE_PAGE_SIZE = 50

export const trendPeriodDateFormat = `MMM'YY`
export const trendPeriodPrefix = 'vs '

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
  [compareByKeys.STUDENT]: 'studentId',
  [compareByKeys.RACE]: compareByKeys.RACE,
  [compareByKeys.GENDER]: compareByKeys.GENDER,
  [compareByKeys.FRL_STATUS]: compareByKeys.FRL_STATUS,
  [compareByKeys.ELL_STATUS]: compareByKeys.ELL_STATUS,
  [compareByKeys.IEP_STATUS]: compareByKeys.IEP_STATUS,
  [compareByKeys.HISPANIC_ETHNICITY]: compareByKeys.HISPANIC_ETHNICITY,
}

export const compareByOptions = [
  { key: compareByKeys.SCHOOL, title: 'School', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.TEACHER, title: 'Teacher', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.CLASS, title: 'Class' },
  {
    key: compareByKeys.STUDENT,
    title: 'Student',
  },
  { key: compareByKeys.RACE, title: 'Race' },
  { key: compareByKeys.GENDER, title: 'Gender' },
  { key: compareByKeys.FRL_STATUS, title: 'FRL Status' },
  { key: compareByKeys.ELL_STATUS, title: 'ELL Status' },
  { key: compareByKeys.IEP_STATUS, title: 'IEP Status' },
  { key: compareByKeys.HISPANIC_ETHNICITY, title: 'Hispanic Ethnicity' },
]

export const academicSummaryFiltersTypes = {
  PERFORMANCE_BAND: 'profileId',
  TEST_TYPE: 'academicTestType',
}

export const staticDropDownData = {
  filterSections: {
    TEST_FILTERS: {
      key: '0',
      title: 'Select Assessments',
    },
    CLASS_FILTERS: {
      key: '1',
      title: 'Select Classes',
    },
    DEMOGRAPHIC_FILTERS: {
      key: '2',
      title: 'Demographics',
    },
    PERIOD: {
      key: '3',
      title: 'Duration',
    },
  },
  tagTypes: [
    { key: 'termId', tabKey: '0' },
    { key: 'testGrades', subType: 'test', tabKey: '0' },
    { key: 'testSubjects', subType: 'test', tabKey: '0' },
    { key: 'assessmentTypes', tabKey: '0' },
    { key: 'schoolIds', tabKey: '1' },
    { key: 'teacherIds', tabKey: '1' },
    { key: 'grades', subType: 'class', tabKey: '1' },
    { key: 'subjects', subType: 'class', tabKey: '1' },
    { key: 'courseId', tabKey: '1' },
    { key: 'classIds', tabKey: '1' },
    { key: 'groupIds', tabKey: '1' },
    { key: 'race', tabKey: '2' },
    { key: 'gender', tabKey: '2' },
    { key: 'iepStatus', tabKey: '2' },
    { key: 'frlStatus', tabKey: '2' },
    { key: 'ellStatus', tabKey: '2' },
    { key: 'hispanicEthnicity', tabKey: '2' },
    { key: 'periodType', tabKey: '3' },
    { key: 'customPeriodStart', tabKey: '3' },
    { key: 'customPeriodEnd', tabKey: '3' },
  ],
  initialFilters: {
    reportId: '',
    termId: '',
    testGrades: '',
    testSubjects: '',
    assessmentTypes: '',
    testIds: '',
    schoolIds: '',
    teacherIds: '',
    grades: '',
    subjects: '',
    courseId: 'All',
    classIds: '',
    groupIds: '',
    assignedBy: 'anyone',
    race: 'all',
    gender: 'all',
    iepStatus: 'all',
    frlStatus: 'all',
    ellStatus: 'all',
    hispanicEthnicity: 'all',
    periodType: PERIOD_TYPES.TILL_DATE,
    customPeriodStart: undefined,
    customPeriodEnd: undefined,
  },
  subjects: SUBJECT_OPTIONS,
  grades: GRADE_OPTIONS,
  assignedBy: [
    { key: 'anyone', title: 'Anyone' },
    { key: 'me', title: 'Me' },
  ],
  periodTypes: Object.entries(PERIOD_NAMES).map(([key, title]) => ({
    key,
    title,
  })),
}

export const compareByKeysToFilterKeys = {
  [compareByKeys.SCHOOL]: 'schoolIds',
  [compareByKeys.TEACHER]: 'teacherIds',
  [compareByKeys.CLASS]: 'classIds',
  [compareByKeys.GROUP]: 'groupIds',
  [compareByKeys.RACE]: 'race',
  [compareByKeys.GENDER]: 'gender',
  [compareByKeys.FRL_STATUS]: 'frlStatus',
  [compareByKeys.ELL_STATUS]: 'ellStatus',
  [compareByKeys.IEP_STATUS]: 'iepStatus',
  [compareByKeys.HISPANIC_ETHNICITY]: 'hispanicEthnicity',
  [compareByKeys.STUDENT]: 'studentId',
}

export const nextCompareByKeys = {
  [compareByKeys.SCHOOL]: compareByKeys.TEACHER,
  [compareByKeys.TEACHER]: compareByKeys.CLASS,
  [compareByKeys.CLASS]: compareByKeys.STUDENT,
  [compareByKeys.GROUP]: compareByKeys.STUDENT,
}

const filterFields = [
  'termId',
  'testGrades',
  'testSubjects',
  'assessmentTypes',
  'schoolIds',
  'teacherIds',
  'grades',
  'subjects',
  'courseId',
  'classIds',
  'groupIds',
  'race',
  'gender',
  'iepStatus',
  'frlStatus',
  'ellStatus',
  'hispanicEthnicity',
  'periodType',
  'customPeriodStart',
  'customPeriodEnd',
]

const detailsExtraFields = [
  ...Object.values(tableFilterTypes),
  ...Object.values(academicSummaryFiltersTypes),
  'districtAvgScore',
]

export const filterDetailsFields = [...filterFields, ...detailsExtraFields]

export const sharedDetailsFields = ['reportId', ...detailsExtraFields]

export const districtAvgDimension = {
  _id: 'districtAvg',
  name: 'Overall Avg.',
}
