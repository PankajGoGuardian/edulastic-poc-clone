import React, { useState } from 'react'
import styled from 'styled-components'
import { themeColor, sectionBorder } from '@edulastic/colors'

import { Popover, Row, Col, Icon } from 'antd'
import { colors as colorConstants } from '@edulastic/constants'

const StyledIcon = styled(Icon)`
  vertical-align: middle;
  margin-top: -20px;
  padding: 0px 5px;
  font-size: 10px;
  cursor: pointer;
  path {
    fill: ${themeColor};
  }
`

export const colors = [...colorConstants.performanceBandColors]

// "#576BA9","#A1C3EA","#F39300","#FEC571","#3DB04E","#74E27A","#AFA515","#EBDD54"
function ColorPicker(props) {
  const { value = '#576BA9' } = props

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
                if (props.onChange) {
                  props.onChange(color)
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
    <div
      style={{ display: 'inline-block', verticalAlign: 'middle', marginTop: 7 }}
    >
      <Popover
        content={content}
        placement="bottom"
        trigger="click"
        visible={visible}
        onVisibleChange={(v) => !props.disabled && setVisible(v)}
      >
        <div
          style={{ width: 20, display: 'inline-block' }}
          onClick={(e) => {
            e.stopPropagation()
            setVisible(true)
          }}
        >
          <ColorBox
            style={{ height: 20, width: 20, display: 'inline-block' }}
            color={value}
          />
        </div>
        <StyledIcon
          onClick={(e) => {
            e.stopPropagation()
            setVisible(true)
          }}
          type="down"
        />
      </Popover>
    </div>
  )
}

const ColorBox = styled.div`
  width: 100%;
  height: 20px;
  box-sizing: border-box;
  border: 1px solid ${sectionBorder};
  margin-bottom: 4px;
  cursor: pointer;
  background-color: ${({ color }) => `${color}`};
`

const ColorBoxContainer = styled.div`
  width: 120px;
`

export default ColorPicker
