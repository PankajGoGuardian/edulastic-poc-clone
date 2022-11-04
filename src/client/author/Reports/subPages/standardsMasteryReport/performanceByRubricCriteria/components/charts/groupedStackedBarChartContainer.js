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
  console.log('payload', payload)
  console.log('index', barIndex)
  // if (payload && payload.length && barIndex !== null) {
  //   const barData = payload[0].payload
  //   let colorBandComponent = null
  //   if (barData.externalTestType) {
  //     const achievementLevels = [...barData.achievementLevelBands].reverse()
  //     colorBandComponent = (
  //       <>
  //         <TooltipRowItem title={`${achievementLevels.length} color band`} />
  //         {achievementLevels.map((band) => (
  //           <ColorBandItem
  //             highlight={band.active}
  //             color={band.color}
  //             name={band.name}
  //           />
  //         ))}
  //       </>
  //     )
  //   } else {
  //     colorBandComponent = (
  //       <ColorBandItem color={barData.band.color} name={barData.band.name} />
  //     )
  //   }
  //   return (
  //     <div>
  //       <TooltipRowItem
  //         title="Score:"
  //         value={
  //           barData.externalTestType
  //             ? barData.totalScore
  //             : `${round(barData.averageScore, 2)}%`
  //         }
  //       />
  //       <DashedHr />
  //       {colorBandComponent}
  //     </div>
  //   )
  // }
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
        hasBarInsideLabels
        hasRoundedBars
        hasBarTopLabels
      />
    </div>
  )
}

export default GroupedStackedBarChartContainer
