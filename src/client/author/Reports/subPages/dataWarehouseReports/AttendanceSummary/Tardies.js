import { EduIf, SpinLoader, useOfflinePagination } from '@edulastic/common'
import { Col, Row } from 'antd'
import React, { useMemo } from 'react'
import { maxBy } from 'lodash'
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
import NoDataNotification from '../../../../../common/components/NoDataNotification'
import { YAxisLabel } from '../../../common/components/charts/chartUtils/yAxisLabel'
import { StyledChartNavButton } from '../../../common/styled'
import {
  getAttendanceChartData,
  getXTickText,
  transformDataForChart,
} from './WeeklyAttendaceChart/utils'
import { groupByConstants } from './utils/constants'
import {
  StyledSwitch,
  StyledSpan,
  StyledDiv,
  TardiesTitle,
  TardiesWrapper,
} from './styled-component'
import { CustomChartXTick } from '../../../common/components/charts/chartUtils/customChartXTick'

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

const Tardies = ({ attendanceData, loading, groupBy, setGroupBy }) => {
  const attendanceChartData = useMemo(() => {
    const _attendanceChartData = getAttendanceChartData(attendanceData, groupBy)
    return _attendanceChartData.filter((item) => !!item.tardies)
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
    startFromLastPage: true,
  })
  const hasPreviousPage = page !== 0
  const hasNextPage = page < totalPages - 1
  const renderData = transformDataForChart(page, pagedData, groupBy, 'tardies')
  const yMax = maxBy(renderData, 'tardies')?.tardies

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
        <EduIf condition={renderData.length && !loading}>
          <Row type="flex" justify="space-between">
            <Col>
              <TardiesTitle>Tardies</TardiesTitle>
            </Col>
            <Col>
              <StyledDiv>
                <StyledSpan>Weekly</StyledSpan>
                <StyledSwitch
                  checked={groupBy === groupByConstants.MONTH}
                  onChange={setGroupBy}
                />
                <StyledSpan>Monthly</StyledSpan>
              </StyledDiv>
            </Col>
          </Row>
        </EduIf>
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
        <EduIf condition={loading}>
          <SpinLoader />
        </EduIf>
        <EduIf condition={!loading}>
          <EduIf condition={renderData.length}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={730}
                height={250}
                data={renderData}
                margin={{ top: 0, right: 50, left: 20, bottom: 10 }}
              >
                <XAxis
                  dataKey={groupBy}
                  xAxisId="0"
                  strokeOpacity={0.2}
                  tickMargin={20}
                  fontSize={12}
                  interval={0}
                  tickLine={false}
                  fontWeight="900"
                  tick={
                    <CustomChartXTick
                      data={renderData}
                      getXTickText={(payload, _data) =>
                        getXTickText(payload, _data, groupBy)
                      }
                      fontWeight={600}
                    />
                  }
                  label={{ fill: 'red', fontSize: 20 }}
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
                  <LabelList
                    dataKey="tardies"
                    content={renderCustomizedLabel}
                  />
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
              style={{ height: '100%' }}
              wrapperStyle={{ minHeight: '100%' }}
            />
          </EduIf>
        </EduIf>
      </TardiesWrapper>
    </Col>
  )
}

Tardies.propTypes = {}

Tardies.defaultProps = {}

export default Tardies
