import React, { useEffect, useMemo, useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  Spin,
  Row,
  Col,
  Statistic,
  Table,
  Tooltip as AntDToolTip,
  Input,
} from 'antd'
import {
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts'
import { EduButton } from '@edulastic/common'
import { isEmpty } from 'lodash'
import styled from 'styled-components'
// import './recharts-theme.less' TODO: need to check the impact
import moment from 'moment'
import { cardTitleColor, secondaryTextColor } from '@edulastic/colors'
import {
  getChartDataAction,
  getChartDataSelector,
  getIsChartDataLoadingSelector,
} from '../ducks'
import { buildChartData } from '../util'
// import { CustomizedTooltip } from './CustomizedTooltip'

const localeFormatter = (item) => (item || '').toLocaleString()
const dateFormatter = (item) => moment(item).format('MMM YY')
const colors = ['#3DB04E', '#ee6c4d', '#118ab2', '#073b4c', '#ffd166']
const xAxisFormatter = (item) => {
  if (moment(item).isValid()) {
    return dateFormatter(item)
  }
  return item
}

function getYAxesType(member) {
  switch (member.type) {
    case 'count':
    case 'max':
    case 'min':
    case 'avg':
    case 'sum':
    case 'count_distinct':
    case 'number':
      return 'number'
    case 'boolean':
    case 'string':
    case 'time':
    default:
      return 'category'
  }
}

function getTrimmedText(stringVal = '', letterCount = '15') {
  let shortenString = stringVal.substring(0, letterCount)
  if (shortenString.length !== stringVal.length) {
    shortenString = shortenString.concat('...')
  }
  return shortenString
}
const EditableLabel = (props) => {
  const { value, ...rest } = props
  console.log(props)
  return (
    <foreignObject
      x={20 ?? props.viewBox.x}
      y={174.5 ?? props.viewBox.y}
      width={props.viewBox.width}
      height={props.viewBox.height}
      transform={`rotate(-90, ${20 ?? props.viewBox.x}, ${
        174.5 ?? props.viewBox.y
      })`}
      {...rest}
    >
      <Input
        style={{ border: 'none' }}
        defaultValue={props.value}
        className="asd"
      />
    </foreignObject>
  )
}

const CartesianChart = ({
  resultSet,
  children,
  ChartComponent,
  height,
  goToNextPage,
  goToPrevPage,
  chartNavLeftVisibility,
  chartNavRightVisibility,
  finalAxesLabel,
}) => (
  <MainDiv>
    {finalAxesLabel?.y && (
      <AntDToolTip title={finalAxesLabel.y}>
        <YAxisLabelContainer>
          <span>{getTrimmedText(finalAxesLabel.y)}</span>
        </YAxisLabelContainer>
      </AntDToolTip>
    )}
    {finalAxesLabel?.x && (
      <AntDToolTip title={finalAxesLabel.x}>
        <XAxisLabelContainer>
          <span>{getTrimmedText(finalAxesLabel.x, 30)}</span>
        </XAxisLabelContainer>
      </AntDToolTip>
    )}
    <StyledChartNavButton
      type="primary"
      shape="circle"
      icon="caret-left"
      size="large"
      className="navigator navigator-left"
      onClick={goToPrevPage}
      style={{
        visibility: chartNavLeftVisibility ? 'visible' : 'hidden',
      }}
    />
    <StyledChartNavButton
      type="primary"
      shape="circle"
      icon="caret-right"
      size="large"
      className="navigator navigator-right"
      onClick={goToNextPage}
      style={{
        visibility: chartNavRightVisibility ? 'visible' : 'hidden',
      }}
    />
    <ResponsiveContainer width="100%" height={height}>
      <ChartComponent margin={{ left: -10 }} data={resultSet.data}>
        <XAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={
            resultSet.xAxesFields.length === 1 &&
            resultSet.xAxesFields[0].type === 'time'
              ? xAxisFormatter
              : undefined
          }
          dataKey="x"
          minTickGap={20}
        />
        {resultSet.yAxesFields.map((member, i) => (
          <YAxis
            axisLine={false}
            tickLine={false}
            key={member.name}
            // tickFormatter={localeFormatter}
            yAxisId={member.name}
            label={{ value: member.title ?? member.name, angle: -90 }}
            // label={<EditableLabel value={member.title} />}
            type={getYAxesType(member)}
            orientation={
              i >= resultSet.yAxesFields.length / 2 ? 'right' : 'left'
            }
          />
        ))}
        <CartesianGrid vertical={false} />
        {children}
        <Legend />
        <Tooltip formatter={localeFormatter} cursor={false} />
      </ChartComponent>
    </ResponsiveContainer>
  </MainDiv>
)
const TypeToChartComponent = {
  line: ({
    resultSet,
    height,
    goToNextPage,
    goToPrevPage,
    chartNavLeftVisibility,
    chartNavRightVisibility,
    finalAxesLabel,
  }) => (
    <CartesianChart
      resultSet={resultSet}
      height={height}
      ChartComponent={LineChart}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
      chartNavLeftVisibility={chartNavLeftVisibility}
      chartNavRightVisibility={chartNavRightVisibility}
      finalAxesLabel={finalAxesLabel}
    >
      {resultSet.seriesNames.map((series, i) => (
        <Line
          key={series.key}
          stackId="a"
          yAxisId={series.key}
          dataKey={series.key}
          name={series.title}
          stroke={colors[i]}
        />
      ))}
    </CartesianChart>
  ),
  bar: ({
    resultSet,
    height,
    goToNextPage,
    goToPrevPage,
    chartNavLeftVisibility,
    chartNavRightVisibility,
    finalAxesLabel,
  }) => (
    <CartesianChart
      resultSet={resultSet}
      height={height}
      ChartComponent={BarChart}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
      chartNavLeftVisibility={chartNavLeftVisibility}
      chartNavRightVisibility={chartNavRightVisibility}
      finalAxesLabel={finalAxesLabel}
    >
      {resultSet.seriesNames.map((series, i) => (
        <Bar
          key={series.key}
          stackId="a"
          yAxisId={series.key}
          dataKey={series.key}
          name={series.title}
          fill={colors[i]}
        />
      ))}
    </CartesianChart>
  ),
  area: ({
    resultSet,
    height,
    goToNextPage,
    goToPrevPage,
    chartNavLeftVisibility,
    chartNavRightVisibility,
    finalAxesLabel,
  }) => (
    <CartesianChart
      resultSet={resultSet}
      height={height}
      ChartComponent={AreaChart}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
      chartNavLeftVisibility={chartNavLeftVisibility}
      chartNavRightVisibility={chartNavRightVisibility}
      finalAxesLabel={finalAxesLabel}
    >
      {resultSet.seriesNames.map((series, i) => (
        <Area
          key={series.key}
          stackId="a"
          yAxisId={series.key}
          dataKey={series.key}
          name={series.title}
          stroke={colors[i]}
          fill={colors[i]}
        />
      ))}
    </CartesianChart>
  ),
  pie: ({ resultSet, height }) => (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          isAnimationActive={false}
          data={resultSet.data}
          nameKey="x"
          dataKey={resultSet.seriesNames[0].key}
          fill="#8884d8"
        >
          {resultSet.data.map((e, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  ),
  table: ({ resultSet, finalPageFilter, handlePagination }) => (
    <TableData
      pagination={{
        pageSize: finalPageFilter.limit,
        total: finalPageFilter.total,
        current: Math.ceil(finalPageFilter.offset / finalPageFilter.limit) + 1,
        position: 'top',
      }}
      onChange={(pagination) => handlePagination(pagination?.current || 1)}
      columns={resultSet.columns.map((c) => ({ ...c, dataIndex: c.key }))}
      dataSource={resultSet.table}
      scroll={{ x: true }}
    />
  ),
  number: ({ resultSet }) => (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{
        height: '100%',
      }}
    >
      <Col>
        {resultSet.seriesNames.map((s) => (
          <Statistic value={resultSet.data[0][s.key]} />
        ))}
      </Col>
    </Row>
  ),
}
const TypeToMemoChartComponent = Object.keys(TypeToChartComponent)
  .map((key) => ({
    [key]: React.memo(TypeToChartComponent[key]),
  }))
  .reduce((a, b) => ({ ...a, ...b }))

const Spinner = () => (
  <SpinContainer>
    <Spin size="large" />
  </SpinContainer>
)

const renderChart = (Component) => ({
  resultSet,
  height,
  widgetId,
  goToNextPage,
  goToPrevPage,
  finalPageFilter,
  handlePagination,
  chartNavLeftVisibility,
  chartNavRightVisibility,
  finalAxesLabel,
}) =>
  (resultSet && (
    <Component
      height={height}
      resultSet={resultSet}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
      finalPageFilter={finalPageFilter}
      handlePagination={handlePagination}
      chartNavLeftVisibility={chartNavLeftVisibility}
      chartNavRightVisibility={chartNavRightVisibility}
      finalAxesLabel={finalAxesLabel}
    />
  )) ||
  (!widgetId ? <StyledDiv>Click on Apply Button</StyledDiv> : <Spinner />)

const ChartRenderer = ({
  chartData,
  getChartData,
  chartType,
  chartHeight,
  isChartDataLoading,
  widget,
  widgetId,
  axesLabel,
}) => {
  const { layout, query } = widget
  const { options } = layout
  const [pageFilter, setPageFilter] = useState({
    limit: 50,
    offset: 0,
    total: query?.total ?? 25,
  })

  const component = TypeToMemoChartComponent[chartType]
  useEffect(() => {
    if (!isEmpty(query) && widgetId) {
      const queryWithPageFilters = { ...query, ...pageFilter }
      getChartData({ widgetId, query: queryWithPageFilters })
    }
  }, [JSON.stringify(query), pageFilter])

  const finalPageFilter = useMemo(() => pageFilter, [chartData])

  const resultSet = useMemo(() => {
    if (!isEmpty(chartData)) {
      return buildChartData(chartData, chartType, options.coOrds)
    }
    return null
  }, [chartType, chartData, widget])

  const goToPrevPage = () => {
    setPageFilter(() => ({
      ...pageFilter,
      offset: pageFilter.offset - pageFilter.limit,
    }))
  }
  const goToNextPage = () => {
    setPageFilter(() => ({
      ...pageFilter,
      offset: pageFilter.offset + pageFilter.limit,
    }))
  }
  const handlePagination = (pageNumber) => {
    setPageFilter(() => ({
      ...pageFilter,
      offset: Math.max(pageNumber - 1, 0) * pageFilter.limit,
    }))
  }

  const chartNavLeftVisibility = finalPageFilter.offset !== 0
  const chartNavRightVisibility =
    finalPageFilter.total - finalPageFilter.offset > finalPageFilter.limit

  const finalAxesLabel = axesLabel ?? layout.options.axesLabel

  if (isChartDataLoading && !widgetId) {
    return <Spinner />
  }

  return component ? (
    renderChart(component)({
      height: chartHeight,
      resultSet,
      widgetId,
      goToPrevPage,
      goToNextPage,
      finalPageFilter,
      handlePagination,
      chartNavLeftVisibility,
      chartNavRightVisibility,
      finalAxesLabel,
    })
  ) : (
    <h1>No Layout selected !!</h1>
  )
}

const enhance = compose(
  connect(
    (state, props) => ({
      isChartDataLoading: getIsChartDataLoadingSelector(state, props),
      chartData: getChartDataSelector(state, props),
    }),
    {
      getChartData: getChartDataAction,
    }
  )
)

export default enhance(ChartRenderer)

const StyledDiv = styled.div`
width: '90%',
margin: auto;
margin-top: 8%;  
text-align: center;
font-size: 1.5rem;
`
const SpinContainer = styled.div`
  text-align: center;
  padding: 30px 50px;
  margin-top: 30px;
`

export const StyledChartNavButton = styled(EduButton)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 32px;
  width: 32px;
  border-radius: 50%;

  .ant-btn > .anticon {
    line-height: 0.8;
  }

  @media print {
    display: none;
  }
`

const MainDiv = styled.div`
  position: relative;
  width: 100%;
  padding: 30px 35px 15px 55px;
  height: 100%;

  .navigator-left {
    left: 0px;
    top: 35%;
  }

  .navigator-right {
    right: 0px;
    top: 35%;
  }
`

export const TableData = styled(Table)`
  color: ${secondaryTextColor};
  width: auto;
  cursor: pointer;
  .ant-table-thead {
    > tr > th {
      font-weight: bold;
      font-size: 12px;
      text-transform: uppercase;
      color: ${cardTitleColor};
      white-space: nowrap;
      padding: 0px 16px 24px;
      background: transparent;
      border-bottom: none;
      text-align: center;

      &:first-child {
        text-align: left;
      }

      .ant-table-column-sorter {
        vertical-align: baseline;
      }
    }
  }

  .ant-table-tbody {
    > tr > td {
      padding: 8px 16px;
      font-weight: 600;
      text-align: center;

      &:first-child {
        text-align: left;
      }
    }
  }
`

const YAxisLabelContainer = styled.div`
  position: absolute;
  top: 50%;
  left: -10px;
  transform: rotate(-90deg) translate(50%, -50%);
`

const XAxisLabelContainer = styled.div`
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translate(-50%, 0%);
  display: flex;
  align-items: center;
`
