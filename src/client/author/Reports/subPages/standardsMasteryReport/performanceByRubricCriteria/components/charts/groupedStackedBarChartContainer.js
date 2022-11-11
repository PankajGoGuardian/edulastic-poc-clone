import React from 'react'
import { isEmpty } from 'lodash'
import { GroupedStackedBarChart } from '../../../../../common/components/charts/groupedStackedBarChart'

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
    const barData = payload[barIndex]
    let colorBandComponent = null
    const responsesByRating = barData.payload.responsesByRating
    const ratings = barData.payload.criteria.ratings
    const dataKey = barData.dataKey
    const rating = ratings.filter((r) => r.id === dataKey)[0]
    colorBandComponent = (
      <>
        {ratings
          .map((band) => {
            const color = payload.filter((r) => r.dataKey === band.id)[0].fill
            return (
              <ColorBandItem
                color={color}
                name={`${band.points} | ${band.name}`}
              />
            )
          })
          .reverse()}
      </>
    )
    if (isEmpty(rating)) return null
    return (
      <div>
        <ColorBandItem
          color={barData.fill}
          name={`${rating.points} | ${rating.name}`}
        />
        <TooltipRowItem
          title="Responses:"
          value={`${responsesByRating[dataKey]}/${barData.payload.totalResponsesPerCriteria}`}
        />
        <DashedHr />
        {colorBandComponent}
      </div>
    )
  }
  return null
}

const GroupedStackedBarChartContainer = ({ barsData, renderData }) => {
  const getXTickText = (payload, _data) =>
    _data[payload.index]?.criteriaName || '-'

  const getXTickFill = (payload, _data) =>
    _data[payload.index]?.totalResponsesPerCriteria === 'N/A' ? 'grey' : 'black'

  return (
    <div>
      <GroupedStackedBarChart
        barsData={barsData}
        data={renderData}
        primaryXAxisDataKey="criteriaName"
        yAxisLabel="DISTRIBUTION OF RESPONSES"
        getXTickText={getXTickText}
        getXTickFill={getXTickFill}
        getTooltipJSX={getTooltipJSX}
        hasBarInsideLabels
        hasRoundedBars
        hasBarTopLabels
      />
    </div>
  )
}

export default GroupedStackedBarChartContainer
