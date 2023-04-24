import {
  GRADE_OPTIONS,
  SUBJECT_OPTIONS,
} from '@edulastic/constants/reportUtils/common'
import { compareByKeys } from '../../common/utils'

// decimal base value for parseInt()
export const TESTIDS_COUNT_FOR_PRE_POST = 2
export const TABLE_PAGE_SIZE = 25

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
      key: '3',
      title: 'Demographics',
    },
  },
  tagTypes: [
    { key: 'termId', tabKey: '0' },
    { key: 'testGrades', subType: 'test', tabKey: '0' },
    { key: 'testSubjects', subType: 'test', tabKey: '0' },
    { key: 'tagIds', tabKey: '0' },
    { key: 'assessmentTypes', tabKey: '0' },
    { key: 'testIds', tabKey: '0' },
    { key: 'schoolIds', tabKey: '1' },
    { key: 'teacherIds', tabKey: '1' },
    { key: 'grades', subType: 'class', tabKey: '1' },
    { key: 'subjects', subType: 'class', tabKey: '1' },
    { key: 'assignedBy', tabKey: '1' },
    { key: 'courseId', tabKey: '1' },
    { key: 'classIds', tabKey: '1' },
    { key: 'groupIds', tabKey: '1' },
    { key: 'profileId', tabKey: '2' },
    { key: 'race', tabKey: '3' },
    { key: 'gender', tabKey: '3' },
    { key: 'iepStatus', tabKey: '3' },
    { key: 'frlStatus', tabKey: '3' },
    { key: 'ellStatus', tabKey: '3' },
    { key: 'hispanicEthnicity', tabKey: '3' },
  ],
  initialFilters: {
    reportId: '',
    termId: '',
    testGrades: '',
    testSubjects: '',
    tagIds: '',
    assessmentTypes: '',
    testIds: '',
    schoolIds: '',
    teacherIds: '',
    grades: '',
    subjects: '',
    courseId: 'All',
    classIds: '',
    groupIds: '',
    preProfileId: '',
    postProfileId: '',
    assignedBy: 'anyone',
    preTestId: '',
    postTestId: '',
    race: 'all',
    gender: 'all',
    iepStatus: 'all',
    frlStatus: 'all',
    ellStatus: 'all',
    hispanicEthnicity: 'all',
  },
  requestFilters: {
    reportId: '',
    termId: '',
    testSubjects: '',
    testGrades: '',
    assessmentTypes: '',
    tagIds: '',
    testIds: '',
    schoolIds: '',
    teacherIds: '',
    subjects: '',
    grades: '',
    courseId: '',
    classIds: '',
    groupIds: '',
    preProfileId: '',
    postProfileId: '',
    assignedBy: 'anyone',
    preTestId: '',
    postTestId: '',
    race: 'all',
    gender: 'all',
    iepStatus: 'all',
    frlStatus: 'all',
    ellStatus: 'all',
    hispanicEthnicity: 'all',
  },
  subjects: SUBJECT_OPTIONS,
  grades: GRADE_OPTIONS,
  assignedBy: [
    { key: 'anyone', title: 'Anyone' },
    { key: 'me', title: 'Me' },
  ],
}

export const compareByOptions = [
  { key: compareByKeys.SCHOOL, title: 'School', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.TEACHER, title: 'Teacher', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.CLASS, title: 'Class' },
  {
    key: compareByKeys.STUDENT,
    title: 'Student',
    hiddenFromRole: ['district-admin', 'school-admin'],
  },
  { key: compareByKeys.RACE, title: 'Race' },
  { key: compareByKeys.GENDER, title: 'Gender' },
  { key: compareByKeys.FRL_STATUS, title: 'FRL Status' },
  { key: compareByKeys.ELL_STATUS, title: 'ELL Status' },
  { key: compareByKeys.IEP_STATUS, title: 'IEP Status' },
  { key: compareByKeys.HISPANIC_ETHNICITY, title: 'Hispanic Ethnicity' },
]

export const analyseByOptions = [
  { key: 'score', title: 'Score %' },
  { key: 'rawScore', title: 'Raw Score' },
]

export const dataKeys = {
  EXTERNAL: 'AchievementLevel',
  INTERNAL: 'BandScore',
}

export const bandKeys = {
  EXTERNAL: 'rank',
  INTERNAL: 'threshold',
}

export const genericColumnsForTable = [
  {
    title: 'compareBy',
    key: 'compareBy',
    dataIndex: 'compareByColumnTitle',
    width: 150,
    align: 'left',
  },
  {
    title: 'Students',
    key: 'students',
    width: 50,
    align: 'center',
    dataIndex: 'studentsCount',
  },
  {
    title: 'Test',
    width: 200,
    key: 'test',
    align: 'center',
    dataIndex: 'data',
    visibleOn: ['browser'],
  },
  {
    title: 'Avg. Performance',
    key: 'avgPerformance',
    dataIndex: 'data',
    width: 120,
    align: 'center',
    visibleOn: ['browser'],
  },
  {
    title: 'Avg (Pre)',
    key: 'AvgPre',
    dataIndex: 'data',
    align: 'center',
    visibleOn: ['csv'],
  },
  {
    title: 'Avg (Pre)',
    key: 'AvgPost',
    dataIndex: 'data',
    align: 'center',
    visibleOn: ['csv'],
  },
  {
    title: 'Change',
    width: 80,
    key: 'change',
    align: 'center',
    dataIndex: 'data',
  },
  {
    title: 'Performance Band',
    width: 250,
    key: 'performanceBand',
    align: 'center',
    dataIndex: 'data',
    visibleOn: ['browser'],
  },
]

export const compareByStudentColumns = [
  {
    title: 'compareBy',
    key: 'compareBy',
    dataIndex: 'compareByColumnTitle',
    align: 'left',
    width: 100,
  },
  {
    title: 'School',
    key: 'school',
    width: 150,
    align: 'center',
    dataIndex: 'schoolName',
  },
  {
    title: 'Teacher',
    key: 'teacher',
    width: 90,
    align: 'center',
    dataIndex: 'teacherName',
  },
  {
    title: 'Class',
    key: 'class',
    width: 90,
    dataIndex: 'className',
  },
  {
    title: 'Test',
    width: 90,
    key: 'test',
    align: 'center',
    dataIndex: 'data',
    visibleOn: ['browser'],
  },
  {
    title: 'Avg. Performance',
    key: 'avgPerformance',
    dataIndex: 'data',
    width: 120,
    align: 'center',
    visibleOn: ['browser'],
  },
  {
    title: 'Change',
    key: 'change',
    width: 70,
    align: 'center',
    dataIndex: 'data',
  },
]

export const analyseBykeys = {
  RAW_SCORE: 'rawScore',
  SCORE_PERCENT: 'scorePercentage',
}
