import React from 'react'
import PropTypes from 'prop-types'
import { round, get, find } from 'lodash'
import { addColors } from '../../../../../common/util'
import { SimpleStackedBarChart } from '../../../../../common/components/charts/simpleStackedBarChart'
import BarTooltipRow from '../../../../../common/components/tooltip/BarTooltipRow'

export const getYLabelString = (analyzeBy) => {
  switch (analyzeBy) {
    case 'rawScore':
      return 'Avg. score'
    case 'standard':
    case 'proficiencyBand':
      return 'Student (%)'
    default:
      return 'Avg. score (%)'
  }
}

const ScoreChart = ({
  data,
  analyseBy,
  onBarClickCB,
  selectedTests,
  onResetClickCB,
}) => {
  const xDataKey = 'uniqId'
  const dataWithColors = addColors(data, selectedTests, xDataKey, 'score')

  const yTickformatLabel = (score) => {
    switch (analyseBy) {
      case 'score':
        return `${round(score)}%`
      case 'rawScore':
        return ''
    }
  }

  const barsLabelFormatter = (value, index, startIndex, x, y) => {
    switch (analyseBy) {
      case 'score':
        return yTickformatLabel(value)
      case 'rawScore':
        return (
          <>
            <tspan x={x + 20} dy="-15">
              {dataWithColors[index].rawScore.toFixed(2)}
            </tspan>
            <tspan x={x + 20} dy="2">
              _____
            </tspan>
            <tspan x={x + 20} dy="15">
              {dataWithColors[index].maxScore}
            </tspan>
          </>
        )
    }
  }

  const getXTickText = (payload, data) => {
    const currentBarData =
      find(data, (item) => item[xDataKey] === payload.value) || {}
    return currentBarData.testName || ''
  }

  const _onBarClickCB = (key) => {
    const clickedBarData =
      find(dataWithColors, (item) => item[xDataKey] === key) || {}
    onBarClickCB(clickedBarData)
  }

  const getTooltipJSX = (payload, barIndex) => {
    if (payload && payload.length && barIndex !== null) {
      const record = get(payload[0], 'payload', {})
      return (
        <div>
          <BarTooltipRow
            title="Avg. Performance : "
            value={`${record.score || 0}%`}
          />
          <BarTooltipRow
            title="Assessment : "
            value={record.testName || 'N/A'}
          />
          <BarTooltipRow title="Student Count : " value={record.totalGraded} />
          <BarTooltipRow
            title="Avg. Score : "
            value={round(record.rawScore, 2)}
          />
          <BarTooltipRow
            title="Total Points : "
            value={record.maxPossibleScore}
          />
        </div>
      )
    }
    return false
  }

  return (
    <SimpleStackedBarChart
      data={dataWithColors}
      xAxisDataKey={xDataKey}
      bottomStackDataKey="score"
      topStackDataKey="diffScore"
      yAxisLabel={getYLabelString(analyseBy)}
      getTooltipJSX={getTooltipJSX}
      getXTickText={getXTickText}
      yTickFormatter={yTickformatLabel}
      barsLabelFormatter={barsLabelFormatter}
      onBarClickCB={_onBarClickCB}
      onResetClickCB={onResetClickCB}
      filter={selectedTests}
    />
  )
}

ScoreChart.propTypes = {
  data: PropTypes.array.isRequired,
  analyseBy: PropTypes.string.isRequired,
  onBarClickCB: PropTypes.func,
  onResetClickCB: PropTypes.func,
  selectedTests: PropTypes.array,
}

ScoreChart.defaultProps = {
  onBarClickCB: () => {},
  onResetClickCB: () => {},
  selectedTests: [],
}

export default ScoreChart
