import { EduIf, useOfflinePagination } from '@edulastic/common'
import { Col, Row, Switch } from 'antd'
import React, { useMemo } from 'react'
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  LabelList,
  CartesianGrid,
} from 'recharts'
import styled from 'styled-components'
import NoDataNotification from '../../../../../common/components/NoDataNotification'
import { YAxisLabel } from '../../../common/components/charts/chartUtils/yAxisLabel'
import { StyledChartNavButton } from '../../../common/styled'
import { getAttendanceChartData } from './WeeklyAttendaceChart/utils'

const transformData = (page, pagedData) => {
  const START_X_LABEL = 'START DATE'
  const START_X_WEEK = -1

  if (page === 0) {
    return [
      {
        week: START_X_WEEK,
        startDate: START_X_LABEL,
        presents: 0,
        absents: 0,
        tardies: 0,
        total: 0,
        value: 0,
      },
      ...pagedData,
    ]
  }
  const first = pagedData[0]
  return [
    {
      ...first,
      week: START_X_WEEK,
      startDate: START_X_LABEL,
    },
    ...pagedData.slice(1),
  ]
}

const renderCustomizedLabel = (props) => {
  const { x, y, width, value } = props
  const radius = 10
  if (!value) {
    return null
  }
  return (
    <g>
      <text
        x={x + width / 2}
        y={y - radius}
        fill="#74B2E2"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
      >
        {value}
      </text>
    </g>
  )
}

const Tardies = ({ attendanceData, loading }) => {
  const attendanceChartData = useMemo(() => {
    const _attendanceChartData = getAttendanceChartData(attendanceData)
    return _attendanceChartData
  }, [attendanceData])

  const {
    next: nextPage,
    prev: prevPage,
    pagedData,
    page,
    totalPages,
  } = useOfflinePagination({
    defaultPage: 0,
    data: attendanceChartData,
    lookbackCount: 1,
    pageSize: 8,
    backFillLastPage: true,
  })
  const hasPreviousPage = page !== 0
  const hasNextPage = page < totalPages - 1
  const renderData = transformData(page, pagedData)
  const yMax = renderData.reduce((prev, current) =>
    prev.tardies > current.tardies ? prev : current
  ).tardies

  const generateVerticalCoordinates = ({ width }) => {
    const numVerticalLines = renderData.length
    const step = (width - 130) / numVerticalLines
    const coordinates = [80]
    for (let i = 1; i <= numVerticalLines; i++) {
      coordinates.push(step * i + 80)
    }
    return coordinates
  }

  return (
    <Col span={14}>
      <TardiesWrapper>
        <Row type="flex" justify="space-between">
          <Col>
            <Title>Tardies</Title>
          </Col>
          <Col>
            <StyledDiv>
              <StyledSpan>Weekly</StyledSpan>
              <StyledSwitch />
              <StyledSpan>Monthly</StyledSpan>
            </StyledDiv>
          </Col>
        </Row>
        <StyledChartNavButton
          type="primary"
          shape="circle"
          icon="caret-left"
          IconBtn
          className="navigator navigator-left"
          onClick={prevPage}
          style={{
            visibility: hasPreviousPage ? 'visible' : 'hidden',
          }}
        />
        <StyledChartNavButton
          type="primary"
          shape="circle"
          icon="caret-right"
          IconBtn
          className="navigator navigator-right"
          onClick={nextPage}
          style={{
            visibility: hasNextPage ? 'visible' : 'hidden',
          }}
        />
        <EduIf condition={renderData.length && !loading}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={730}
              height={250}
              data={renderData}
              margin={{ top: 0, right: 50, left: 20, bottom: 10 }}
            >
              <XAxis
                dataKey="week"
                xAxisId="0"
                strokeOpacity={0.2}
                tickMargin={20}
                fontSize={12}
                interval={0}
                tickLine={false}
                fontWeight="900"
                label={{ fill: 'red', fontSize: 20 }}
                tickFormatter={(v) => `Week ${v}`}
              />
              <XAxis
                dataKey="startDate"
                xAxisId="1"
                tickLine={false}
                dy={-7}
                tickMargin={20}
                fontSize={12}
                interval={0}
                axisLine={false}
                label={{ fill: 'red', fontSize: 20 }}
              />
              <YAxis
                dataKey="tardies"
                tickLine={false}
                axisLine={false}
                dx={-18}
                ticks={[0, yMax + 1]}
                opacity={0.5}
                label={
                  <YAxisLabel
                    data={{
                      opacity: 0.5,
                      value: 'NO OF TARDIES',
                      angle: -90,
                      fontSize: 12,
                    }}
                  />
                }
              />
              <Tooltip />
              <Bar
                dataKey="tardies"
                fill="#74B2E2"
                barSize={32}
                fillOpacity={0.5}
                radius={[5, 5, 0, 0]}
              >
                <LabelList dataKey="tardies" content={renderCustomizedLabel} />
              </Bar>
              <CartesianGrid
                strokeOpacity={0.4}
                horizontal={false}
                verticalCoordinatesGenerator={generateVerticalCoordinates}
              />
            </BarChart>
          </ResponsiveContainer>
        </EduIf>
        <EduIf condition={!renderData.length}>
          <NoDataNotification
            heading="No Tardies data available"
            description="Please include Tardies in attendance data to view the trends"
          />
        </EduIf>
      </TardiesWrapper>
    </Col>
  )
}

Tardies.propTypes = {}

Tardies.defaultProps = {}

export default Tardies

export const Title = styled.div`
  font-size: 16px;
  color: #434b5d;
  width: 100%;
  font-weight: bold;
  margin-bottom: 15px;
`
export const TardiesWrapper = styled.div`
  border: 1px solid #dedede;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 386px;
  border-radius: 10px;
  padding: 24px;
  .navigator-left {
    left: 10px;
  }
  .navigator-right {
    right: 10px;
  }
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

export const StyledSwitch = styled(Switch)`
  margin-left: 10px;
  margin-right: 10px;
  width: 35px;
  display: inline-block;
  &.ant-switch-checked,
  &.ant-switch {
    background-color: #1890ff;
  }
`
export const StyledDiv = styled.div`
  font-size: 12px;
  color: black;
  opacity: ${(props) => props.opacity || 1};
  font-weight: ${(props) => props.fontWeight || 400};
  margin-right: ${(props) => props.marginRight || '0'};
`
export const StyledSpan = styled.span`
  opacity: 0.65;
`
