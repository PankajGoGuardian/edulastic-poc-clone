import styled from 'styled-components'
import {
  white,
  green,
  greyThemeDark2,
  greyThemeLight,
  themeColor,
  themeColorHoverBlue,
} from '@edulastic/colors'
import { Button } from 'antd'

export const CustomStyleBtn = styled(Button)`
  &.ant-btn {
    background: ${(props) =>
      props.ghost ? 'transparent' : props.bg || themeColor};
    color: ${(props) => (props.ghost ? themeColor : props.color || white)};
    width: ${(props) => props.width || '136px'};
    height: ${(props) => props.height || '28px'};
    padding: ${(props) => props.padding || '0px 30px'};
    margin: ${(props) => props.margin || '15px 0px 0px'};
    border: ${(props) =>
      props.ghost ? `1px solid ${greyThemeDark2}` : '0px'} !important;
    border-radius: ${(props) => (props.rounded ? '15px' : '4px')};
    display: ${(props) => props.display || 'flex'};
    align-items: ${(props) => props.alignItems || 'center'};
    justify-content: ${(props) => props.justifyContent || 'center'};
    cursor: pointer;
    text-transform: uppercase;
    font-size: ${(props) => props.theme.common.addNewChoiceButtonFontSize};
    font-weight: ${(props) => props.theme.common.addNewChoiceButtonFontWeight};
    letter-spacing: 0.2px;
    ${(props) => props.style};

    &:disabled {
      cursor: not-allowed;
      color: ${greyThemeLight};
    }

    & div,
    & span {
      font-size: ${(props) => props.theme.common.addNewChoiceButtonFontSize};
    }

    & svg {
      stroke: ${(props) => (props.ghost ? themeColor : props.color || white)};
      fill: ${(props) => (props.ghost ? themeColor : props.color || white)};
      margin-right: 10px;
    }

    &:hover,
    &:focus,
    &:active {
      background: ${(props) =>
        props.ghost ? 'transparent' : props.bg || themeColorHoverBlue};
      color: ${(props) => (props.ghost ? themeColor : props.color || white)};
    }
  }
`

export const CustomStyleBtn2 = styled(CustomStyleBtn)`
  &:disabled {
    &:hover,
    &:focus {
      box-shadow: none;
      color: ${(props) =>
        props.ghost ? greyThemeLight : props.color || white};
    }
  }
`

export const AddAlternative = styled.div`
  width: 100%;
  /* float: right; */
  position: relative;
  z-index: 1;
`

export const AlternateAnswerLink = styled(Button)`
  &.ant-btn {
    background: transparent;
    color: ${greyThemeDark2};
    padding: 0px 12px;
    box-shadow: none;
    /* margin-left: auto; */
    min-height: 34px;
    text-transform: uppercase;
    font-size: 11px;
    outline: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    border: 1px solid transparent !important;

    &:hover,
    &:active,
    &:visited {
      background: transparent;
      color: ${greyThemeDark2};
      outline: none !important;
      box-shadow: none !important;
    }

    &:focus {
      border: 1px solid ${green} !important;
    }
  }
`
