import { white } from '@edulastic/colors'
import { EduIf, SpinLoader } from '@edulastic/common'
import { Col } from 'antd'
import React from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import styled from 'styled-components'

const greyThemeDark7 = '#ADADAD'

const getAcademicSummaryChartLabelJSX = (props) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, outerRadius, value, color, textColor } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 4) * cos
  const sy = cy + (outerRadius + 4) * sin
  const circleX = cx + outerRadius * cos
  const circleY = cy + outerRadius * sin
  const mx = cx + (outerRadius + 20) * cos
  const my = cy + (outerRadius + 20) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 40
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'
  const textX1 = mx + (cos >= 0 ? 1 : -1) * 21
  const textY = my - 5
  const labelWidth = 30
  const labelHeight = 15
  const rectx = cos >= 0 ? ex - labelWidth + 5 : ex - 5
  const recty = ey - labelHeight - 2
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
      <rect
        x={rectx}
        y={recty}
        width={labelWidth}
        height={labelHeight}
        fill={color}
        rx="5px"
      />
      <text
        className="label-text"
        x={textX1}
        y={textY}
        textAnchor={textAnchor}
        fill={textColor}
        fontWeight="bold"
        fontSize="10px"
      >
        {value}%
      </text>
    </g>
  )
}

const AttendanceDistribution = ({ data, loading }) => {
  return (
    <Col span={10}>
      <PieWrapper>
        <Title>Attendance Distribution</Title>
        <EduIf condition={loading}>
          <SpinLoader />
        </EduIf>
        <EduIf condition={!loading}>
          <PieChart width={400} height={280}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
              label={getAcademicSummaryChartLabelJSX}
            >
              {data.map((entry) => (
                <Cell key={`cell-${entry.id}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          <LegendWrap>
            {data.map((entry) => {
              return (
                <CustomLegend>
                  <LegendSymbol color={entry.color} />
                  <LegendName>{entry.name}</LegendName>
                </CustomLegend>
              )
            })}
          </LegendWrap>
        </EduIf>
      </PieWrapper>
    </Col>
  )
}

export default React.memo(AttendanceDistribution)

export const Title = styled.div`
  font-size: 16px;
  color: #434b5d;
  width: 100%;
  font-weight: bold;
  margin-bottom: 15px;
  display: flex;
  justify-content: flex-start;
`
export const PieWrapper = styled.div`
  border: 1px solid #dedede;
  align-items: center;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  height: 386px;
  border-radius: 10px;
  padding: 24px;
`

export const LegendWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: column;
  margin-top: 15px;
`

export const CustomLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-right: 10px;
`

export const LegendSymbol = styled.span`
  width: 10px;
  height: 10px;
  background: ${(props) => props.color};
  display: flex;
  border-radius: 50%;
  margin-right: 10px;
`

export const LegendName = styled.span`
  font-size: 11px;
  color: #4b4b4b;
`
