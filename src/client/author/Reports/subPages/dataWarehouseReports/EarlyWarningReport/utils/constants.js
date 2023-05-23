import React from 'react'
import { lightRed7, darkRed3 } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'
import { ColoredText } from '../components/common/styledComponents'

const {
  GRADE_OPTIONS,
  PERIOD_NAMES,
  PERIOD_TYPES,
  SUBJECT_OPTIONS,
  RISK_TYPE_OPTIONS,
  RISK_TYPE_KEYS,
  RISK_BAND_LEVELS,
  RISK_BAND_COLOR_INFO,
} = reportUtils.common

export const CHART_LABEL_KEY = 'chartTimeLabel'

export const tableColumnKeys = {
  DIMENSION: 'dimension',
  HIGH_RISK: 'highRisk',
  MEDIUM_RISK: 'mediumRisk',
  ACADEMIC_RISK: 'academicRisk',
  ATTENDANCE_RISK: 'attendanceRisk',
  OVERALL_RISK: 'overallRisk',
  SCHOOL: 'school',
  GRADE: 'grade',
  RISK: 'risk',
  MEASURES: 'measures',
  AVERAGE: 'average',
  AVG_ACADEMIC: 'avgAcademic',
  AVG_ATTENDANCE: 'avgAttendance',
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
    align: 'left',
    className: 'risk-distribution',
  },
  {
    key: tableColumnKeys.ATTENDANCE_RISK,
    dataIndex: 'distribution',
    title: 'ATTENDANCE RISK',
    align: 'left',
    className: 'risk-distribution',
  },
]

export const compareByStudentColumns = [
  {
    key: tableColumnKeys.DIMENSION,
    dataIndex: 'dimension',
    align: 'left',
    fixed: 'left',
    width: 280,
    className: 'dimension',
  },
  {
    key: tableColumnKeys.SCHOOL,
    title: 'SCHOOLS',
    dataIndex: 'schools',
    align: 'center',
    width: 250,
    className: 'school',
  },
  {
    key: tableColumnKeys.GRADE,
    title: 'GRADE',
    dataIndex: 'grades',
    align: 'center',
    className: 'grade',
  },
  {
    key: tableColumnKeys.RISK,
    title: 'RISK',
    dataIndex: 'risk',
    align: 'center',
    width: 200,
    className: 'risk-name',
  },
  {
    title: 'NUMBER OF MEASURES AT:',
    align: 'left',
    className: 'nested',
    children: [
      {
        key: tableColumnKeys.HIGH_RISK,
        title: 'HIGH RISK',
        dataIndex: 'highRiskMeasures',
        align: 'center',
        render: (value) => {
          const color =
            value > 0 ? RISK_BAND_COLOR_INFO[RISK_BAND_LEVELS.HIGH] : ''
          return <ColoredText color={color}>{value}</ColoredText>
        },
      },
      {
        key: tableColumnKeys.MEDIUM_RISK,
        title: 'MEDIUM RISK',
        dataIndex: 'mediumRiskMeasures',
        align: 'center',
        render: (value) => {
          const color =
            value > 0 ? RISK_BAND_COLOR_INFO[RISK_BAND_LEVELS.MEDIUM] : ''
          return <ColoredText color={color}>{value}</ColoredText>
        },
      },
    ],
  },
  {
    key: tableColumnKeys.AVG_ATTENDANCE,
    title: 'ATTENDENCE',
    dataIndex: 'attendanceRisk',
    render: (value) => (
      <ColoredText color={RISK_BAND_COLOR_INFO[value?.risk] || ''}>
        {value?.attendancePercentage >= 0
          ? `${value.attendancePercentage}%`
          : '-'}
      </ColoredText>
    ),
  },
]

export const tableFilterTypes = {
  COMPARE_BY: 'compareBy',
  RISK: 'riskFilter',
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

export const riskCheckBoxDropdownOptions = Object.keys(RISK_BAND_LEVELS).map(
  (key) => {
    const level = RISK_BAND_LEVELS[key]
    return { level, color: RISK_BAND_COLOR_INFO[level] }
  }
)

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

export const RISK_KEYS = {
  MEDIUM: 'medium',
  HIGH: 'high',
  LOW: 'low',
}

// Lines z-index on the chart is directly proportional to line index in below array
export const CHART_LINES = [
  {
    dataKey: RISK_KEYS.MEDIUM,
    stroke: darkRed3,
  },
  {
    dataKey: RISK_KEYS.HIGH,
    stroke: lightRed7,
  },
]
