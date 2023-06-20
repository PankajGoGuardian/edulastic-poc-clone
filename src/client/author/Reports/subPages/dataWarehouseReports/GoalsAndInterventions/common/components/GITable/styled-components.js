import styled from 'styled-components'
import { black, themeColor } from '@edulastic/colors'
import { IconCharInfo } from '@edulastic/icons'
import { SelectInputStyled } from '@edulastic/common'

export const StyledInfoIcon = styled(IconCharInfo)`
  width: 6px;
  height: 10px;
  position: relative;
  top: -7px;
  left: -2px;
  cursor: pointer;
  & path {
    fill: ${black};
  }
`
export const StyledViewButton = styled.div`
  color: ${themeColor};
  cursor: pointer;
`
export const StyledDropDown = styled(SelectInputStyled)`
  &.ant-select {
    .ant-select-selection {
      border: none;
      background-color: unset;
      &:focus,
      &:hover {
        box-shadow: none !important;
        border: none !important;
        background-color: unset !important;
      }
    }
  }
`
