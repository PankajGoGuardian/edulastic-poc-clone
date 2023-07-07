import React, { useState } from 'react'
import { maxBy, ceil, get } from 'lodash'
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  ReferenceArea,
  LabelList,
} from 'recharts'

import { reportUtils } from '@edulastic/constants'
import { lightBlue7 } from '@edulastic/colors'

import {
  NonSelectableResponsiveContainer,
  StyledChartNavButton,
} from '../styled'

const { createTicks, getInterval } = reportUtils.performanceByStudents

const xAxisLabel = {
  value: 'Score',
  offset: -5,
  position: 'insideBottom',
}

const yAxisLabel = {
  value: 'STUDENT COUNT',
  angle: -90,
  dx: -10,
}

const renderLabel = ({ x, y, width, value }) => (
  <text x={x + width / 2} y={y - 10} textAnchor="middle">
    {value || ''}
  </text>
)

const renderYAxisLabel = (maxValue) => ({ x, y, payload }) => (
  <text x={x - 10} y={y + 5} textAnchor="middle">
    {payload.value >= maxValue + getInterval(maxValue) ? '' : payload.value}
  </text>
)

const SimpleBarChartContainer = ({ data, setRange, range }) => {
  const [selecting, setSelecting] = useState(false)
  const { left = '', right = '' } = range
  const showSelectedArea = left !== '' && right !== ''
  const [startIndex, setStartIndex] = useState(0)

  const onMouseDown = (e) => {
    if (e) {
      // reset the selected range
      setRange(() => ({ left: '', right: '' }))
      setSelecting(true)
      setRange((prevRange) => ({ ...prevRange, left: e.activeLabel }))
    }
  }

  const onMouseMove = (e) => {
    if (selecting && e) {
      setRange((prevRange) => ({ ...prevRange, right: e.activeLabel }))
    }
  }

  const onMouseUp = () => {
    setSelecting(false)
  }

  const scrollLeft = () => {
    const temp = startIndex - 50 >= 0 ? startIndex - 50 : 0
    setStartIndex(temp)
  }

  const scrollRight = () => {
    const temp =
      startIndex + 100 <= data.length ? startIndex + 50 : data.length - 50
    setStartIndex(temp)
  }

  const maxStudentCount = get(maxBy(data, 'studentCount'), 'studentCount', 0)
  const interval = getInterval(maxStudentCount)
  const domain = [0, maxStudentCount + (ceil(maxStudentCount / interval) || 0)]
  const ticks = createTicks(maxStudentCount, interval)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-left"
        size="large"
        onClick={scrollLeft}
        style={{
          visibility: startIndex > 0 ? 'visible' : 'hidden',
          top: '35%',
          left: '0px',
        }}
      />
      <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-right"
        size="large"
        onClick={scrollRight}
        style={{
          visibility: startIndex + 50 < data.length ? 'visible' : 'hidden',
          top: '35%',
          right: '0px',
        }}
      />
      <NonSelectableResponsiveContainer width="90%" height={450}>
        <BarChart
          width={730}
          height={450}
          data={data.slice(startIndex, startIndex + 50)}
          barCategoryGap={0}
          margin={{ top: 30, bottom: 30, right: 30 }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          <XAxis
            label={xAxisLabel}
            interval={0}
            dataKey="name"
            scale="linear"
          />
          <YAxis
            padding={{ left: 100, right: 100 }}
            domain={domain}
            yAxisId="1"
            label={yAxisLabel}
            ticks={ticks}
            tick={renderYAxisLabel(maxStudentCount)}
          />
          <CartesianGrid stroke="#eee" vertical={false} />
          <Bar yAxisId="1" dataKey="studentCount" fill={lightBlue7}>
            <LabelList position="top" content={renderLabel} />
          </Bar>
          {showSelectedArea ? (
            <ReferenceArea
              yAxisId="1"
              x1={left}
              x2={right}
              strokeOpacity={0.3}
            />
          ) : null}
        </BarChart>
      </NonSelectableResponsiveContainer>
    </div>
  )
}

export default SimpleBarChartContainer
