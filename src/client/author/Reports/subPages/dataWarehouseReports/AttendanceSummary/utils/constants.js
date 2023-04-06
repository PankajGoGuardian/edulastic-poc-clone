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
  TARDIES: 'tardies',
}

export const pageSize = 200

export const sheetSize = 8

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

export const filterKeys = {
  ATTENDANCE_BAND: 'profileId',
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
