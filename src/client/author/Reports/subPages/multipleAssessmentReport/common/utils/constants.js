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
  { key: compareByKeys.STUDENT, title: 'Student' },
  { key: compareByKeys.RACE, title: 'Race' },
  { key: compareByKeys.GENDER, title: 'Gender' },
  { key: compareByKeys.FRL_STATUS, title: 'FRL Status' },
  { key: compareByKeys.ELL_STATUS, title: 'ELL Status' },
  { key: compareByKeys.IEP_STATUS, title: 'IEP Status' },
  { key: compareByKeys.HISPANIC_ETHNICITY, title: 'Hispanic Ethnicity' },
]

// completion Chart Constants
export const completionReportPageSize = 2
export const xAxisDataKey = 'testName'
export const yDomain = [0, 100]
export const yAxisLabel = 'DISTRIBUTION OF STUDENTS (%)'
export const barDataForCompletionChart = [
  {
    key: 'absentPercentage',
    insideLabelKey: 'absent',
    name: 'Absent',
    fill: '#9e9e9e',
    position: 'insideTop',
    stackId: 'completionReport',
  },
  {
    key: 'notStartedPercentage',
    insideLabelKey: 'notStarted',
    position: 'insideTop',
    name: 'Not Started',
    stackId: 'completionReport',
    fill: '#f44336',
  },
  {
    key: 'inProgressPercentage',
    insideLabelKey: 'inProgress',
    position: 'insideTop',
    name: 'In Progress',
    stackId: 'completionReport',
    fill: '#ffc107',
  },
  {
    key: 'submittedPercentage',
    insideLabelKey: 'submitted',
    position: 'insideTop',
    name: 'Submitted',
    stackId: 'completionReport',
    fill: '#2196f3',
  },
  {
    key: 'gradedPercentage',
    insideLabelKey: 'graded',
    position: 'insideTop',
    name: 'Graded',
    stackId: 'completionReport',
    fill: '#4caf50',
  },
]

export const referenceLinesForCompletionChart = [
  {
    ref: 0,
    stroke: 'black',
    position: 'insideLeft',
    textAnchor: 'end',
    dx: -50,
  },
  {
    ref: 25,
    stroke: '#D3D3D3',
    position: 'insideLeft',
    textAnchor: 'end',
    dx: -50,
  },
  {
    ref: 50,
    stroke: '#D3D3D3',
    position: 'insideLeft',
    textAnchor: 'end',
    dx: -50,
  },
  {
    ref: 75,
    stroke: '#D3D3D3',
    position: 'insideLeft',
    textAnchor: 'end',
    dx: -50,
  },
  {
    ref: 100,
    stroke: '#D3D3D3',
    position: 'insideLeft',
    textAnchor: 'end',
    dx: -50,
  },
]
