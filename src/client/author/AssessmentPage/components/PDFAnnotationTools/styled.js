import styled from 'styled-components'
import {
  themeColorBlue,
  title,
  white,
  greyThemeDark2,
  themeColorHoverBlue,
} from '@edulastic/colors'

export const ToolsWrapper = styled.div`
  background: ${({ active }) => active && themeColorBlue};
  width: auto;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: ${({ border }) => border && '1px solid #D8D8D8'};
  border-right: ${({ border }) => border && '1px solid #D8D8D8'};
`

export const ToolWrapper = styled.div`
  background: ${({ active }) => active && themeColorBlue};
  width: 50px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => disabled && 'not-allowed'};

  svg {
    fill: ${({ active, disabled }) =>
      disabled ? greyThemeDark2 : active ? white : title};
    path {
      fill: ${({ active, disabled }) =>
        disabled ? greyThemeDark2 : active ? white : title};
    }
  }

  &:hover {
    background: ${({ disabled }) => !disabled && themeColorHoverBlue};
    svg {
      fill: ${({ disabled }) => (disabled ? greyThemeDark2 : white)};
      path {
        fill: ${({ disabled }) => (disabled ? greyThemeDark2 : white)};
      }
    }
  }
`

export const ColorPickerWrapper = styled.div`
  background: #f1f1f1;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  .rc-color-picker-wrap > .rc-color-picker-trigger,
  .rc-color-picker-wrap {
    width: 25px !important;
    height: 25px !important;
  }
`

export const FontPickerWrapper = styled.div`
  background: #f1f1f1;
  width: 55px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`
