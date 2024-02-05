import React, { useState } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { MainDiv } from '../BarGraph/styled'
import { StyledChartNavButton } from '../../../Reports/common/styled'

const StudentAIGraph = ({ studentAiData }) => {
  const page = 10
  const [pagination, setPagination] = useState({
    startIndex: 0,
    endIndex: page - 1,
  })

  const getDifficultyLevel = (value) => {
    if (value >= 0.7) {
      return 'easy'
    }
    if (value >= 0.4 && value <= 0.7) {
      return 'medium'
    }
    return 'hard'
  }

  const data = (studentAiData?.questions || []).map((q, indx) => ({
    name: `Q${indx + 1}`,
    probability: q.probability * 100,
    level: getDifficultyLevel(q.probability),
  }))

  // Todo: Remove this data variable once Api returns some response

  const scrollLeft = () => {
    let diff
    if (pagination.startIndex > 0) {
      if (pagination.startIndex >= page) {
        diff = page
      } else {
        diff = pagination.startIndex
      }
      setPagination({
        startIndex: pagination.startIndex - diff,
        endIndex: pagination.endIndex - diff,
      })
    }
  }

  const scrollRight = () => {
    let diff
    if (pagination.endIndex < data.length - 1) {
      if (data.length - 1 - pagination.endIndex >= page) {
        diff = page
      } else {
        diff = data.length - 1 - pagination.endIndex
      }

      setPagination({
        startIndex: pagination.startIndex + diff,
        endIndex: pagination.endIndex + diff,
      })
    }
  }

  const fillBarColor = ({ level }) => {
    if (level === 'easy') {
      return 'green'
    }
    if (level === 'medium') {
      return 'orange'
    }

    return 'red'
  }

  const renderTooltip = ({ active, payload, label }) => {
    if (active) {
      const obj = payload[0].payload
      return (
        <div
          style={{
            background: '#fff',
            padding: 10,
            borderRadius: 8,
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          }}
        >
          <h5>{label}</h5>
          <p>Probability: {obj.probability}%</p>
          <p>
            Difficulty Level:{' '}
            <span style={{ color: fillBarColor(obj) }}>
              {obj.level.toUpperCase()}
            </span>
          </p>
        </div>
      )
    }
  }

  const renderLegend = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        {['easy', 'medium', 'hard'].map((ele) => (
          <div
            key={ele}
            style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}
          >
            <div
              style={{
                backgroundColor: fillBarColor({ level: ele }),
                width: '10px', // Set icon size
                height: '10px',
                marginRight: '5px',
                borderRadius: '50%',
              }}
            />
            <p>{ele.toUpperCase()}</p>
          </div>
        ))}
      </div>
    )
  }

  const renderData = [...data].slice(
    pagination.startIndex,
    pagination.startIndex + page
  )

  return (
    <MainDiv className="studentBarChart" style={{ padding: 0 }}>
      <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-left"
        size="small"
        className="navigator navigator-left"
        onClick={scrollLeft}
        style={{
          visibility: pagination.startIndex === 0 ? 'hidden' : 'visible',
          left: -25,
          width: 20,
          height: 25,
        }}
      />

      <StyledChartNavButton
        data-cy="lcbnextButton"
        type="primary"
        shape="circle"
        icon="caret-right"
        size="small"
        className="navigator navigator-right"
        onClick={scrollRight}
        style={{
          visibility:
            data.length <= pagination.endIndex + 1 ? 'hidden' : 'visible',
          right: -18,
          width: 20,
          height: 25,
        }}
      />
      <BarChart
        width={300}
        height={200}
        data={renderData}
        margin={{
          right: 30,
          left: -20,
        }}
      >
        <XAxis dataKey="name" interval={0} />
        <YAxis
          type="number"
          domain={[0, 100]}
          minTickGap={10}
          tickFormatter={(value) => `${value}%`}
        />
        <Legend verticalAlign="top" height={36} content={renderLegend} />
        <Tooltip content={renderTooltip} />
        <Bar dataKey="probability">
          {renderData.map((entry, index) => {
            return <Cell key={`cell-${index}`} fill={fillBarColor(entry)} />
          })}
        </Bar>
      </BarChart>
    </MainDiv>
  )
}

export default StudentAIGraph
