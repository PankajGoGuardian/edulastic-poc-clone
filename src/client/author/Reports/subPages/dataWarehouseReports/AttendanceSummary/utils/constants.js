import {
  GRADE_OPTIONS,
  PERIOD_NAMES,
  PERIOD_TYPES,
  SUBJECT_OPTIONS,
} from '@edulastic/constants/reportUtils/common'
import { capitalize } from 'lodash'
import { allFilterValue } from '../../../../common/constants'

export const sortOrderMap = {
  ascend: 'asc',
  descend: 'desc',
}

export const sortOrders = {
  ASCEND: 'ascend',
  DESCEND: 'descend',
}

export const sortKeys = {
  DIMENSION: 'dimension',
  ATTENDANCE: 'attendance',
  ATTENDANCE_DISRUPTIONS: 'attendanceDisruptions',
  STUDENTS: 'students',
  ATTENDANCE_EVENTS: 'attendanceEvents',
}

export const pageSize = 200

export const sheetSize = 8

export const compareByEnums = {
  CLASS: 'class',
  SCHOOL: 'school',
  TEACHER: 'teacher',
  STUDENT: 'student',
  GROUP: 'group',
  RACE: 'race',
  GENDER: 'gender',
  FRL_STATUS: 'frlStatus',
  ELL_STATUS: 'ellStatus',
  IEP_STATUS: 'iepStatus',
  HISPANIC_ETHNICITY: 'hispanicEthnicity',
}

export const compareByToPluralName = {
  [compareByEnums.SCHOOL]: 'School',
  [compareByEnums.TEACHER]: 'Teacher',
  [compareByEnums.CLASS]: 'Class',
  [compareByEnums.STUDENT]: 'Student',
  [compareByEnums.GROUP]: 'Student Group',
  [compareByEnums.RACE]: 'Race',
  [compareByEnums.GENDER]: 'Gender',
  [compareByEnums.FRL_STATUS]: 'FRL Status',
  [compareByEnums.ELL_STATUS]: 'ELL Status',
  [compareByEnums.IEP_STATUS]: 'IEP Status',
  [compareByEnums.HISPANIC_ETHNICITY]: 'Hispanic Ethnicity',
}

export const compareByOptions = [
  {
    key: compareByEnums.SCHOOL,
    title: compareByToPluralName[compareByEnums.SCHOOL],
    hiddenFromRole: ['teacher'],
  },
  {
    key: compareByEnums.TEACHER,
    title: compareByToPluralName[compareByEnums.TEACHER],
    hiddenFromRole: ['teacher'],
  },
  {
    key: compareByEnums.CLASS,
    title: compareByToPluralName[compareByEnums.CLASS],
  },
  {
    key: compareByEnums.GROUP,
    title: compareByToPluralName[compareByEnums.GROUP],
  },
  {
    key: compareByEnums.STUDENT,
    title: compareByToPluralName[compareByEnums.STUDENT],
  },
  {
    key: compareByEnums.RACE,
    title: compareByToPluralName[compareByEnums.RACE],
  },
  {
    key: compareByEnums.GENDER,
    title: compareByToPluralName[compareByEnums.GENDER],
  },
  {
    key: compareByEnums.FRL_STATUS,
    title: compareByToPluralName[compareByEnums.FRL_STATUS],
  },
  {
    key: compareByEnums.ELL_STATUS,
    title: compareByToPluralName[compareByEnums.ELL_STATUS],
  },
  {
    key: compareByEnums.IEP_STATUS,
    title: compareByToPluralName[compareByEnums.IEP_STATUS],
  },
  {
    key: compareByEnums.HISPANIC_ETHNICITY,
    title: compareByToPluralName[compareByEnums.HISPANIC_ETHNICITY],
  },
]

export const AttendanceSummaryLegends = [
  { name: 'Attendance', color: '#9FC6D2' },
]

export const yAxisTickValues = [0, 20, 40, 60, 80, 100]

export const groupByConstants = {
  WEEK: 'week',
  MONTH: 'month',
}

export const groupByOptions = [groupByConstants.WEEK, groupByConstants.MONTH]

export const filterKeys = {
  ATTENDANCE_BAND: 'profileId',
}

export const staticDropDownData = {
  filterSections: {
    STUDENT_FILTERS: {
      key: '0',
      title: 'Select Student Set',
    },
    DEMOGRAPHIC_FILTERS: {
      key: '1',
      title: 'Demographics',
    },
    PERIOD: {
      key: '2',
      title: 'Duration',
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
    courseId: capitalize(allFilterValue),
    classIds: '',
    groupIds: '',

    race: allFilterValue,
    gender: allFilterValue,
    iepStatus: allFilterValue,
    frlStatus: allFilterValue,
    ellStatus: allFilterValue,
    hispanicEthnicity: allFilterValue,
    customDemographicKey: '',
    customDemographicValue: '',

    periodType: PERIOD_TYPES.TILL_DATE,
    customPeriodStart: undefined,
    customPeriodEnd: undefined,
  },
  subjects: SUBJECT_OPTIONS,
  grades: GRADE_OPTIONS,
  periodTypes: Object.entries(PERIOD_NAMES).map(([key, title]) => ({
    key,
    title,
  })),
}
