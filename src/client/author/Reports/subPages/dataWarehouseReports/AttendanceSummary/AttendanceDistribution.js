import { greyThemeDark7, white } from '@edulastic/colors'
import { EduIf, SpinLoader } from '@edulastic/common'
import { Col, Tooltip } from 'antd'
import { round } from 'lodash'
import React from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import styled from 'styled-components'
import { useResetAnimation } from '../../../common/hooks/useResetAnimation'
import { sortDistributionBand } from '../common/utils'

const DEG_HALF_CIRCLE = 180
const getAcademicSummaryChartLabelJSX = (props) => {
  const RADIAN = Math.PI / DEG_HALF_CIRCLE
  const { y, cx, cy, midAngle, outerRadius, value, name, color } = props
  const isLabelOverFlowing = y < 32
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 2) * cos
  const sy = cy + (outerRadius + 2) * sin
  const circleX = cx + outerRadius * cos
  const circleY = cy + outerRadius * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 50
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'
  const textX = mx + (cos >= 0 ? 1 : -1) * 12
  const textY = isLabelOverFlowing ? my + 16 : my - 6
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
      <Tooltip title={`${name} : ${round(value)}%`}>
        <text
          className="label-text"
          x={textX}
          y={textY}
          textAnchor={textAnchor}
          fill={color}
          opacity={0.75}
          fontWeight="bold"
          fontSize="14px"
        >
          <tspan className="label-value"> {round(value)}%</tspan>
        </text>
      </Tooltip>
    </g>
  )
}

const AttendanceDistribution = ({ data, loading }) => {
  const sortedLegendsData = sortDistributionBand(data)
  const [animate, onAnimationStart] = useResetAnimation()
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
              isAnimationActive={animate}
              onAnimationStart={onAnimationStart}
              data={sortedLegendsData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
              label={getAcademicSummaryChartLabelJSX}
              style={{ filter: 'drop-shadow(10px 10px 12px #00000030)' }}
            >
              {sortedLegendsData.map((entry) => (
                <Cell key={`cell-${entry.id}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          <LegendWrap>
            {sortedLegendsData.map((entry) => {
              return (
                <CustomLegend key={`legend-${entry.name}`}>
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
  width: 12px;
  height: 12px;
  background: ${(props) => props.color};
  display: flex;
  border-radius: 50%;
  margin-right: 10px;
`

export const LegendName = styled.span`
  font-size: 12px;
  color: #4b4b4b;
`
