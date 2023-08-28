import { black } from '@edulastic/colors'
import React from 'react'
import styled from 'styled-components'

const CustomNotificationBar = ({
  textColor,
  bgColor,
  width,
  textAlign,
  children,
}) => {
  return (
    <CustomNotification
      textColor={textColor}
      bgColor={bgColor}
      width={width}
      textAlign={textAlign}
    >
      {children}
    </CustomNotification>
  )
}

export default CustomNotificationBar

const CustomNotification = styled.div`
  background: ${({ bgColor }) => bgColor};
  color: ${({ textColor }) => textColor || black};
  border: none;
  width: ${({ width }) => width};
  text-align: ${({ textAlign }) => textAlign};
  line-height: 1.5;
  padding: 4px 10px;
`
