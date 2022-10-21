import React from 'react'
import PropTypes from 'prop-types'
import { round } from 'lodash'

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

const { formatDate } = reportUtils.common

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
    return (
      <div>
        <TooltipRowItem
          title="Date:"
          value={formatDate(barData.assessmentDate)}
        />
        <TooltipRowItem title="Students:" value={barData.totalGraded} />
        <TooltipRowItem
          title="Score:"
          value={
            barData.externalTestType
              ? barData.averageScore
              : `${barData.totalScore}/${barData.totalMaxScore}`
          }
        />
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
    let recordIndex
    const records = barData.records
    const bar = records.filter((e, index) => {
      if (e.color === recordColor.fill) recordIndex = index
      return e.color === recordColor.fill
    })
    let scoreRange
    let name = bar[0].bandName
    if (barData.externalTestType) {
      // TODO: scoreRange value is required
      scoreRange = 'NA'
      const achievementLevels = [...barData.bands]
      name = achievementLevels.filter((e) => e.color === recordColor.fill)[0]
        .name
    } else if (recordIndex === 0) {
      scoreRange = `${records[recordIndex].threshold}-100%`
    } else {
      scoreRange = `${records[recordIndex].threshold}-${
        records[recordIndex - 1].threshold
      }%`
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
        <TooltipRowItem title="Score:" value={scoreRange} />
        {barData[barKey] < 10 && (
          <TooltipRowItem title="Student(%):" value={`${barData[barKey]}%`} />
        )}
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
  return _data[payload.index]?.testName || '-'
}

const getXTickTagText = (payload, _data) => {
  return _data[payload.index]?.externalTestType || ''
}

const Chart = ({
  chartData,
  selectedPerformanceBand,
  selectedItems,
  setSelectedItems,
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
        [_topLabelKey]: d.averageScore || 0,
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
    const newSelectedTests = toggleItem(selectedItems, item)
    setSelectedItems(newSelectedTests)
  }

  const _onResetClickCB = () => {
    setSelectedItems([])
  }
  const selectedTests = selectedItems.reduce(
    (res, ele) => ({
      ...res,
      [ele]: true,
    }),
    {}
  )

  return (
    <SignedStackedBarWithLineChart
      data={data}
      barsData={
        barsDataForExternal.length > barsDataForInternal.length
          ? barsDataForExternal
          : barsDataForInternal
      }
      xAxisDataKey="testId"
      lineDataKey="lineScore"
      lineProps={{
        strokeDasharray: '5 3',
        stroke: greyThemeDark1,
        strokeWidth: 2,
        strokeWidthActive: 20,
      }}
      getTooltipJSX={getTooltipJSX}
      getRightTooltipJSX={getRightTooltipJSX}
      barsLabelFormatter={barsLabelFormatter}
      yTickFormatter={() => ''}
      yAxisLabel=""
      getXTickText={getXTickText}
      getXTickTagText={getXTickTagText}
      filter={selectedTests}
      onBarClickCB={handleToggleSelectedBars}
      onResetClickCB={_onResetClickCB}
      margin={{ top: 0, right: 20, left: 20, bottom: 40 }}
      legendProps={{
        iconType: 'circle',
        height: 70,
        payload: legendPayload,
      }}
      yDomain={[0, 150]}
      ticks={[
        0,
        10,
        20,
        30,
        40,
        50,
        60,
        70,
        80,
        90,
        100,
        110,
        120,
        130,
        140,
        150,
      ]}
      pageSize={10}
      hasRoundedBars={false}
      isSignedChart={false}
      hideYAxis
      hideCartesianGrid
      hasBarInsideLabels
      hasBarTopLabels
    />
  )
}

Chart.propTypes = {
  chartData: PropTypes.array.isRequired,
  selectedPerformanceBand: PropTypes.array.isRequired,
  selectedItems: PropTypes.array,
  setSelectedItems: PropTypes.func,
}

Chart.defaultProps = {
  selectedItems: [],
  setSelectedItems: () => {},
}

export default Chart
