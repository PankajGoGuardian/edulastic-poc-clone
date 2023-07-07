import React from 'react'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import { Row, Col } from 'antd'
import styled from 'styled-components'
import { reportUtils } from '@edulastic/constants'
import { StyledCustomChartTooltip } from '../../../AssessmentSummary/components/styled'

const { getThresholdFromBandName } = reportUtils.performanceByStudents

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  innerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {Math.round(percent * 100) ? `${Math.round(percent * 100)}%` : ''}
    </text>
  )
}

const getTooltipJSX = (payload) => {
  if (payload && payload.length) {
    const { name, value, payload: item } = payload[0]
    return (
      <div>
        <Row type="flex" justify="start">
          <Col className="tooltip-key">{name} : </Col>
          <Col className="tooltip-value">
            {`${((value / item.sum) * 100).toFixed(0)}%`}
          </Col>
        </Row>
      </div>
    )
  }
  return false
}

const StudentPerformancePie = ({ data, bands, onSelect }) => {
  if (!bands) {
    return null
  }

  const handleOnSelect = ({ name }) => {
    const selected = {
      key: name,
      title: name,
      threshold: getThresholdFromBandName(bands, name),
    }
    onSelect(selected)
  }

  return (
    <StyledChartWrapper>
      <PieChart width={400} height={400}>
        <Tooltip
          cursor={false}
          content={<StyledCustomChartTooltip getJSX={getTooltipJSX} />}
        />
        <Pie
          name="name"
          data={data}
          cx={200}
          cy={200}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          onClick={handleOnSelect}
          isAnimationActive={false}
          isUpdateAnimationActive
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
      <StyledChartInfo>
        {bands.map((band, index) => (
          <StyledChartInfoItem>
            <Bar key={index} fill={band.color} />
            <span>{band.name}</span>
          </StyledChartInfoItem>
        ))}
      </StyledChartInfo>
    </StyledChartWrapper>
  )
}

const StyledChartInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const Bar = styled.div`
  width: 30px;
  height: 30px;
  background: ${({ fill }) => fill};
`

const StyledChartInfoItem = styled.div`
  display: flex;
  align-items: center;
  margin: 2px 0px;
  span {
    margin-left: 3px;
  }
`

const StyledChartWrapper = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default StudentPerformancePie
