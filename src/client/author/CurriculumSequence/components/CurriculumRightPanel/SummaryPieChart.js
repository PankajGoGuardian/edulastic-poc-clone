import React, { useState } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import {
  themeColorLighter,
  greyThemeDark1,
  titleColor,
} from '@edulastic/colors'
import { PieChart, Pie, Sector, Cell } from 'recharts'
import {
  StyledProgressDiv,
  StyledProgress,
  GraphDescription,
} from '../../../ClassBoard/components/ProgressGraph/styled'

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    tSpent = 0,
    totalTimeSpent = 0,
    showTotalTime,
  } = props

  const getFormattedTime = (timeInMillis) => {
    const duration = moment.duration(timeInMillis)
    let minutes = duration.minutes()
    const hours = Math.floor(duration.asHours())
    const seconds = duration.seconds()
    // To make it consistent with module level time spent
    if (seconds > 50) {
      minutes += 1
    }
    return [`${hours} hr`, `${minutes} MINS`]
  }

  const formattedTime = showTotalTime
    ? getFormattedTime(totalTimeSpent)
    : getFormattedTime(tSpent)

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={5}
        className="hour-text"
        fontSize="30"
        fontWeight="bold"
        textAnchor="middle"
        color={titleColor}
      >
        {formattedTime[0]}
      </text>
      <text
        x={cx}
        y={cy}
        dy={22}
        fontSize="13"
        textAnchor="middle"
        color={greyThemeDark1}
        className="min-text"
      >
        {formattedTime[1]}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  )
}

const SummaryPieChart = ({ data = [], totalTimeSpent, colors, isStudent }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showTotalTime, setDefaultTimeSpent] = useState(true)

  const onPieEnter = (_data, index) => {
    setDefaultTimeSpent(false)
    setActiveIndex(index)
  }

  let maxSliceIndex = 0
  let chartData = data?.filter(
    (ele) => ele?.tSpent !== 0 && !(ele?.hidden && isStudent)
  )

  // find maxSliceIndex and set value = tSpent
  chartData = chartData?.map((ele, idx) => {
    if (ele.tSpent > chartData[maxSliceIndex].tSpent) {
      maxSliceIndex = idx
    }
    return { ...ele, value: ele?.tSpent }
  })

  return chartData.length ? (
    <ChartContainer data-testid="pie-chart">
      <PieChart width={315} height={250}>
        <Pie
          activeIndex={activeIndex}
          activeShape={(props) =>
            renderActiveShape({ ...props, showTotalTime, totalTimeSpent })
          }
          data={chartData}
          cx={150}
          cy={130}
          innerRadius={60}
          outerRadius={78}
          label={({ name }) => name}
          isAnimationActive={false} // Tradeoff: to show labels -  https://github.com/recharts/recharts/issues/929
          onMouseEnter={onPieEnter}
          onMouseLeave={() => setDefaultTimeSpent(true)}
          showTotalTime={showTotalTime}
        >
          {chartData?.map((m, dataIndex) => (
            <Cell
              fill={
                dataIndex === maxSliceIndex
                  ? themeColorLighter
                  : colors[m.index % colors.length]
              }
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  ) : (
    <ChartContainer>
      <StyledProgress
        className="noProgress"
        strokeLinecap="square"
        type="circle"
        percent={10}
        width={140}
        strokeWidth={13}
        strokeColor="#aaaaaa"
        trailColor="#aaaaaa"
        margin="40px 0px 30px 0px"
        textColor={titleColor}
        textSize="30px"
        format={() => `0 hr`}
      />
      <GraphDescription size="13px" color={greyThemeDark1}>
        0 MINS
      </GraphDescription>
    </ChartContainer>
  )
}

export default SummaryPieChart

const ChartContainer = styled(StyledProgressDiv)`
  & .recharts-layer tspan {
    font-size: 10px;
  }

  & .hour-text {
    font-size: 29px;
  }

  & .min-text {
    font-size: 10px;
  }
`
