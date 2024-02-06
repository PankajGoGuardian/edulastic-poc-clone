import React, { useEffect } from 'react'
import { Slider } from 'antd'
import styled from 'styled-components'
import { notification } from '@edulastic/common'

const SeekBar = ({
  duration,
  currentTime,
  style,
  seekTo,
  marks = {},
  sliderRef,
  handleSetIsSeekBarFocused,
  vqPreventSkipping,
}) => {
  const _handleChange = (value) => {
    if (!vqPreventSkipping || value <= currentTime) {
      seekTo(value)
    } else {
      notification({ type: 'info', messageKey: 'preventVQForwardSeek' })
    }
  }

  useEffect(() => {
    sliderRef.current.rcSlider.setState({ value: currentTime })
  }, [currentTime])

  return (
    <StyledSlider
      marks={duration && marks}
      ref={sliderRef}
      max={duration?.toFixed(4)}
      style={{ ...style }}
      onChange={_handleChange}
      tooltipVisible={false}
      onFocus={() => {
        handleSetIsSeekBarFocused(true)
      }}
      onBlur={() => {
        handleSetIsSeekBarFocused(false)
      }}
    />
  )
}

const StyledSlider = styled(Slider)`
  .ant-slider-dot{
    top: -4px;
    width: 12px;
    height: 12px;
    background-color: #1bb394;
    border-color: #ffffff !important;
    ant-slider-dot
    ant-slider-dot
  }

  .ant-slider-mark-text{
    color: white;
    font-weight: bold;
  }
`

export default SeekBar
