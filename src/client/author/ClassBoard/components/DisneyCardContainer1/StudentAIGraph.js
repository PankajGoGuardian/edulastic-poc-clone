import React, { useState } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { MainDiv } from '../BarGraph/styled'
import { StyledChartNavButton } from '../../../Reports/common/styled'

const StudentAIGraph = (questionData) => {
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

  const data = [
    {
      name: 'Q1',
      probability: 0.8 * 100,
      level: getDifficultyLevel(0.8),
    },
    {
      name: 'Q2',
      probability: 0.5 * 100,
      level: getDifficultyLevel(0.5),
    },
    {
      name: 'Q3',
      probability: 0.3 * 100,
      level: getDifficultyLevel(0.3),
    },
    {
      name: 'Q4',
      probability: 0.4 * 100,
      level: getDifficultyLevel(0.4),
    },
    {
      name: 'Q5',
      probability: 0.9 * 100,
      level: getDifficultyLevel(0.9),
    },
    {
      name: 'Q6',
      probability: 0.8 * 100,
      level: getDifficultyLevel(0.8),
    },
    {
      name: 'Q7',
      probability: 0.5 * 100,
      level: getDifficultyLevel(0.5),
    },
    {
      name: 'Q8',
      probability: 0.3 * 100,
      level: getDifficultyLevel(0.3),
    },
    {
      name: 'Q9',
      probability: 0.4 * 100,
      level: getDifficultyLevel(0.4),
    },
    {
      name: 'Q10',
      probability: 0.9 * 100,
      level: getDifficultyLevel(0.9),
    },
    {
      name: 'Q11',
      probability: 0.8 * 100,
      level: getDifficultyLevel(0.8),
    },
    {
      name: 'Q12',
      probability: 0.5 * 100,
      level: getDifficultyLevel(0.5),
    },
    {
      name: 'Q13',
      probability: 0.3 * 100,
      level: getDifficultyLevel(0.3),
    },
    {
      name: 'Q14',
      probability: 0.4 * 100,
      level: getDifficultyLevel(0.4),
    },
    {
      name: 'Q15',
      probability: 0.9 * 100,
      level: getDifficultyLevel(0.9),
    },
    {
      name: 'Q16',
      probability: 0.8 * 100,
      level: getDifficultyLevel(0.8),
    },
    {
      name: 'Q17',
      probability: 0.5 * 100,
      level: getDifficultyLevel(0.5),
    },
    {
      name: 'Q18',
      probability: 0.3 * 100,
      level: getDifficultyLevel(0.3),
    },
    {
      name: 'Q19',
      probability: 0.4 * 100,
      level: getDifficultyLevel(0.4),
    },
    {
      name: 'Q20',
      probability: 0.9 * 100,
      level: getDifficultyLevel(0.9),
    },
    {
      name: 'Q21',
      probability: 0.8 * 100,
      level: getDifficultyLevel(0.8),
    },
    {
      name: 'Q22',
      probability: 0.5 * 100,
      level: getDifficultyLevel(0.5),
    },
    {
      name: 'Q23',
      probability: 0.3 * 100,
      level: getDifficultyLevel(0.3),
    },
    {
      name: 'Q24',
      probability: 0.4 * 100,
      level: getDifficultyLevel(0.4),
    },
    {
      name: 'Q25',
      probability: 0.9 * 100,
      level: getDifficultyLevel(0.9),
    },
    {
      name: 'Q26',
      probability: 0.8 * 100,
      level: getDifficultyLevel(0.8),
    },
    {
      name: 'Q27',
      probability: 0.5 * 100,
      level: getDifficultyLevel(0.5),
    },
    {
      name: 'Q28',
      probability: 0.3 * 100,
      level: getDifficultyLevel(0.3),
    },
    {
      name: 'Q29',
      probability: 0.4 * 100,
      level: getDifficultyLevel(0.4),
    },
    {
      name: 'Q30',
      probability: 0.9 * 100,
      level: getDifficultyLevel(0.9),
    },
    {
      name: 'Q31',
      probability: 0.8 * 100,
      level: getDifficultyLevel(0.8),
    },
    {
      name: 'Q32',
      probability: 0.5 * 100,
      level: getDifficultyLevel(0.5),
    },
    {
      name: 'Q33',
      probability: 0.3 * 100,
      level: getDifficultyLevel(0.3),
    },
    {
      name: 'Q34',
      probability: 0.4 * 100,
      level: getDifficultyLevel(0.4),
    },
    {
      name: 'Q35',
      probability: 0.9 * 100,
      level: getDifficultyLevel(0.9),
    },
    {
      name: 'Q36',
      probability: 0.8 * 100,
      level: getDifficultyLevel(0.8),
    },
    {
      name: 'Q37',
      probability: 0.5 * 100,
      level: getDifficultyLevel(0.5),
    },
    {
      name: 'Q38',
      probability: 0.3 * 100,
      level: getDifficultyLevel(0.3),
    },
    {
      name: 'Q39',
      probability: 0.4 * 100,
      level: getDifficultyLevel(0.4),
    },
    {
      name: 'Q40',
      probability: 0.9 * 100,
      level: getDifficultyLevel(0.9),
    },
  ]

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

  console.log('render', pagination, data, renderData)

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
