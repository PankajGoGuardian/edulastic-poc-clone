import React from 'react'
import { greyThemeDark7, lightGrey17, white } from '@edulastic/colors'
import { getProficiencyBand } from '@edulastic/constants/reportUtils/common'

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
    key: 'Edulastic',
    title: 'Edulastic',
  },
  {
    key: 'CAASPP',
    title: 'CAASPP',
  },
  {
    key: 'NWEA',
    title: 'NWEA',
  },
  {
    key: 'iReady_ELA',
    title: 'iReady (ELA)',
  },
  {
    key: 'iReady_Math',
    title: 'iReady (MATH)',
  },
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

export const tableData = [
  {
    compareBy: 'El Dorado Adventist School dakfdak dak',
    avgAttendance: 75,
    avgScorePercentage: 75,
    performanceDistribution: [
      { value: 36, color: '#5FAD5A' },
      { value: 10, color: '#90DE85' },
      { value: 40, color: '#E9DC6B' },
      { value: 10, color: '#E69736' },
      { value: 4, color: '#E55C5C' },
    ],
  },
  {
    compareBy: 'St. James',
    avgAttendance: 75,
    avgScorePercentage: 75,
    performanceDistribution: [
      { value: 36, color: '#5FAD5A' },
      { value: 10, color: '#90DE85' },
      { value: 40, color: '#E9DC6B' },
      { value: 10, color: '#E69736' },
      { value: 4, color: '#E55C5C' },
    ],
  },
]

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

export const getCellColor = (value, selectedPerformanceBand) => {
  const band = getProficiencyBand(value, selectedPerformanceBand)
  return band.color
}

export const getAcademicSummaryPieChartData = (
  bandDistribution,
  selectedPerformanceBand
) => {
  return selectedPerformanceBand.map((pb) => {
    const totalStudents = bandDistribution.find(
      (bd) => bd.bandScore === pb.threshold
    )?.students
    return {
      name: pb.name,
      value: totalStudents,
      fill: pb.color,
    }
  })
}

export const getAcademicSummaryChartLabelJSX = (props) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, outerRadius, name, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 4) * cos
  const sy = cy + (outerRadius + 4) * sin
  const circleX = cx + outerRadius * cos
  const circleY = cy + outerRadius * sin
  const mx = cx + (outerRadius + 20) * cos
  const my = cy + (outerRadius + 20) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * name.length * 15
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'
  const textX = mx + (cos >= 0 ? 1 : -1) * 10
  const textY = my - 5
  return (
    <g>
      <circle
        cx={circleX}
        cy={circleY}
        r={4}
        fill={white}
        stroke={greyThemeDark7}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={greyThemeDark7}
        fill="none"
        strokeWidth={1}
      />
      <text
        className="label-text"
        x={textX}
        y={textY}
        textAnchor={textAnchor}
        fill={lightGrey17}
      >
        <tspan className="label-value">{value}%</tspan>
        <tspan className="label-name">&nbsp;&nbsp;{name}</tspan>
      </text>
    </g>
  )
}
