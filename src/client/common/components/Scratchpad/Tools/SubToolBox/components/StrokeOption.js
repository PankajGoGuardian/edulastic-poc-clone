import React from 'react'
import { FlexContainer, hexToRGB } from '@edulastic/common'
import ColorPicker from './ColorPicker'
import { Sprite, StyledSelect } from '../../styled'

const { Option } = StyledSelect

const StrokeOption = ({ lineWidth, lineColor, onChangeOption }) => {
  const onChangeLineWidth = (width) => {
    onChangeOption('lineWidth', width)
  }

  const onChangeLineColor = (value) => {
    onChangeOption(
      'lineColor',
      hexToRGB(value.color, (value.alpha ? value.alpha : 1) / 100)
    )
  }

  return (
    <FlexContainer
      id="stroke-options"
      aria-label="Stroke options"
      marginLeft="14px"
      alignItems="center"
    >
      <Sprite pos={-1377} />
      <StyledSelect defaultValue={lineWidth} onChange={onChangeLineWidth}>
        <Option value={4} aria-label="2" aria-selected={lineWidth === 4}>
          2
        </Option>
        <Option value={6} aria-label="3" aria-selected={lineWidth === 6}>
          3
        </Option>
        <Option value={8} aria-label="4" aria-selected={lineWidth === 8}>
          4
        </Option>
        <Option value={10} aria-label="5" aria-selected={lineWidth === 10}>
          5
        </Option>
        <Option value={12} aria-label="6" aria-selected={lineWidth === 12}>
          6
        </Option>
      </StyledSelect>
      <ColorPicker color={lineColor} onChangeColor={onChangeLineColor} />
    </FlexContainer>
  )
}

export default StrokeOption
