import React, { useMemo } from 'react'
import moment from 'moment'

import { Row, Col } from 'antd'
import { themeColor, lightGreen8 } from '@edulastic/colors'
import SimpleAreaChart from '../../../../common/components/charts/simpleAreaChart'

const MONTHS_ARR = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const MONTHS_OBJ = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
}

const SimpleAreaWithLineChartContainer = ({ data }) => {
  let maxTestCount = 0
  let maxStudentCount = 0

  // filter items with invalid date and curate chartData
  const chartData = useMemo(
    () =>
      data
        .filter((item) => item.assessmentDate)
        .map((item) => {
          return {
            ...item,
            date: moment(item.assessmentDate).format("MMM'YY"),
            month: moment(item.assessmentDate).format('MMMM'),
            year: Number(moment(item.assessmentDate).format('YY')),
          }
        }),
    [data]
  )

  // calculate max test count & max student count
  chartData.forEach((item) => {
    maxTestCount = Math.max(maxTestCount, Number(item.testCount))
    maxStudentCount = Math.max(maxStudentCount, Number(item.studentCount))
  })

  // augment chart data with missing months
  const getAugmentedChartData = () => {
    const augmented = [chartData[0]]
    let currMonthPos =
      MONTHS_OBJ[chartData[0].month] === 12
        ? 1
        : MONTHS_OBJ[chartData[0].month] + 1
    let currYear =
      MONTHS_OBJ[chartData[0].month] === 12
        ? chartData[0].year + 1
        : chartData[0].year
    for (let i = 1; i < chartData.length; i++) {
      const nextMonthPos = MONTHS_OBJ[chartData[i].month]
      const nextYear = chartData[i].year
      while (currMonthPos !== nextMonthPos || currYear !== nextYear) {
        const currMonth = MONTHS_ARR[currMonthPos]
        augmented.push({
          month: currMonth,
          year: currYear,
          date: `${currMonth.substring(0, 3)}'${currYear}`,
          testCount: 0,
          studentCount: 0,
        })
        currYear = currMonthPos === 12 ? currYear + 1 : currYear
        currMonthPos = currMonthPos === 12 ? 1 : currMonthPos + 1
      }
      augmented.push(chartData[i])
      currYear = currMonthPos === 12 ? currYear + 1 : currYear
      currMonthPos = currMonthPos === 12 ? 1 : currMonthPos + 1
    }
    return augmented
  }

  const augmentedChartData = getAugmentedChartData()

  const getTooltipJSX = (payload) => {
    if (payload && payload[0]?.payload) {
      const { date, testCount, studentCount } = payload[0].payload
      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Date (Month): </Col>
            <Col className="tooltip-value">{date}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Assessments Assigned: </Col>
            <Col className="tooltip-value">{testCount}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Students taking Assessment: </Col>
            <Col className="tooltip-value">{studentCount}</Col>
          </Row>
        </div>
      )
    }
    return false
  }

  const getChartSpecifics = () => {
    // tickStep should be greater than equal to 1
    const tickStep = Math.ceil(maxTestCount / 10) || 1
    const lineTickStep = Math.ceil(maxStudentCount / 10) || 1
    const ticksArr = []
    const lineTicksArr = []
    // generate 10 ticks for each y-axis
    let pos = 0
    while (
      (pos - 1) * tickStep < maxTestCount ||
      (pos - 1) * lineTickStep < maxStudentCount
    ) {
      ticksArr.push(pos * tickStep)
      lineTicksArr.push(pos * lineTickStep)
      pos += 1
    }
    return {
      yDomain: [0, (pos + 1) * tickStep],
      ticks: [...ticksArr, pos * tickStep],
      lineYDomain: [0, (pos + 1) * lineTickStep],
      lineTicks: [...lineTicksArr, pos * lineTickStep],
      formatter: (val) => val,
    }
  }

  const chartSpecifics = getChartSpecifics()

  return (
    <SimpleAreaChart
      margin={{ top: 0, right: 60, left: 60, bottom: 0 }}
      data={augmentedChartData}
      pageSize={12}
      getTooltipJSX={getTooltipJSX}
      xAxisDataKey="date"
      xTickFormatter={chartSpecifics.formatter}
      chartDataKey="testCount"
      yAxisLabel="Assessments Assigned"
      yTickFormatter={chartSpecifics.formatter}
      yDomain={chartSpecifics.yDomain}
      ticks={chartSpecifics.ticks}
      areaProps={{ stroke: lightGreen8, strokeWidth: 3, fill: lightGreen8 }}
      areaDotProps={{ stroke: lightGreen8, fill: lightGreen8, r: 2 }}
      areaActiveDotProps={{ strokeWidth: 3, r: 5 }}
      lineChartDataKey="studentCount"
      lineYAxisLabel="Students taking Assessment"
      lineYTickFormatter={chartSpecifics.formatter}
      lineYDomain={chartSpecifics.lineYDomain}
      lineTicks={chartSpecifics.lineTicks}
      lineProps={{ stroke: themeColor, strokeWidth: 3 }}
      lineDotProps={{ stroke: themeColor, strokeWidth: 2, r: 4 }}
      lineActiveDotProps={{ stroke: '#ffffff', strokeWidth: 3, r: 5 }}
      isLeftPaginated
    />
  )
}

export default SimpleAreaWithLineChartContainer
