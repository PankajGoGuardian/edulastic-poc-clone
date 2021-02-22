import React from 'react'
import { ticks } from 'd3-array'

import { Row, Col } from 'antd'
import { themeColor, lightGreen8 } from '@edulastic/colors'
import { SimpleStackedBarChart } from '../../../../common/components/charts/simpleStackedBarChart'
import { CustomChartCursor } from '../../../../common/components/charts/chartUtils/customChartCursor'

const SimpleStackedBarWithLineChartContainer = ({
  data,
  filter,
  onBarClickCB,
  onResetClickCB,
  activityBy = 'school',
}) => {
  let maxTestCount = 0
  let maxStudentCount = 0
  const chartData = data
    .map((item) => {
      maxTestCount = Math.max(maxTestCount, item.testCount)
      maxStudentCount = Math.max(maxStudentCount, item.studentCount)
      return {
        ...item,
        [`${activityBy}Name`]: item[`${activityBy}Name`] || '-',
        fill:
          Object.keys(filter).length && !filter[item[`${activityBy}Name`]]
            ? '#cccccc'
            : lightGreen8,
      }
    })
    .sort((a, b) => b.testCount - a.testCount)

  const getTooltipJSX = (payload) => {
    if (payload && payload[0]?.payload) {
      const {
        schoolName,
        schoolNames,
        testCount,
        studentCount,
        teacherCount,
      } = payload[0].payload
      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">School: </Col>
            <Col className="tooltip-value">
              {activityBy === 'school' ? schoolName : schoolNames}
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Test Count: </Col>
            <Col className="tooltip-value">{testCount}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Student Count: </Col>
            <Col className="tooltip-value">{studentCount}</Col>
          </Row>
          {activityBy === 'school' && (
            <Row type="flex" justify="start">
              <Col className="tooltip-key">Teacher Count: </Col>
              <Col className="tooltip-value">{teacherCount}</Col>
            </Row>
          )}
        </div>
      )
    }
    return false
  }

  const getChartSpecifics = () => {
    const ticksArr = ticks(0, maxTestCount, 10)
    const maxTickValue = ticksArr[ticksArr.length - 1]
    const tickDiff = ticksArr[1] - ticksArr[0]
    const lineTicksArr = ticks(0, maxStudentCount, 10)
    const maxLineTickValue = lineTicksArr[lineTicksArr.length - 1]
    const lineTickDiff = lineTicksArr[1] - lineTicksArr[0]
    return {
      yDomain: [0, maxTickValue + tickDiff],
      ticks: [...ticksArr, maxTickValue + tickDiff],
      lineYDomain: [0, maxLineTickValue + lineTickDiff],
      lineTicks: [...lineTicksArr, maxLineTickValue + lineTickDiff],
      formatter: (val) => val,
    }
  }

  const chartSpecifics = getChartSpecifics()

  return (
    <SimpleStackedBarChart
      margin={{ top: 0, right: 60, left: 60, bottom: 0 }}
      pageSize={10}
      data={chartData}
      TooltipCursor={CustomChartCursor}
      getTooltipJSX={getTooltipJSX}
      barsLabelFormatter={chartSpecifics.formatter}
      bottomStackDataKey="testCount"
      bottomStackBarProps={{ fill: lightGreen8, radius: [10, 10, 0, 0] }}
      xAxisDataKey={`${activityBy}Name`}
      yAxisLabel="Assessments Assigned"
      yDomain={chartSpecifics.yDomain}
      ticks={chartSpecifics.ticks}
      yTickFormatter={chartSpecifics.formatter}
      filter={filter}
      onBarClickCB={onBarClickCB}
      onResetClickCB={onResetClickCB}
      lineChartDataKey="studentCount"
      lineYAxisLabel="Students taking Assessment"
      lineYTickFormatter={chartSpecifics.formatter}
      lineYDomain={chartSpecifics.lineYDomain}
      lineTicks={chartSpecifics.lineTicks}
      lineProps={{ stroke: themeColor, strokeWidth: 3 }}
      lineDotProps={{ stroke: themeColor, strokeWidth: 2, r: 4 }}
      lineActiveDotProps={{ stroke: '#ffffff', strokeWidth: 3, r: 5 }}
      overflowStyle="visible"
    />
  )
}

export default SimpleStackedBarWithLineChartContainer
