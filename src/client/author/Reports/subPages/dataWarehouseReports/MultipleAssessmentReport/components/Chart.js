import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, isNumber, round } from 'lodash'

import { greyThemeDark1 } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'
import { SignedStackedBarWithLineChart } from '../../../../common/components/charts/customSignedStackedBarWithLineChart'
import {
  TooltipRow,
  TooltipRowTitle,
  TooltipRowValue,
  DashedHr,
  ColorCircle,
  ColorBandRow,
} from '../../../../common/styled'
import { toggleItem } from '../../../../common/util'
import { getScoreSuffix } from '../../common/utils'

const { formatDate } = reportUtils.common

const chartLineProps = {
  strokeDasharray: '5 3',
  stroke: greyThemeDark1,
  strokeWidth: 2,
  strokeWidthActive: 20,
}

const chartMargin = { top: 0, right: 20, left: 20, bottom: 40 }

const TooltipRowItem = ({ title = '', value = '' }) => (
  <TooltipRow>
    <TooltipRowTitle>{`${title}`}</TooltipRowTitle>
    <TooltipRowValue>{value}</TooltipRowValue>
  </TooltipRow>
)

const ColorBandItem = ({ name, color, highlight }) => {
  let style = {}
  if (highlight) {
    style = { fontSize: '15px', fontWeight: 'bold' }
  }
  return (
    <ColorBandRow>
      <ColorCircle color={color} />
      <TooltipRowValue style={style}>{name}</TooltipRowValue>
    </ColorBandRow>
  )
}

// payload: [{ color, dataKey, fill, formatter, name, type, unit, value, payload }, ...]
// payload[0].payload: contains data for that bar
const getTooltipJSX = (payload, barIndex) => {
  if (payload && payload.length && barIndex !== null) {
    const barData = payload[0].payload
    let colorBandComponent = null
    if (barData.externalTestType) {
      const achievementLevels = [...barData.bands].reverse()
      colorBandComponent = (
        <>
          <TooltipRowItem title={`${achievementLevels.length} color band`} />
          {achievementLevels.map((band) => (
            <ColorBandItem
              highlight={false}
              color={band.color}
              name={band.name}
            />
          ))}
        </>
      )
    } else {
      colorBandComponent = (
        <ColorBandItem color={barData.color} name={barData.bandName} />
      )
    }
    const score = isNumber(barData.averageScore)
      ? round(barData.averageScore)
      : barData.averageScore
    const scoreSuffix = getScoreSuffix(barData.externalTestType)
    return (
      <div>
        <TooltipRowItem
          title="Date:"
          value={formatDate(barData.assessmentDate)}
        />
        <TooltipRowItem title="Students:" value={barData.totalGraded} />
<<<<<<< HEAD
        <TooltipRowItem title="Score:" value={`${score}${scoreSuffix}`} />
=======
        <TooltipRowItem
          title="Score:"
          value={`${round(barData.averageScore)}${getScoreSuffix(
            barData.externalTestType
          )}`}
        />
>>>>>>> edulasticv2-e34.1.0
        <DashedHr />
        {colorBandComponent}
      </div>
    )
  }
  return null
}

const getRightTooltipJSX = (payload, barIndex) => {
  if (payload && payload.length && barIndex !== null) {
    const barKey = `bar${barIndex + 1}`
    const barData = payload[0].payload
    const recordColor = barData.additionalData[barKey]
    // TODO: find a better way to handle right tooltip state updates
    if (isEmpty(barData) || isEmpty(recordColor)) return null
    const records = barData.records
    const bar = records.filter((e) => {
      return e.color === recordColor.fill
    })
    if (isEmpty(bar)) return null
    let name = bar[0].bandName
    if (barData.externalTestType) {
      const achievementLevels = [...barData.bands]
      name = achievementLevels.filter((e) => e.color === recordColor.fill)[0]
        .name
    }
    const colorBandComponent = (
      <ColorBandItem color={bar[0].color} name={name} />
    )
    return (
      <div>
        <TooltipRowItem
          title="Students:"
          value={`${bar[0].totalGraded}/${barData.totalGraded}`}
        />
        <TooltipRowItem title="Student(%):" value={`${barData[barKey]}%`} />
        <DashedHr />
        {colorBandComponent}
      </div>
    )
  }
  return null
}

// value: contains the value to be displayed as bar label
const barsLabelFormatter = (value) => {
  return value || ''
}

// payload: { coordinate, value, index, offset }
// _data: contains the current slice of data displayed in the chart
const getXTickText = (payload, _data) => {
  const _testData = _data[payload.index]
  const _testName = _testData.isIncomplete
    ? `${_testData.testName} *`
    : _testData.testName
  return _testName || '-'
}

const getXTickTagText = (payload, _data) => {
  return _data[payload.index]?.externalTestType || ''
}

const Chart = ({
  chartData,
  selectedPerformanceBand,
  selectedTests,
  setSelectedTests,
  showInterventions,
  interventionsData,
}) => {
  const achievementLevels = chartData.flatMap((cdItem) =>
    cdItem.externalTestType ? cdItem.bands : []
  )

  const legendPayload = selectedPerformanceBand
    .sort((a, b) => a.threshold - b.threshold)
    .map((pb, index) => ({
      id: `pb${index + 1}`,
      color: pb.color,
      value: pb.name,
      type: 'circle',
    }))

  const selectedTestsFilter = selectedTests.reduce(
    (res, ele) => ({
      ...res,
      [ele]: true,
    }),
    {}
  )

  const chartLegendProps = {
    iconType: 'circle',
    height: 100,
    payload: legendPayload,
  }

  const barsDataForInternal = selectedPerformanceBand.map((pb, index) => ({
    ...pb,
    key: `bar${index + 1}`,
    insideLabelKey: `inside-label-bar${index + 1}`,
    topLabelKey: `top-label-bar${index + 1}`,
    name: pb.name,
    fill: pb.color,
    stackId: 'a',
    [`bar${index + 1}`]: 1,
  }))

  // use constant EXTERNAL_TEST_TYPES to identify between different external tests
  const barsDataForExternal = achievementLevels.map((al, index) => ({
    ...al,
    key: `bar${index + 1}`,
    insideLabelKey: `inside-label-bar${index + 1}`,
    topLabelKey: `top-label-bar${index + 1}`,
    name: al.name,
    fill: al.color,
    stackId: 'a',
    [`bar${index + 1}`]: Math.floor(100 / achievementLevels.length),
  }))

  const data = chartData.map((d) => {
    if (d.externalTestType) {
      // for external assessments
      const filteredBarsDataForExternal = barsDataForExternal.filter(
        (b) => b.testId === d.testId
      )
      const barsCellDataForExternal = filteredBarsDataForExternal.reduce(
        (res, ele) => {
          const barData = d.records.find((r) => r.id == ele.id)
          return {
            ...res,
            [ele.key]: barData.totalGradedPercentage,
            [ele.insideLabelKey]:
              barData.totalGradedPercentage >= 10
                ? `${round(barData.totalGradedPercentage, 0) || 0}%`
                : '',
          }
        },
        {}
      )
      const barsCellAdditionalDataForExternal = barsDataForExternal.reduce(
        (res, ele) => ({
          ...res,
          [ele.key]: {
            fill: ele.fill,
          },
        }),
        {}
      )
      const _topLabelKey = `top-label-bar${barsDataForExternal.length}`
      return {
        ...d,
        ...barsCellDataForExternal,
        [_topLabelKey]: isNumber(d.averageScore)
          ? round(d.averageScore || 0)
          : d.averageScore,
        additionalData: barsCellAdditionalDataForExternal,
      }
    }
    // for internal assessments
    const barsCellDataForInternal = barsDataForInternal.reduce((res, ele) => {
      const barData = d.records.find((r) => r.threshold == ele.threshold)
      return {
        ...res,
        [ele.key]: barData.totalGradedPercentage,
        [ele.insideLabelKey]:
          barData.totalGradedPercentage >= 10
            ? `${round(barData.totalGradedPercentage, 0) || 0}%`
            : '',
      }
    }, {})
    const barsCellAdditionalDataForInternal = barsDataForInternal.reduce(
      (res, ele) => ({
        ...res,
        [ele.key]: {
          fill: ele.fill,
        },
      }),
      {}
    )
    const _topLabelKey = `top-label-bar${barsDataForInternal.length}`
    return {
      ...d,
      ...barsCellDataForInternal,
      [_topLabelKey]: `${round(d.averageScore, 0)}%`,
      additionalData: barsCellAdditionalDataForInternal,
    }
  })

  const handleToggleSelectedBars = (item) => {
    const _selectedTests = toggleItem(selectedTests, item)
    setSelectedTests(_selectedTests)
  }

  const _onResetClickCB = () => {
    setSelectedTests([])
  }

  return (
    <SignedStackedBarWithLineChart
      data={data}
      barsData={
        barsDataForExternal.length > barsDataForInternal.length
          ? barsDataForExternal
          : barsDataForInternal
      }
      xAxisDataKey="uniqId"
      lineDataKey="lineScore"
      lineProps={chartLineProps}
      getTooltipJSX={getTooltipJSX}
      getRightTooltipJSX={getRightTooltipJSX}
      barsLabelFormatter={barsLabelFormatter}
      yTickFormatter={() => ''}
      yAxisLabel="Distribution of Students (%)"
      getXTickText={getXTickText}
      getXTickTagText={getXTickTagText}
      filter={selectedTestsFilter}
      onBarClickCB={handleToggleSelectedBars}
      onResetClickCB={_onResetClickCB}
      margin={chartMargin}
      legendProps={chartLegendProps}
      yDomain={[0, 100]}
      ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
      pageSize={10}
      hasRoundedBars={false}
      isSignedChart={false}
      hideYAxis={false}
      hideCartesianGrid
      hasBarInsideLabels
      hasBarTopLabels
      showInterventions={showInterventions}
      interventionsData={interventionsData}
    />
  )
}

Chart.propTypes = {
  chartData: PropTypes.array.isRequired,
  selectedPerformanceBand: PropTypes.array.isRequired,
  selectedTests: PropTypes.array,
  setSelectedTests: PropTypes.func,
}

Chart.defaultProps = {
  selectedTests: [],
  setSelectedTests: () => {},
}

export default Chart
