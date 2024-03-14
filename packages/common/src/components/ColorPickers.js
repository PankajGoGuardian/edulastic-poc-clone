import React, { useState } from 'react'
import { Popover, Row, Col } from 'antd'
import styled from 'styled-components'
import { sectionBorder } from '@edulastic/colors'

function ColorPicker(props) {
  const {
    colors,
    onChange,
    disabled = false,
    componentToRender,
    gutter = 4,
    span = 6,
    width,
  } = props
  const [visible, setVisible] = useState(false)

  const Component = componentToRender

  const content = (
    <ColorBoxContainer width={width}>
      <Row gutter={gutter}>
        {colors.map((color) => (
          <Col span={span}>
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

  const openColorPicker = (e) => {
    e.stopPropagation()
    setVisible(true)
  }

  return (
    <Popover
      content={content}
      placement="bottom"
      trigger="click"
      visible={visible}
      onVisibleChange={(v) => !disabled && setVisible(v)}
    >
      <Component onClick={openColorPicker} />
    </Popover>
  )
}

export default ColorPicker

export const ColorBox = styled.div`
  width: 100%;
  height: 20px;
  box-sizing: border-box;
  border: 1px solid ${sectionBorder};
  margin-bottom: 4px;
  cursor: pointer;
  background-color: ${({ color }) => `${color}`};
`

export const ColorBoxContainer = styled.div`
  width: ${({ width }) => width || '120px'};
`
