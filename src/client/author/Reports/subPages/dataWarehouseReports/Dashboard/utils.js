import React from 'react'
import { greyThemeDark7, lightGrey17, white } from '@edulastic/colors'
import { getProficiencyBand } from '@edulastic/constants/reportUtils/common'

export const bandInfo = [
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

export const selectedTestType = 'Edulastic'

export const PieChartData = [
  {
    fill: '#60B14F',
    value: 35,
    name: 'Proficient',
  },
  {
    fill: '#EBDD54',
    value: 45,
    name: 'Basic',
  },
  {
    fill: '#EF9202',
    value: 20,
    name: 'Below Basic',
  },
]

export const cellStyles = {
  large: { padding: '18px 30px', font: '24px' },
  medium: { padding: '10px 15px', font: '18px' },
  small: { padding: '12px 17px', font: '14px' },
}

export const getCellColor = (value, selectedPerformanceBand) => {
  const band = getProficiencyBand(value, selectedPerformanceBand)
  return band.color
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
  const ex = mx + (cos >= 0 ? 1 : -1) * 130
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'
  const textX1 = mx + (cos >= 0 ? 1 : -1) * 10
  const textX2 = textX1 + (cos >= 0 ? 1 : -1) * 30
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
        x={textX1}
        y={textY}
        textAnchor={textAnchor}
        fill={lightGrey17}
        fontWeight="bold"
      >
        {value}%
      </text>
      <text
        className="label-text"
        x={textX2}
        y={textY}
        textAnchor={textAnchor}
        fill={lightGrey17}
        fontWeight="normal"
      >
        &nbsp;&nbsp;{name}
      </text>
    </g>
  )
}
