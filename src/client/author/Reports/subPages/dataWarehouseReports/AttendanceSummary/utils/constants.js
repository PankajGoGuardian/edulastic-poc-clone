import {
  PERIOD_NAMES,
  PERIOD_TYPES,
} from '@edulastic/constants/reportUtils/common'

export const sortOrderMap = {
  ascend: 'asc',
  descend: 'desc',
}

export const pageSize = 25

export const compareByEnums = {
  CLASS: 'class',
  SCHOOL: 'school',
  TEACHER: 'teacher',
  STUDENT: 'student',
}

export const compareByToPluralName = {
  school: 'Schools',
  teacher: 'Teachers',
  class: 'Classes',
  student: 'Student',
}

export const compareByOptions = [
  { key: compareByEnums.SCHOOL, title: 'School', hiddenFromRole: ['teacher'] },
  {
    key: compareByEnums.TEACHER,
    title: 'Teacher',
    hiddenFromRole: ['teacher'],
  },
  { key: compareByEnums.CLASS, title: 'Class' },
  { key: compareByEnums.STUDENT, title: 'Student' },
]

export const AttendanceSummaryLegends = [
  { name: 'Attendance', color: '#9FC6D2' },
]

export const yAxisTickValues = [0, 100]

export const groupByConstants = {
  WEEK: 'week',
  MONTH: 'month',
}

export const staticDropDownData = {
  filterSections: {
    CLASS_FILTERS: {
      key: '0',
      title: 'Select Classes',
    },
    DEMOGRAPHIC_FILTERS: {
      key: '1',
      title: 'Demographics',
    },
    PERIOD: {
      key: '2',
      title: 'Period',
    },
  },
  tagTypes: [
    { key: 'termId', tabKey: '0' },
    { key: 'schoolIds', tabKey: '0' },
    { key: 'teacherIds', tabKey: '0' },
    { key: 'grades', subType: 'class', tabKey: '0' },
    { key: 'subjects', subType: 'class', tabKey: '0' },
    { key: 'courseId', tabKey: '0' },
    { key: 'classIds', tabKey: '0' },
    { key: 'groupIds', tabKey: '0' },

    { key: 'race', tabKey: '1' },
    { key: 'gender', tabKey: '1' },
    { key: 'iepStatus', tabKey: '1' },
    { key: 'frlStatus', tabKey: '1' },
    { key: 'ellStatus', tabKey: '1' },
    { key: 'hispanicEthnicity', tabKey: '1' },
    { key: 'customDemographicKey', tabKey: '1' },
    { key: 'customDemographicValue', tabKey: '1' },

    { key: 'periodType', tabKey: '2' },
    { key: 'customPeriodStart', tabKey: '2' },
    { key: 'customPeriodEnd', tabKey: '2' },
  ],
  initialFilters: {
    reportId: '',
    termId: '',
    schoolIds: '',
    teacherIds: '',
    grades: '',
    subjects: '',
    courseId: 'All',
    classIds: '',
    groupIds: '',

    race: 'all',
    gender: 'all',
    iepStatus: 'all',
    frlStatus: 'all',
    ellStatus: 'all',
    hispanicEthnicity: 'all',
    customDemographicKey: '',
    customDemographicValue: '',

    periodType: PERIOD_TYPES.TILL_DATE,
    customPeriodStart: undefined,
    customPeriodEnd: undefined,
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
  periodTypes: Object.entries(PERIOD_NAMES).map(([key, title]) => ({
    key,
    title,
  })),
}
