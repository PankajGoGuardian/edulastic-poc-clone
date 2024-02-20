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
  title: 'Completion report by School',
  description:
    'The report provide real-time insights into student progess, submission status and grading updates for informed decision-making',
  titleFontSize: '16px',
  descriptionFontSize: '12px',
}
export const barDataForCompletionChart = [
  {
    key: 'absentPercentage',
    insideLabelKey: 'absent',
    name: 'Absent',
    fill: '#C4C4C4',
    position: 'insideTop',
    stackId: 'completionReport',
  },
  {
    key: 'notStartedPercentage',
    insideLabelKey: 'notStarted',
    position: 'insideTop',
    name: 'Not Started',
    stackId: 'completionReport',
    fill: '#FF0257',
  },
  {
    key: 'inProgressPercentage',
    insideLabelKey: 'inProgress',
    position: 'insideTop',
    name: 'In Progress',
    stackId: 'completionReport',
    fill: '#FEBE00',
  },
  {
    key: 'submittedPercentage',
    insideLabelKey: 'submitted',
    position: 'insideTop',
    name: 'Submitted',
    stackId: 'completionReport',
    fill: '#3896BE',
  },
  {
    key: 'gradedPercentage',
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
    ref: 10,
    dx: -10,
    stroke: '#D3D3D3',
  },
  {
    ref: 20,
    dx: -10,
    stroke: '#D3D3D3',
  },
  {
    ref: 30,
    dx: -10,
    stroke: '#D3D3D3',
  },
  {
    ref: 40,
    dx: -10,
    stroke: '#D3D3D3',
  },
  {
    ref: 50,
    dx: -10,
    stroke: '#D3D3D3',
  },
  {
    ref: 60,
    dx: -10,
    stroke: '#D3D3D3',
  },
  {
    ref: 70,
    dx: -10,
    stroke: '#D3D3D3',
  },
  {
    ref: 80,
    dx: -10,
    stroke: '#D3D3D3',
  },
  {
    ref: 90,
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
}

export const utastatus = {
  IN_PROGRESS: '0',
  SUBMITTED: '1',
  ABSENT: '2',
  NOT_STARTED: '3',
  GRADED: '4',
}
