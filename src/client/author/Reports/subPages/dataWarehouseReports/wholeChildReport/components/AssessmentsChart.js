import React from 'react'
import PropTypes from 'prop-types'
import { reportUtils } from '@edulastic/constants'
import { isEmpty, round } from 'lodash'
import { SignedStackedBarChart } from '../../../../common/components/charts/customSignedStackedBarChart'
import {
  TooltipRow,
  TooltipRowTitle,
  TooltipRowValue,
  DashedHr,
  ColorCircle,
  ColorBandRow,
} from '../../../../common/styled'

// TODO: remove demo data
import { demoAchievementLevels } from '../utils'

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
    return (
      <div>
        <TooltipRowItem
          title="Date:"
          value={formatDate(barData.assignmentDate)}
        />
        <TooltipRowItem
          title="Score:"
          value={
            barData.externalTestType
              ? barData.totalScore
              : `${round(barData.averageScore, 2)}%`
          }
        />
        <DashedHr />
        {barData.externalTestType && !isEmpty(barData.claimsInfo) ? (
          <>
            {/* TODO: remove demo data */}
            <TooltipRowItem
              title={`${demoAchievementLevels.length} color band`}
            />
            {demoAchievementLevels
              .slice(0)
              .reverse()
              .map((band) => (
                <ColorBandItem
                  color={band.color}
                  highlight={band.id === barData.achievementLevel}
                  name={band.name}
                />
              ))}
          </>
        ) : (
          <ColorBandItem color={barData.band.color} name={barData.band.name} />
        )}
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

const AssessmentsChart = ({
  chartData,
  selectedPerformanceBand,
  onBarClickCB,
  onResetClickCB,
}) => {
  // TODO: remove demo data
  const achievementLevels = demoAchievementLevels

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
  }))

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

  const barsCellDataForExternal = barsDataForExternal.reduce(
    (res, ele) => ({
      ...res,
      [ele.key]: ele[ele.key],
    }),
    {}
  )

  const data = chartData
    .map((d) => {
      if (d.externalTestType) {
        const barData = barsDataForExternal.find(
          (bar) => bar.id === d.achievementLevel
        )
        return barData
          ? {
              ...d,
              ...barsCellDataForExternal,
              [barData.insideLabelKey]: d.totalScore,
              fillOpacity: 0.2,
              additionalData: {
                [barData.key]: {
                  fillOpacity: 0.7,
                  stroke: barData.fill,
                  strokeOpacity: 1,
                  strokeWidth: 2,
                },
              },
            }
          : null
      }
      return {
        ...d,
        [barsDataForInternal[0].key]: d.averageScore,
        [barsDataForInternal[0].topLabelKey]: `${round(d.averageScore, 2)}%`,
        fill: d.band.color,
        fillOpacity: 1,
      }
    })
    .filter((d) => d)

  return (
    <div>
      <SignedStackedBarChart
        data={data}
        barsData={
          barsDataForExternal.length >= 1
            ? barsDataForExternal
            : barsDataForInternal
        }
        xAxisDataKey="pScore"
        getTooltipJSX={getTooltipJSX}
        barsLabelFormatter={barsLabelFormatter}
        yTickFormatter={() => ''}
        yAxisLabel=""
        getXTickText={getXTickText}
        getXTickTagText={getXTickTagText}
        filter={{}}
        onBarClickCB={() => console.log('onBarClickCB')}
        onResetClickCB={() => console.log('onResetClickCB')}
        margin={{ top: 0, right: 20, left: 20, bottom: 40 }}
        legendProps={{
          iconType: 'circle',
          height: 50,
          payload: legendPayload,
        }}
        yDomain={[0, 100]}
        ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        pageSize={10}
        hasRoundedBars={false}
        isSignedChart={false}
        hideYAxis
        hideCartesianGrid
        hasBarInsideLabels
        hasBarTopLabels
      />
    </div>
  )
}

AssessmentsChart.propTypes = {
  chartData: PropTypes.array.isRequired,
  selectedPerformanceBand: PropTypes.array.isRequired,
  onBarClickCB: PropTypes.func,
  onResetClickCB: PropTypes.func,
}

AssessmentsChart.defaultProps = {
  onResetClickCB: () => {},
  onBarClickCB: () => {},
}

export default AssessmentsChart
