import { keyBy } from 'lodash'

export const trendTypes = {
  up: {
    color: '#99cb76',
    rotation: 45,
  },
  flat: {
    color: '#ffe6c0',
    rotation: 90,
  },
  down: {
    color: '#eb7b65',
    rotation: 135,
  },
}

export const reportLinkColor = 'rgba(0, 0, 0, 0.65)'

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

export const compareByOptions = [
  { key: compareByKeys.SCHOOL, title: 'School' },
  { key: compareByKeys.TEACHER, title: 'Teacher' },
  { key: compareByKeys.CLASS, title: 'Class' },
  { key: compareByKeys.GROUP, title: 'Student Group' },
  { key: compareByKeys.RACE, title: 'Race' },
  { key: compareByKeys.GENDER, title: 'Gender' },
  { key: compareByKeys.FRL_STATUS, title: 'FRL Status' },
  { key: compareByKeys.ELL_STATUS, title: 'ELL Status' },
  { key: compareByKeys.IEP_STATUS, title: 'IEP Status' },
  { key: compareByKeys.HISPANIC_ETHNICITY, title: 'Hispanic Ethnicity' },
]

export const compareByKeysToFilterKeys = {
  [compareByKeys.SCHOOL]: 'schoolIds',
  [compareByKeys.TEACHER]: 'teacherIds',
  [compareByKeys.CLASS]: 'classIds',
  [compareByKeys.GROUP]: 'groupIds',
}

export const compareByOptionsMapByKey = keyBy(compareByOptions, 'key')

// completion Chart Constants
export const completionReportChartPageSize = 10
export const xAxisDataKey = 'testName'
export const yDomain = [0, 100]
export const yAxisLabel = 'DISTRIBUTION OF STUDENTS (%)'
export const preLabelHeading = {
  title: 'Test Completion Analysis',
  description:
    'The report provide real-time insights into student progess, submission status and grading updates for informed decision-making.',
  titleFontSize: '16px',
  descriptionFontSize: '12px',
}
export const barDataForCompletionChart = [
  {
    key: 'notOpenContribution',
    percent: 'notOpenPercentage',
    insideLabelKey: 'notOpen',
    name: 'Not Open',
    fill: '#80A1BE',
    position: 'insideTop',
    stackId: 'completionReport',
  },
  {
    key: 'absentContribution',
    percent: 'absentPercentage',
    insideLabelKey: 'absent',
    name: 'Absent',
    fill: '#E8E8E8',
    position: 'insideTop',
    stackId: 'completionReport',
  },
  {
    key: 'notStartedContribution',
    percent: 'notStartedPercentage',
    insideLabelKey: 'notStarted',
    position: 'insideTop',
    name: 'Not Started',
    stackId: 'completionReport',
    fill: '#F35F5F',
  },
  {
    key: 'inProgressContribution',
    percent: 'inProgressPercentage',
    insideLabelKey: 'inProgress',
    position: 'insideTop',
    name: 'In Progress',
    stackId: 'completionReport',
    fill: '#FDCC3B',
  },
  {
    key: 'submittedContribution',
    percent: 'submittedPercentage',
    insideLabelKey: 'submitted',
    position: 'insideTop',
    name: 'Submitted',
    stackId: 'completionReport',
    fill: '#3896BE',
  },
  {
    key: 'gradedContribution',
    percent: 'gradedPercentage',
    insideLabelKey: 'graded',
    position: 'insideTop',
    name: 'Graded',
    stackId: 'completionReport',
    fill: '#5EB500',
  },
]

export const referenceLinesForCompletionChart = [
  {
    ref: 0,
    dx: -10,
    stroke: '#D3D3D3',
  },
  {
    ref: 100,
    dx: -10,
    stroke: '#D3D3D3',
  },
]
export const analyzeBy = [
  { key: 'number', title: 'Number' },
  { key: 'percentage', title: 'Percentage(%)' },
]

export const sortKey = {
  NOT_STARTED: 'notStarted',
  ASSIGNED: 'assigned',
  ABSENT: 'absent',
  NOT_OPEN: 'notOpen',
  IN_PROGRESS: 'inProgress',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
}
export const statusMap = {
  [sortKey.NOT_STARTED]: 'not_started',
  [sortKey.ASSIGNED]: 'assigned',
  [sortKey.ABSENT]: 'absent',
  [sortKey.IN_PROGRESS]: 'in_progress',
  [sortKey.SUBMITTED]: 'submitted',
  [sortKey.GRADED]: 'graded',
  [sortKey.NOT_OPEN]: 'not_open',
}

export const utastatus = {
  IN_PROGRESS: '0',
  SUBMITTED: '1',
  ABSENT: '2',
  NOT_STARTED: '3',
  GRADED: '4',
  NOT_OPEN: '5',
}
