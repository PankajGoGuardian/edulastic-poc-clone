import { PERIODS } from '@edulastic/constants/reportUtils/datawarehouseReports/dashboardReport'

export const masteryScales = [
  {
    _id: '6322e2b799978a000a298469',
    orgType: 'district',
    orgId: '6322e2b799978a000a298466',
    name: 'Standard Performance Band',
    performanceBand: [
      {
        color: '#60B14F',
        threshold: 70,
        aboveStandard: 1,
        name: 'Proficient',
      },
      {
        color: '#EBDD54',
        threshold: 50,
        aboveStandard: 1,
        name: 'Basic',
      },
      {
        color: '#EF9202',
        threshold: 0,
        aboveStandard: 0,
        name: 'Below Basic',
      },
    ],
  },
  {
    _id: '63296244dfe5d90009174d66',
    name:
      'Karthik Performance Band2 With Both bands selected for Above Standard',
    orgId: '6322e2b799978a000a298466',
    orgType: 'district',
    performanceBand: [
      {
        color: '#7c0a02',
        threshold: 81,
        aboveStandard: 1,
        name: 'Proficient',
      },
      {
        color: '#AFA515',
        threshold: 0,
        aboveStandard: 1,
        name: 'Below Basic',
      },
    ],
  },
  {
    _id: '63296348dfe5d90009174d67',
    name: 'Where We Are Today',
    orgId: '6322e2b799978a000a298466',
    orgType: 'district',
    performanceBand: [
      {
        color: '#576BA9',
        threshold: 82,
        aboveStandard: 1,
        name: 'Proficient Cyber Patriots Midnight Buzz Wonderland',
      },
      {
        color: '#A1C3EA',
        threshold: 45,
        aboveStandard: 1,
        name: 'Basic Western Front American Hustlers',
      },
      {
        color: '#F39300',
        threshold: 0,
        aboveStandard: 0,
        name: 'Below Basic Faster Than The Boys',
      },
    ],
  },
]

export const availableTestTypes = [
  {
    key: 'assessment',
    title: 'Class Assessment',
  },
  // {
  //   key: 'CAASPP',
  //   title: 'CAASPP',
  // },
  // {
  //   key: 'NWEA',
  //   title: 'NWEA',
  // },
  // {
  //   key: 'iReady_ELA',
  //   title: 'iReady (ELA)',
  // },
  // {
  //   key: 'iReady_Math',
  //   title: 'iReady (MATH)',
  // },
]

export const academicSummaryData = {
  avgScore: 66,
  periodAvgScore: 85,
  aboveStandardsStudents: 69,
  bandDistribution: [
    { bandScore: 0, students: 5 },
    { bandScore: 50, students: 10 },
    { bandScore: 70, students: 8 },
  ],
}

export const attendanceSummaryData = {
  avg: 67,
  prevMonthAvg: 54,
  prevMonth: '1st Dec.',
  tardiesPercentage: 12,
  chronicAbsentPercentage: 12,
  prevMonthtardiesPercentage: 9,
  prevMonthChronicPercentage: 5,
}

export const tableData = {
  metricInfo: [
    {
      dimension: {
        id: '1',
        name: 'El Dorado Adventist School',
      },
      avgAttendance: 85,
      performance: {
        Edulastic: {
          avg: 70,
          distribution: [
            {
              totalStudents: 36,
              bandScore: 0,
            },
            {
              totalStudents: 10,
              bandScore: 50,
            },
            {
              totalStudents: 5,
              bandScore: 70,
            },
          ],
        },
      },
    },
    {
      dimension: {
        id: '2',
        name: 'St. James',
      },
      avgAttendance: 85,
      avgPerformance: 70,
      performance: {
        Edulastic: {
          avg: 70,
          distribution: [
            {
              totalStudents: 36,
              bandScore: 0,
            },
            {
              totalStudents: 10,
              bandScore: 50,
            },
            {
              totalStudents: 5,
              bandScore: 70,
            },
          ],
        },
      },
    },
  ],
  dimensionCount: 15,
  aboveOrAtStandardCount: 8,
  belowStandardCount: 7,
}

export const cellStyles = {
  large: { padding: '18px 30px', font: '24px' },
  medium: { padding: '10px 15px', font: '18px' },
  small: { padding: '12px 17px', font: '14px' },
}

export const tableFilterTypes = {
  COMPARE_BY: 'compareBy',
  ABOVE_EQUAL_TO_AVG: 'aboveEqualToAvg',
  BELOW_AVG: 'belowAvg',
}

export const compareByKeys = {
  SCHOOL: 'school',
  TEACHER: 'teacher',
  CLASS: 'class',
  STUDENT: 'student',
  RACE: 'race',
  GENDER: 'gender',
  FRL_STATUS: 'frlStatus',
  ELL_STATUS: 'ellStatus',
  IEP_STATUS: 'iepStatus',
  HISPANIC_ETHNICITY: 'hispanicEthnicity',
}

// const compareByFieldKeys = {
//   [compareByKeys.SCHOOL]: 'schoolId',
//   [compareByKeys.TEACHER]: 'teacherId',
//   [compareByKeys.CLASS]: 'groupId',
//   [compareByKeys.STUDENT]: 'studentId',
//   [compareByKeys.RACE]: compareByKeys.RACE,
//   [compareByKeys.GENDER]: compareByKeys.GENDER,
//   [compareByKeys.FRL_STATUS]: compareByKeys.FRL_STATUS,
//   [compareByKeys.ELL_STATUS]: compareByKeys.ELL_STATUS,
//   [compareByKeys.IEP_STATUS]: compareByKeys.IEP_STATUS,
//   [compareByKeys.HISPANIC_ETHNICITY]: compareByKeys.HISPANIC_ETHNICITY,
// }

// const compareBylabels = {
//   [compareByKeys.SCHOOL]: 'schoolName',
//   [compareByKeys.TEACHER]: 'teacherName',
//   [compareByKeys.CLASS]: 'groupName',
//   [compareByKeys.RACE]: compareByKeys.RACE,
//   [compareByKeys.GENDER]: compareByKeys.GENDER,
//   [compareByKeys.FRL_STATUS]: compareByKeys.FRL_STATUS,
//   [compareByKeys.ELL_STATUS]: compareByKeys.ELL_STATUS,
//   [compareByKeys.IEP_STATUS]: compareByKeys.IEP_STATUS,
//   [compareByKeys.HISPANIC_ETHNICITY]: compareByKeys.HISPANIC_ETHNICITY,
// }

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
  PERFORMANCE_BAND: 'academicPerformanceBand',
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
      title: 'Period',
    },
  },
  tagTypes: [
    { key: 'termId', tabKey: '0' },
    { key: 'testGrades', subType: 'test', tabKey: '0' },
    { key: 'testSubjects', subType: 'test', tabKey: '0' },
    // { key: 'tagIds', tabKey: '0' },
    { key: 'assessmentTypes', tabKey: '0' },
    // { key: 'testIds', tabKey: '0' },
    { key: 'schoolIds', tabKey: '1' },
    { key: 'teacherIds', tabKey: '1' },
    { key: 'grades', subType: 'class', tabKey: '1' },
    { key: 'subjects', subType: 'class', tabKey: '1' },
    // { key: 'assignedBy', tabKey: '1' },
    { key: 'courseId', tabKey: '1' },
    { key: 'classIds', tabKey: '1' },
    { key: 'groupIds', tabKey: '1' },
    // { key: 'profileId', tabKey: '2' },
    { key: 'race', tabKey: '2' },
    { key: 'gender', tabKey: '2' },
    { key: 'iepStatus', tabKey: '2' },
    { key: 'frlStatus', tabKey: '2' },
    { key: 'ellStatus', tabKey: '2' },
    { key: 'hispanicEthnicity', tabKey: '2' },
    { key: 'period', tabKey: '3' },
    { key: 'customPeriodStartTime', tabKey: '3' },
    { key: 'customPeriodEndTime', tabKey: '3' },
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
    assignedBy: 'anyone',
    race: 'all',
    gender: 'all',
    iepStatus: 'all',
    frlStatus: 'all',
    ellStatus: 'all',
    hispanicEthnicity: 'all',
    period: PERIODS.TILL_DATE,
    customPeriodStartTime: undefined,
    customPeriodEndTime: undefined,
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
    profileId: '',
    race: 'all',
    gender: 'all',
    iepStatus: 'all',
    frlStatus: 'all',
    ellStatus: 'all',
    hispanicEthnicity: 'all',
  },
  subjects: [
    { key: 'Mathematics', title: 'Mathematics' },
    { key: 'ELA', title: 'ELA' },
    { key: 'Science', title: 'Science' },
    { key: 'Social Studies', title: 'Social Studies' },
    { key: 'Computer Science', title: 'Computer Science' },
    { key: 'Other Subjects', title: 'Other Subjects' },
  ],
  grades: [
    { key: 'TK', title: 'PreKindergarten' },
    { key: 'K', title: 'Kindergarten' },
    { key: '1', title: 'Grade 1' },
    { key: '2', title: 'Grade 2' },
    { key: '3', title: 'Grade 3' },
    { key: '4', title: 'Grade 4' },
    { key: '5', title: 'Grade 5' },
    { key: '6', title: 'Grade 6' },
    { key: '7', title: 'Grade 7' },
    { key: '8', title: 'Grade 8' },
    { key: '9', title: 'Grade 9' },
    { key: '10', title: 'Grade 10' },
    { key: '11', title: 'Grade 11' },
    { key: '12', title: 'Grade 12' },
    { key: 'O', title: 'Other' },
  ],
  assignedBy: [
    { key: 'anyone', title: 'Anyone' },
    { key: 'me', title: 'Me' },
  ],
  periods: [
    {
      key: PERIODS.TILL_DATE,
      title: 'Till Date',
    },
    {
      key: PERIODS.THIS_MONTH,
      title: 'This Month',
    },
    {
      key: PERIODS.THIS_QUARTER,
      title: 'This Quarter',
    },
    {
      key: PERIODS.LAST_MONTH,
      title: 'Last Month',
    },
    {
      key: PERIODS.LAST_QUARTER,
      title: 'Last Quarter',
    },
    {
      key: PERIODS.CUSTOM,
      title: 'Custom',
    },
  ],
}
