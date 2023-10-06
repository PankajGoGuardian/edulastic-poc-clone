import React, { useEffect, useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Spin, Row, Col, Statistic, Table } from 'antd'
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
import { isEmpty } from 'lodash'
import styled from 'styled-components'
// import './recharts-theme.less' TODO: need to check the impact
import moment from 'moment'
import {
  getChartDataAction,
  getChartDataSelector,
  getIsChartDataLoadingSelector,
} from '../ducks'
import { buildChartData } from '../util'

const localeFormatter = (item) => (item || '').toLocaleString()
const dateFormatter = (item) => moment(item).format('MMM YY')
const colors = ['#7DB3FF', '#49457B', '#FF7C78']
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

const CartesianChart = ({ resultSet, children, ChartComponent, height }) => (
  <ResponsiveContainer width="100%" height={height}>
    <ChartComponent margin={{ left: -10 }} data={resultSet.data}>
      <XAxis
        axisLine={false}
        tickLine={false}
        tickFormatter={xAxisFormatter}
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
          type={getYAxesType(member)}
          orientation={i >= resultSet.yAxesFields.length / 2 ? 'right' : 'left'}
        />
      ))}
      <CartesianGrid vertical={false} />
      {children}
      <Legend />
      <Tooltip labelFormatter={(a) => a} formatter={localeFormatter} />
    </ChartComponent>
  </ResponsiveContainer>
)
const TypeToChartComponent = {
  line: ({ resultSet, height }) => (
    <CartesianChart
      resultSet={resultSet}
      height={height}
      ChartComponent={LineChart}
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
  bar: ({ resultSet, height }) => (
    <CartesianChart
      resultSet={resultSet}
      height={height}
      ChartComponent={BarChart}
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
  area: ({ resultSet, height }) => (
    <CartesianChart
      resultSet={resultSet}
      height={height}
      ChartComponent={AreaChart}
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
  table: ({ resultSet }) => (
    <Table
      pagination={false}
      columns={resultSet.columns.map((c) => ({ ...c, dataIndex: c.key }))}
      dataSource={resultSet.table}
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

const renderChart = (Component) => ({ resultSet, error, height, widgetId }) =>
  (resultSet && <Component height={height} resultSet={resultSet} />) ||
  (error && error.toString()) ||
  (!widgetId ? <StyledDiv>Click on Apply Button</StyledDiv> : <Spinner />)

const ChartRenderer = ({
  chartData,
  getChartData,
  chartType,
  chartHeight,
  isChartDataLoading,
  widget,
  widgetId,
}) => {
  const { layout, query } = widget
  const { options } = layout

  const component = TypeToMemoChartComponent[chartType]
  useEffect(() => {
    if (!isEmpty(query) && widgetId) {
      getChartData({ widgetId, query })
    }
  }, [JSON.stringify(query)])

  const resultSet = useMemo(() => {
    if (!isEmpty(chartData)) {
      return buildChartData(chartData, chartType, options.coOrds)
    }
    return null
  }, [chartType, chartData, widget])

  if (isChartDataLoading && !widgetId) {
    return <Spinner />
  }

  return (
    component &&
    renderChart(component)({ height: chartHeight, resultSet, widgetId })
  )
}

const enhance = compose(
  connect(
    (state, props) => ({
      isChartDataLoading: getIsChartDataLoadingSelector(state),
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
