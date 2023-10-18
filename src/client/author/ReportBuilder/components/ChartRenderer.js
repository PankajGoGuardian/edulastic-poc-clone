import React, { useMemo } from 'react'
import { Spin, Row, Col, Statistic, Table, Tooltip as AntDToolTip } from 'antd'
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
import { buildChartData } from '../util'
import { DEFAULT_PAGESIZE } from '../const'
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

function getTrimmedText(stringVal = '', letterCount = '28') {
  let shortenString = stringVal.substring(0, letterCount - 3)
  if (shortenString.length !== stringVal.length) {
    shortenString = shortenString.concat('...')
  }
  return shortenString
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
  axesLabel,
}) => (
  <>
    {axesLabel?.y && (
      <AntDToolTip title={axesLabel.y}>
        <YAxisLabelContainer>
          <span>{getTrimmedText(axesLabel.y)}</span>
        </YAxisLabelContainer>
      </AntDToolTip>
    )}
    {axesLabel?.x && (
      <AntDToolTip title={axesLabel.x}>
        <XAxisLabelContainer>
          <span>{getTrimmedText(axesLabel.x, 50)}</span>
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
  </>
)
const TypeToChartComponent = {
  line: ({
    resultSet,
    height,
    goToNextPage,
    goToPrevPage,
    chartNavLeftVisibility,
    chartNavRightVisibility,
    axesLabel,
  }) => (
    <CartesianChart
      resultSet={resultSet}
      height={height}
      ChartComponent={LineChart}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
      chartNavLeftVisibility={chartNavLeftVisibility}
      chartNavRightVisibility={chartNavRightVisibility}
      axesLabel={axesLabel}
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
    axesLabel,
  }) => (
    <CartesianChart
      resultSet={resultSet}
      height={height}
      ChartComponent={BarChart}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
      chartNavLeftVisibility={chartNavLeftVisibility}
      chartNavRightVisibility={chartNavRightVisibility}
      axesLabel={axesLabel}
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
    axesLabel,
  }) => (
    <CartesianChart
      resultSet={resultSet}
      height={height}
      ChartComponent={AreaChart}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
      chartNavLeftVisibility={chartNavLeftVisibility}
      chartNavRightVisibility={chartNavRightVisibility}
      axesLabel={axesLabel}
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
  table: ({ resultSet, pageFilter, handlePagination }) => (
    <TableData
      pagination={{
        pageSize: pageFilter.limit,
        total: pageFilter.total,
        current: Math.ceil(pageFilter.offset / pageFilter.limit) + 1,
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
  goToNextPage,
  goToPrevPage,
  pageFilter,
  handlePagination,
  chartNavLeftVisibility,
  chartNavRightVisibility,
  axesLabel,
}) =>
  resultSet ? (
    <Component
      height={height}
      resultSet={resultSet}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
      pageFilter={pageFilter}
      handlePagination={handlePagination}
      chartNavLeftVisibility={chartNavLeftVisibility}
      chartNavRightVisibility={chartNavRightVisibility}
      axesLabel={axesLabel}
    />
  ) : (
    <Spinner />
  )

export const ChartRenderer = ({
  chartData,
  chartHeight,
  isChartDataLoading,
  pageFilter,
  setPageFilter,
  widget,
}) => {
  const { layout } = widget
  const { options, type: chartType } = layout
  // const [pageFilter, setPageFilter] = useState({
  //   limit: DEFAULT_PAGESIZE,
  //   offset: 0,
  //   total: chartData?.total ?? chartData?.data?.length ?? 0,
  // })
  console.log({ pageFilter, chartData })
  // const pageFilter = useMemo(() => pageFilter, [chartData])

  const resultSet = useMemo(() => {
    if (!isEmpty(chartData)) {
      return buildChartData(chartData, chartType, options.coOrds)
    }
    return null
  }, [chartType, chartData, widget])

  const goToPrevPage = () => {
    setPageFilter((p) => ({
      ...p,
      offset: p.offset - p.limit,
    }))
  }
  const goToNextPage = () => {
    setPageFilter((p) => ({
      ...p,
      offset: p.offset + p.limit,
    }))
  }
  const handlePagination = (pageNumber) => {
    setPageFilter((p) => ({
      ...p,
      offset: Math.max(pageNumber - 1, 0) * p.limit,
    }))
  }

  const chartNavLeftVisibility = pageFilter.offset !== 0
  const chartNavRightVisibility =
    pageFilter.total - pageFilter.offset > pageFilter.limit
  const axesLabel = layout.options.axesLabel
  const component = TypeToMemoChartComponent[chartType]

  return (
    <MainDiv isLoading={isChartDataLoading}>
      {component ? (
        renderChart(component)({
          height: chartHeight,
          resultSet,
          goToPrevPage,
          goToNextPage,
          pageFilter,
          handlePagination,
          chartNavLeftVisibility,
          chartNavRightVisibility,
          axesLabel,
          isChartDataLoading,
        })
      ) : (
        <h1>No Layout selected !!</h1>
      )}
      <Spin spinning={isChartDataLoading} size="large" />
    </MainDiv>
  )
}

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
  background: transparent;
  opacity: 0.5;
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
  padding: 30px 35px 15px 55px;
  height: 100%;
  opacity: ${({ isLoading }) => (isLoading ? 0.6 : 1)};

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
  top: 47%;
  left: -50px;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  transform: rotate(-90deg) translate(0%, -50%);
`

const XAxisLabelContainer = styled.div`
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translate(-50%, 0%);
  white-space: nowrap;
  overflow: hidden;
  width: 50%;
  text-align: center;
`
