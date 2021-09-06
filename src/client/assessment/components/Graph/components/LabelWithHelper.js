import React from 'react'
import styled from 'styled-components'
import { IconCharInfo } from '@edulastic/icons'
import { Label } from '../../../styled/WidgetOptions/Label'

const LabelWithHelper = ({ helperKey, children }) => (
  <Label>
    {children}
    {helperKey && (
      <IconWrapper>
        <InfoIcon />
      </IconWrapper>
    )}
  </Label>
)

export default LabelWithHelper

const IconWrapper = styled.span`
  position: relative;
`

const InfoIcon = styled(IconCharInfo)`
  width: 6px;
  height: 10px;
  position: absolute;
  top: -4px;
  left: -2px;
  cursor: pointer;
`
