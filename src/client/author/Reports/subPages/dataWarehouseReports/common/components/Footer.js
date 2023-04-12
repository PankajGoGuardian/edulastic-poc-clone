import { EduIf } from '@edulastic/common'
import React from 'react'
import { StyledText } from './styledComponents'

const Footer = ({ value, period = '', getFooter }) => {
  const [Icon, color] = getFooter(value)
  const footerText = value === 0 ? 'No Change' : Math.abs(value)
  return (
    <>
      <StyledText color={color}>
        {footerText}{' '}
        <EduIf condition={Icon}>
          <Icon color={color} />
        </EduIf>
      </StyledText>
      <StyledText>{period}</StyledText>
    </>
  )
}

export default Footer
