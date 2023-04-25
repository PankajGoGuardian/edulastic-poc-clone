import {
  GRADE_OPTIONS,
  PERIOD_NAMES,
  PERIOD_TYPES,
  SUBJECT_OPTIONS,
  RISK_TYPE_OPTIONS,
  RISK_TYPE_KEYS,
} from '@edulastic/constants/reportUtils/common'

export const CHART_LABEL_KEY = 'chartTimeLabel'

export const tableColumnKeys = {
  DIMENSION: 'dimension',
  HIGH_RISK: 'highRisk',
  MEDIUM_RISK: 'mediumRisk',
  ACADEMIC_RISK: 'academicRisk',
  ATTENDANCE_RISK: 'attendanceRisk',
  OVERALL_RISK: 'overallRisk',
}

/** @type {import('antd/lib/table').ColumnProps[]} */
export const tableColumnsData = [
  {
    key: tableColumnKeys.DIMENSION,
    dataIndex: 'dimension',
    align: 'left',
    fixed: 'left',
    width: 200,
    className: 'dimension',
  },
  {
    key: tableColumnKeys.HIGH_RISK,
    dataIndex: 'highRisk',
    align: 'center',
    width: 300,
    className: 'risk',
  },
  {
    key: tableColumnKeys.MEDIUM_RISK,
    dataIndex: 'mediumRisk',
    align: 'center',
    width: 300,
    className: 'risk',
  },
  {
    key: tableColumnKeys.ACADEMIC_RISK,
    dataIndex: 'distribution',
    title: 'ACADEMIC RISK',
    align: 'center',
    className: 'risk-distribution',
  },
  {
    key: tableColumnKeys.ATTENDANCE_RISK,
    dataIndex: 'distribution',
    title: 'ATTENDANCE RISK',
    align: 'center',
    className: 'risk-distribution',
  },
]

export const tableFilterTypes = {
  COMPARE_BY: 'compareBy',
  PAGE: 'page',
  PAGE_SIZE: 'pageSize',
}

export const timeframeFilterKeys = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
}

export const timeframeFilterValues = {
  [timeframeFilterKeys.MONTHLY]: 'month',
  [timeframeFilterKeys.QUARTERLY]: 'quarter',
}

export const TABLE_PAGE_SIZE = 25

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
    riskType: RISK_TYPE_KEYS.OVERALL,
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
  riskTypes: RISK_TYPE_OPTIONS,
  periodTypes: Object.entries(PERIOD_NAMES).map(([key, title]) => ({
    key,
    title,
  })),
}
