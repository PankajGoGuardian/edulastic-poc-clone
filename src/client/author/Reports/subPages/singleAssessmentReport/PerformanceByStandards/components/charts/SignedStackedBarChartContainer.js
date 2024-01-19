import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { find, forEach } from 'lodash'

import { reportUtils } from '@edulastic/constants'

import { SignedStackedBarChart } from '../../../../../common/components/charts/signedStackedBarChart'
import BarTooltipRow from '../../../../../common/components/tooltip/BarTooltipRow'

const {
  viewByMode,
  analyzeByMode,
  getYLabelString,
  getChartMasteryData,
} = reportUtils.performanceByStandards

const getSelectedItems = (items) => {
  const selectedItems = {}

  forEach(items, (item) => {
    selectedItems[item] = true
  })

  return selectedItems
}

const dataParser = (data, scaleInfo) => {
  return data.map((item) => {
    for (let i = 0; i < scaleInfo.length; i++) {
      item[`fill_${i}`] = scaleInfo[i].color
    }
    return { ...item }
  })
}

const yTickFormatter = () => {
  return ''
}

const barsLabelFormatter = (val) => {
  if (val >= 12 || val <= -12) {
    return `${Math.abs(val)}%`
  }
  return ''
}

const getChartSpecifics = (analyzeBy, scaleInfo) => {
  scaleInfo.sort((a, b) => {
    return a.threshold - b.threshold
  })

  const barsData = []

  for (const [_, value] of scaleInfo.entries()) {
    barsData.push({
      key: `${value.masteryLabel} Percentage`,
      stackId: 'a',
      fill: value.color,
      unit: '%',
      name: value.masteryName,
    })
  }
  return {
    barsData,
    yAxisLabel: getYLabelString(analyzeBy),
  }
}

const SignedStackedBarChartContainer = ({
  report,
  selectedData,
  onBarClick,
  onResetClick,
  viewBy,
  analyzeBy,
}) => {
  const { scaleInfo } = report
  const xAxisDataKey =
    viewBy === viewByMode.STANDARDS ? 'standardId' : 'domainId'

  const orderedScaleInfo = scaleInfo.sort((a, b) => {
    return a.threshold - b.threshold
  })

  const leastScale = orderedScaleInfo[0]

  const parsedGroupedMetricData = useMemo(
    () => getChartMasteryData(report, viewBy, leastScale),
    [report, viewBy, leastScale]
  )

  const chartData = useMemo(
    () => dataParser(parsedGroupedMetricData, orderedScaleInfo),
    [report, viewBy, analyzeBy]
  )

  const getTooltipJSX = (payload, barIndex) => {
    if (payload && payload.length && barIndex !== null) {
      const { name = '', domainDesc, standardDesc } = payload[0].payload
      return (
        <div>
          <BarTooltipRow
            title={`${
              viewBy === viewByMode.STANDARDS ? 'Standard' : 'Domain'
            } : `}
            value={name}
          />
          <BarTooltipRow
            title="Description: "
            value={viewBy === viewByMode.STANDARDS ? standardDesc : domainDesc}
            contentAlign="left"
          />
          <BarTooltipRow
            title={`Mastery ${
              analyzeBy === analyzeByMode.MASTERY_LEVEL ? 'Level' : 'Score'
            } : `}
            value={payload[barIndex].name}
          />
          <BarTooltipRow
            title="Student (%): "
            value={`${Math.abs(payload[barIndex].value)}%`}
          />
        </div>
      )
    }
    return false
  }

  const _onBarClickCB = (key) => {
    const clickedBarData =
      find(chartData, (item) => item[xAxisDataKey] === key) || {}
    onBarClick(clickedBarData)
  }

  const _onResetClickCB = () => {
    onResetClick()
  }

  const getXTickText = (payload, data) => {
    const currentBarData =
      find(data, (item) => item[xAxisDataKey] === payload.value) || {}
    return currentBarData.name || ''
  }

  const getXTickTooltipText = (payload, data) => {
    const { name = '', domainDesc = '', standardDesc = '' } =
      find(data, (item) => item[xAxisDataKey] === payload.value) || {}
    const desc = viewBy === viewByMode.STANDARDS ? standardDesc : domainDesc
    return (
      <div>
        <b>{name}:</b> {desc}
      </div>
    )
  }

  const chartSpecifics = getChartSpecifics(analyzeBy, orderedScaleInfo)

  return (
    <SignedStackedBarChart
      data={chartData}
      barsData={chartSpecifics.barsData}
      xAxisDataKey={xAxisDataKey}
      getTooltipJSX={getTooltipJSX}
      onBarClickCB={_onBarClickCB}
      onResetClickCB={_onResetClickCB}
      getXTickText={getXTickText}
      getXTickTooltipText={getXTickTooltipText}
      xTickTooltipStyles={{ textAlign: 'left' }}
      yAxisLabel={chartSpecifics.yAxisLabel}
      yTickFormatter={yTickFormatter}
      barsLabelFormatter={barsLabelFormatter}
      filter={getSelectedItems(selectedData)}
      xTickTooltipPosition={490}
      margin={{ top: 0, right: 60, left: 20, bottom: 0 }}
    />
  )
}

SignedStackedBarChartContainer.propTypes = {
  viewBy: PropTypes.string.isRequired,
  analyzeBy: PropTypes.string.isRequired,
  onBarClick: PropTypes.func.isRequired,
  onResetClick: PropTypes.func.isRequired,
  report: PropTypes.object,
  selectedData: PropTypes.array,
}

SignedStackedBarChartContainer.defaultProps = {
  report: {
    metricInfo: [],
    skillInfo: [],
    studInfo: [],
    teacherInfo: [],
  },
  selectedData: [],
}

export default SignedStackedBarChartContainer
