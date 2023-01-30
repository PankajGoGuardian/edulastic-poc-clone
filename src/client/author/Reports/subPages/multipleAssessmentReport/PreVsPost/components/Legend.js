import React from 'react'
import { map } from 'lodash'
import { ColorCircle } from '../../../../common/styled'
import { LegendWrapper } from '../common/styledComponents'

const PreVsPostLegend = ({ selectedPerformanceBand }) => {
  const legend = map(selectedPerformanceBand, (pb) => {
    const { name, color } = pb
    return (
      <div style={{ marginInline: '20px', display: 'flex' }}>
        <ColorCircle color={color} />
        <span
          style={{
            fontSize: '12px',
            marginLeft: '8px',
            fontWeight: 'bold',
          }}
        >
          {name}
        </span>
      </div>
    )
  })
  return <LegendWrapper>{legend}</LegendWrapper>
}

export default PreVsPostLegend
