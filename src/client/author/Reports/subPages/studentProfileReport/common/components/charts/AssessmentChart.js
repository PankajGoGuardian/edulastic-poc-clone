import React from 'react'
import PropTypes from 'prop-types'
import { round, get, find } from 'lodash'
import { reportUtils } from '@edulastic/constants'
import { SimpleStackedBarChart } from '../../../../../common/components/charts/simpleStackedBarChart'
import BarTooltipRow from '../../../../../common/components/tooltip/BarTooltipRow'

const { addColors } = reportUtils.common

const AssessmentChart = ({
  data,
  selectedTests,
  onBarClickCB,
  onResetClickCB,
  studentInformation = {},
  xTickTooltipPosition = 460,
  isBarClickable = false,
  printWidth,
}) => {
  const xDataKey = 'uniqId'

  const dataWithColors = addColors(data, selectedTests, xDataKey, 'score')

  const barsLabelFormatter = (value) => `${round(value || 0)}%`

  const getXTickText = (payload, _data) => {
    const currentBarData =
      find(_data, (item) => item[xDataKey] === payload.value) || {}
    return currentBarData.testName || ''
  }

  const _onBarClickCB = (key, args = {}) => {
    const clickedBarData =
      find(dataWithColors, (item) => item[xDataKey] === key) || {}
    onBarClickCB(clickedBarData, args)
  }

  const getTooltipJSX = (payload, barIndex) => {
    if (payload && payload.length && barIndex !== null) {
      const record = get(payload[0], 'payload', {})
      return (
        <div>
          <BarTooltipRow
            title="Assessment : "
            value={record.testName || 'N/A'}
          />
          <BarTooltipRow
            title="Subject : "
            value={studentInformation.standardSet || 'N/A'}
          />
          <BarTooltipRow title="Type : " value={record.testType} />
          <BarTooltipRow title="Performance Band : " value={record.band.name} />
          <BarTooltipRow
            title="Student Performance : "
            value={`${record.score}%`}
          />
        </div>
      )
    }
    return false
  }

  return (
    <SimpleStackedBarChart
      margin={{ top: 0, right: 50, left: 70, bottom: 0 }}
      xTickTooltipPosition={xTickTooltipPosition}
      data={dataWithColors}
      xAxisDataKey={xDataKey}
      bottomStackDataKey="score"
      topStackDataKey="diffScore"
      yAxisLabel="Assessment Performance"
      getTooltipJSX={getTooltipJSX}
      getXTickText={getXTickText}
      barsLabelFormatter={barsLabelFormatter}
      onBarClickCB={_onBarClickCB}
      onResetClickCB={onResetClickCB}
      filter={selectedTests}
      isBarClickable={isBarClickable}
      printWidth={printWidth}
      overflowStyle="" // display complete tooltip
    />
  )
}

AssessmentChart.propTypes = {
  data: PropTypes.array.isRequired,
  onBarClickCB: PropTypes.func,
  onResetClickCB: PropTypes.func,
  selectedTests: PropTypes.array,
}

AssessmentChart.defaultProps = {
  onResetClickCB: () => {},
  onBarClickCB: () => {},
  selectedTests: [],
}

export default AssessmentChart
