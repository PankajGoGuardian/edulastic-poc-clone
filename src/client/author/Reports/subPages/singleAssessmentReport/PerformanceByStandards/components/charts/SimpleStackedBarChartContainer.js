import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { find, round, get } from 'lodash'

import { reportUtils } from '@edulastic/constants'

import { SimpleStackedBarChart } from '../../../../../common/components/charts/simpleStackedBarChart'
import BarTooltipRow from '../../../../../common/components/tooltip/BarTooltipRow'

const { addColors } = reportUtils.common

const {
  viewByMode,
  analyzeByMode,
  getYLabelString,
  getChartScoreData,
} = reportUtils.performanceByStandards

const SimpleStackedBarChartContainer = ({
  report,
  viewBy,
  analyzeBy,
  onBarClick,
  selectedData,
  onResetClick,
}) => {
  const xDataKey = viewBy === viewByMode.STANDARDS ? 'standardId' : 'domainId'
  const barDataKey = 'avgScore'
  const ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

  let formattedData = useMemo(() => getChartScoreData(report, viewBy), [
    report,
    viewBy,
  ])

  const data = useMemo(() => {
    return addColors(formattedData, selectedData, xDataKey)
  }, [formattedData, selectedData, xDataKey])

  formattedData = data.sort((a, b) => a[xDataKey] - b[xDataKey])

  const yTickformatLabel = (score) => {
    switch (analyzeBy) {
      case analyzeByMode.SCORE:
        return `${Math.round(Number(score))}%`
      case analyzeByMode.RAW_SCORE:
        return ''
      default:
    }
  }

  const barsLabelFormatter = (value, index, startIndex = 0, x) => {
    switch (analyzeBy) {
      case analyzeByMode.SCORE:
        return yTickformatLabel(value)
      case analyzeByMode.RAW_SCORE:
        return (
          <>
            <tspan x={x + 20} dy="-15">
              {round(formattedData[startIndex + index].rawScore, 2)}
            </tspan>
            <tspan x={x + 20} dy="2">
              _____
            </tspan>
            <tspan x={x + 20} dy="15">
              {round(formattedData[startIndex + index].maxScore, 2)}
            </tspan>
          </>
        )
      default:
    }
  }

  const getXTickText = (payload) => {
    const currentBarData =
      find(data, (item) => item[xDataKey] === payload.value) || {}
    return currentBarData.name || ''
  }

  const getXTickTooltipText = (payload, chartData) => {
    const { name = '', domainDesc = '', standardDesc = '' } =
      find(chartData, (item) => item[xDataKey] === payload.value) || {}
    const desc = viewBy === viewByMode.STANDARDS ? standardDesc : domainDesc
    return (
      <div>
        <b>{name}:</b> {desc}
      </div>
    )
  }

  const _onBarClickCB = (key) => {
    const clickedBarData = find(data, (item) => item[xDataKey] === key) || {}
    onBarClick(clickedBarData)
  }

  const getTooltipJSX = (payload, barIndex) => {
    if (payload && payload.length && barIndex !== null) {
      const { name = '', domainDesc, standardDesc } = payload[0].payload

      let lastItem = null

      switch (analyzeBy) {
        case analyzeByMode.SCORE:
          lastItem = {
            title: 'Avg. Score (%) : ',
            value: `${round(payload[0].value)}%`,
          }
          break
        case analyzeByMode.RAW_SCORE:
          lastItem = {
            title: 'Avg. Score : ',
            value: `${round(payload[0].payload.rawScore, 2)} / ${
              payload[0].payload.maxScore
            }`,
          }
          break
        default:
      }

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
            title="Total Points : "
            value={get(payload[0], 'payload.totalMaxScore', '')}
          />
          <BarTooltipRow
            title="Total Score : "
            value={get(payload[0], 'payload.totalTotalScore', '')}
          />
          {lastItem && <BarTooltipRow {...lastItem} />}
        </div>
      )
    }
    return false
  }

  return (
    <SimpleStackedBarChart
      data={formattedData}
      xAxisDataKey={xDataKey}
      bottomStackDataKey={barDataKey}
      topStackDataKey="diffScore"
      yAxisLabel={getYLabelString(analyzeBy)}
      getXTickText={getXTickText}
      getXTickTooltipText={getXTickTooltipText}
      xTickTooltipStyles={{ textAlign: 'left' }}
      getTooltipJSX={getTooltipJSX}
      yTickFormatter={yTickformatLabel}
      barsLabelFormatter={barsLabelFormatter}
      onBarClickCB={_onBarClickCB}
      ticks={ticks}
      onResetClickCB={onResetClick}
      filter={selectedData}
    />
  )
}

SimpleStackedBarChartContainer.propTypes = {
  viewBy: PropTypes.string.isRequired,
  analyzeBy: PropTypes.string.isRequired,
  onBarClick: PropTypes.func.isRequired,
  onResetClick: PropTypes.func.isRequired,
  report: PropTypes.object,
  selectedData: PropTypes.array,
}

SimpleStackedBarChartContainer.defaultProps = {
  report: {
    metricInfo: [],
    skillInfo: [],
    studInfo: [],
    teacherInfo: [],
  },
  selectedData: [],
}

export default SimpleStackedBarChartContainer
