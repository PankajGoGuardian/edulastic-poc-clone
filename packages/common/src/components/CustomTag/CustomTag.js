import { black } from '@edulastic/colors'
import { Tag } from 'antd'
import React from 'react'
import styled from 'styled-components'

const CustomTag = ({ textColor, bgColor, width, textAlign, children }) => {
  return (
    <TagCustom
      textColor={textColor}
      bgColor={bgColor}
      width={width}
      textAlign={textAlign}
    >
      {children}
    </TagCustom>
  )
}

export default CustomTag

const TagCustom = styled(Tag)`
  background: ${({ bgColor }) => bgColor};
  color: ${({ textColor }) => textColor || black};
  border: none;
  width: ${({ width }) => width};
  text-align: ${({ textAlign }) => textAlign};
  line-height: 1.5;
  padding: 4px 10px;
`
