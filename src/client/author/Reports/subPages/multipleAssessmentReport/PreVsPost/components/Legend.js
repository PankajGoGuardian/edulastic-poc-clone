import React from 'react'
import { map } from 'lodash'
import { ColorCircle } from '../../../../common/styled'
import { LegendWrapper } from '../common/styled'

const PreVsPostLegend = ({ selectedPerformanceBand }) => {
  const legend = (
    <LegendWrapper>
      {map(selectedPerformanceBand, (pb) => (
        <div style={{ margin: '20px', display: 'flex' }}>
          <ColorCircle color={pb.color} />
          <span>{pb.name}</span>
        </div>
      ))}
    </LegendWrapper>
  )
  return legend
}

export default PreVsPostLegend
