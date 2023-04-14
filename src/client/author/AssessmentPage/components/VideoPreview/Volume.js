import React from 'react'

import { Slider } from 'antd'

const Volume = ({ style, volume, volumeTo }) => {
  const _handleChange = (value) => {
    volumeTo(value)
  }
  return (
    <Slider
      min={0}
      max={1}
      step={0.01}
      value={volume}
      style={{ width: 100, ...style }}
      onChange={_handleChange}
      tooltipVisible={false}
    />
  )
}

export default Volume
