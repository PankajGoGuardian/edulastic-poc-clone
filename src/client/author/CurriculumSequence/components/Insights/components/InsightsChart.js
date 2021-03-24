import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import { round } from 'lodash'
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
} from 'recharts'

import { white, lightGrey7 } from '@edulastic/colors'
import {
  domainRange,
  scaleFactor,
  getQuadsData,
  calcLabelPosition,
} from '../transformers'
import gradientColorRuler from '../assets/ruler-color-gradient.svg'
import TrendArrow from '../assets/TrendArrow'

const toggleActiveData = ({
  studentId,
  activeData,
  setActiveData,
  allActive,
}) =>
  setActiveData(
    activeData.map((item) => {
      if (!item.isGrouped) {
        item.isActive =
          item.studentId === studentId
            ? !item.isActive
            : allActive == null
            ? item.isActive
            : allActive
      }
      return item
    })
  )

// custom label shape for scatter plot
const ScatterLabel = (props) => {
  const { cx, cy, handleArrowClick, handleCircleClick, ...item } = props
  const {
    studentId,
    name,
    trendAngle,
    color,
    count,
    hasTrend,
    isActive,
    isGrouped,
  } = item
  const { nameX, arrowY } = calcLabelPosition({ cx, cy, angle: trendAngle })
  return isGrouped ? (
    <g onClick={(e) => handleCircleClick(e, item.studentIds, color)}>
      <circle cx={cx} cy={cy} r={12} fill={lightGrey7} />
      <text
        x={cx}
        y={cy + 4}
        fontSize="11"
        fontWeight="bold"
        textAnchor="middle"
        fill={white}
      >
        {count}
      </text>
    </g>
  ) : (
    <g onClick={(e) => handleArrowClick(e, studentId)}>
      {isActive && (
        <text
          x={nameX}
          y={cy}
          fontSize="12"
          fontWeight="bold"
          textAnchor="end"
          fill={color}
        >
          {name}
        </text>
      )}
      {hasTrend ? (
        <TrendArrow cx={cx} cy={arrowY} color={color} trendAngle={trendAngle} />
      ) : (
        <circle cx={cx + 5} cy={cy - 6} r={3} fill={color} />
      )}
    </g>
  )
}

const InsightsChart = ({ data, highlighted, setHighlighted }) => {
  // active state of the display data (labels)
  const [activeData, setActiveData] = useState([])
  const [allActive, setAllActive] = useState(false)

  useEffect(() => {
    setActiveData(getQuadsData(data))
  }, [data])

  const graphLimit = round((domainRange * scaleFactor) / 2)

  // props for standard components
  const responsiveContainerProps = {
    width: '100%',
    height: '100%',
    aspect: 1,
  }
  const scatterChartProps = {
    margin: { top: -1, right: -1, bottom: -1, left: -1 },
    onClick: () => {
      toggleActiveData({ activeData, setActiveData, allActive: !allActive })
      setAllActive(!allActive)
    },
  }

  return (
    <Row type="flex" justify="center" align="middle" style={{ width: '100%' }}>
      <StyledCol
        xs={2}
        sm={3}
        md={3}
        lg={3}
        xl={3}
        style={{ textAlign: 'right' }}
      >
        TIME SPENT (HIGH)
      </StyledCol>
      <StyledCol xs={20} sm={18} md={18} lg={18} xl={18}>
        <Row type="flex" justify="center" style={{ width: '100%' }}>
          HIGH PERFORMANCE
        </Row>
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{ width: '100%' }}
        >
          <StyledImg alt="icon" src={gradientColorRuler} />
          <ResponsiveContainer {...responsiveContainerProps}>
            <ScatterChart {...scatterChartProps}>
              <XAxis
                type="number"
                dataKey="effort"
                name="effort"
                domain={[-graphLimit, graphLimit]}
                hide
              />
              <YAxis
                type="number"
                dataKey="performance"
                name="performance"
                domain={[-graphLimit, graphLimit]}
                hide
              />
              <Scatter
                name="Effort vs Performance"
                data={activeData}
                shape={
                  <ScatterLabel
                    handleArrowClick={(e, studentId) => {
                      e.stopPropagation()
                      toggleActiveData({
                        studentId,
                        activeData,
                        setActiveData,
                      })
                    }}
                    handleCircleClick={(e, studentIds, color) => {
                      e.stopPropagation()
                      setHighlighted(
                        highlighted.ids?.includes(studentIds[0])
                          ? {}
                          : { ids: studentIds, color }
                      )
                    }}
                  />
                }
              />
            </ScatterChart>
          </ResponsiveContainer>
        </Row>
        <Row type="flex" justify="center" style={{ width: '100%' }}>
          LOW PERFORMANCE
        </Row>
      </StyledCol>
      <StyledCol xs={2} sm={3} md={3} lg={3} xl={3}>
        TIME SPENT (LOW)
      </StyledCol>
    </Row>
  )
}

export default InsightsChart

const StyledCol = styled(Col)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-transform: uppercase;
  color: ${lightGrey7};
  font: Bold 11px/15px Open Sans;
  svg {
    overflow: visible;
  }
`

const StyledImg = styled.img`
  width: 95%;
  height: 95%;
  position: absolute;
`
