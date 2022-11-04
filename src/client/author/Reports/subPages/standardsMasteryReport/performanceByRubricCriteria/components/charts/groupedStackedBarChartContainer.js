import React, { useMemo } from 'react'
import { GroupedStackedBarChart } from '../../../../../common/components/charts/groupedStackedBarChart'
import { getChartData } from '../../utils/transformers'

import {
  TooltipRow,
  TooltipRowTitle,
  TooltipRowValue,
  DashedHr,
  ColorCircle,
  ColorBandRow,
} from '../../../../../common/styled'

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

const getTooltipJSX = (payload, barIndex) => {
  if (payload && payload.length && barIndex !== null) {
    const barData = payload[0].payload
    let colorBandComponent = null
    const colorBandData = []
    const ratings = barData.criteria.ratings
    ratings.forEach((e) => {
      colorBandData.push({ name: e.name, score: barData[e.id] })
    })
    colorBandComponent = (
      <>
        {colorBandData.map((band) => (
          <ColorBandItem
            color="#FFFF00"
            name={`${band.score} | ${band.name}`}
          />
        ))}
      </>
    )
    return (
      <div>
        <TooltipRowItem
          title="Responses:"
          value={barData.totalResponsesPerCriteria}
        />
        <TooltipRowItem
          title="Score:"
          value={`${barData.scorePercentagePerCriteria}%`}
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
    const barData = payload[barIndex]
    const responsesByRating = barData.payload.responsesByRating
    const dataKey = barData.dataKey
    return (
      <div>
        <ColorBandItem
          color={barData.fill}
          name={`${barData.value} | ${barData.name}`}
        />
        <TooltipRowItem title="Responses:" value={responsesByRating[dataKey]} />
      </div>
    )
  }
  return null
}

const GroupedStackedBarChartContainer = ({ barsData, renderData }) => {
  const getXTickText = (payload, _data) => {
    return _data[payload.index]?.criteriaName || '-'
  }

  return (
    <div>
      <GroupedStackedBarChart
        barsData={barsData}
        data={renderData}
        primaryXAxisDataKey="criteriaName"
        secondaryXAxisDataKey="secondaryAxisLabel"
        yAxisLabel="Response %"
        getXTickText={getXTickText}
        getTooltipJSX={getTooltipJSX}
        getRightTooltipJSX={getRightTooltipJSX}
        hasBarInsideLabels
        hasRoundedBars
        hasBarTopLabels
      />
    </div>
  )
}

export default GroupedStackedBarChartContainer
