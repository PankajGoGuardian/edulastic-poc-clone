import React, { useState } from 'react'

import { Popover, Row, Col } from 'antd'
import { ColorBox, ColorBoxContainer, StyledInnerButton } from './styled/Radio'
import { SCALE_COLORS } from '../constants'

export const colors = [...SCALE_COLORS]

function ColorPicker(props) {
  const {
    option: { bgColor },
    label,
    onChange,
  } = props

  const [visible, setVisible] = useState(false)

  const content = (
    <ColorBoxContainer>
      <Row gutter={4}>
        {colors.map((color) => (
          <Col span={6}>
            <ColorBox
              color={color}
              onClick={(e) => {
                e.stopPropagation()
                if (onChange) {
                  onChange(color)
                }
                setVisible(false)
              }}
            />
          </Col>
        ))}
      </Row>
    </ColorBoxContainer>
  )

  return (
    <Popover
      content={content}
      placement="bottom"
      trigger="click"
      visible={visible}
      onVisibleChange={(v) => setVisible(v)}
    >
      <StyledInnerButton
        className="inner"
        onClick={(e) => {
          e.stopPropagation()
          setVisible(true)
        }}
        width="30px"
        height="30px"
        left="-21px"
        top="-21px"
        bgColor={bgColor}
        margin="20px"
      >
        {label}
      </StyledInnerButton>
    </Popover>
  )
}

export default ColorPicker
