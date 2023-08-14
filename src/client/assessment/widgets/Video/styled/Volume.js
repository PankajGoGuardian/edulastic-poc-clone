import React from 'react'
import { withMediaProps } from 'react-media-player'

import { Slider } from 'antd'

const Volume = ({ style, media }) => {
  const _handleChange = (value) => {
    media.setVolume((+value).toFixed(4))
  }
  return (
    <Slider
      min={0}
      max={1}
      step={0.01}
      value={media.volume}
      style={{ width: '100px', ...style }}
      onChange={_handleChange}
      tooltipVisible={false}
    />
  )
}

export default withMediaProps(Volume)
