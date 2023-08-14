import React, { useEffect, useRef } from 'react'
import { Slider } from 'antd'

const SeekBar = ({ duration, currentTime, style, seekTo, marks = {} }) => {
  const sliderRef = useRef()
  const _handleChange = (value) => {
    seekTo(value)
  }

  useEffect(() => {
    sliderRef.current.rcSlider.setState({ value: currentTime })
  }, [currentTime])

  return (
    <Slider
      marks={marks}
      ref={sliderRef}
      max={duration?.toFixed(4)}
      style={{ ...style }}
      onChange={_handleChange}
      tooltipVisible={false}
    />
  )
}

export default SeekBar
