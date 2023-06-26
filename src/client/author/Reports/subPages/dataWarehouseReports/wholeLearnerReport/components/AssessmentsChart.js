import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { reportUtils } from '@edulastic/constants'
import { round } from 'lodash'
import { SignedStackedBarChart } from '../../../../common/components/charts/customSignedStackedBarChart'
import {
  TooltipRow,
  TooltipRowTitle,
  TooltipRowValue,
  DashedHr,
  ColorCircle,
  ColorBandRow,
} from '../../../../common/styled'
import SectionLabel from '../../../../common/components/SectionLabel'
import {
  getLegendPayload,
  getBarsDataForInternal,
  getBarsDataForExternal,
  getAssessmentChartData,
} from '../utils'

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
      const achievementLevels = [...barData.achievementLevelBands].reverse()
      colorBandComponent = (
        <>
          <TooltipRowItem title={`${achievementLevels.length} color band`} />
          {achievementLevels.map((band) => (
            <ColorBandItem
              highlight={band.active}
              color={band.color}
              name={band.name}
            />
          ))}
        </>
      )
    } else {
      colorBandComponent = (
        <ColorBandItem color={barData.band.color} name={barData.band.name} />
      )
    }
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

const AssessmentsChart = ({
  chartData,
  settings,
  selectedPerformanceBand,
  onBarClickCB,
  onResetClickCB,
  preLabelContent,
  showInterventions,
  interventionsData,
}) => {
  const [legendPayload, barsDataForInternal] = useMemo(
    () => [
      getLegendPayload(selectedPerformanceBand),
      getBarsDataForInternal(selectedPerformanceBand),
    ],
    [selectedPerformanceBand]
  )

  const [barsDataForExternal, data] = useMemo(() => {
    const _barsDataForExternal = getBarsDataForExternal(chartData)
    const _chartData = getAssessmentChartData(
      chartData,
      _barsDataForExternal,
      barsDataForInternal
    )
    return [_barsDataForExternal, _chartData]
  }, [chartData, barsDataForInternal])

  return (
    <div>
      <SectionLabel $margin="32px 0 -20px 0" style={{ fontSize: '18px' }}>
        Performance Summary across Assessments
      </SectionLabel>
      <SignedStackedBarChart
        data={data}
        settings={settings}
        barsData={
          barsDataForExternal.length >= 1
            ? barsDataForExternal
            : barsDataForInternal
        }
        xAxisDataKey="pScore"
        getTooltipJSX={getTooltipJSX}
        barsLabelFormatter={barsLabelFormatter}
        yTickFormatter={() => ''}
        yAxisLabel="Assessment Performance"
        getXTickText={getXTickText}
        getXTickTagText={getXTickTagText}
        filter={{}}
        onBarClickCB={onBarClickCB}
        onResetClickCB={onResetClickCB}
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
        hideYAxis={false}
        hideCartesianGrid
        hasBarInsideLabels
        hasBarTopLabels
        preLabelContent={preLabelContent}
        interventionsData={interventionsData}
        showInterventions={showInterventions}
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
