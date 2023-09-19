import styled from 'styled-components'
import { Button, Dropdown, Icon, Progress } from 'antd'
import { themeColorBlue } from '@edulastic/colors'
import { themes } from '../../../../theme'
import { FlexContainer } from '../../common'

const {
  playerSkin: { sbac },
} = themes
const { defaultButton, navigationButtons, header } = sbac

export const ControlBtn = styled(Button)`
  &[disabled] {
    color: ${defaultButton.disabledColor};
    background: ${defaultButton.background};
    svg {
      fill: ${defaultButton.disabledColor};
    }
  }
  font-size: 11px;
  width: 35px;
  height: 35px;
  border: 1px solid ${navigationButtons.color};
  ${({ style }) => style};
  background: ${navigationButtons.background};
  color: ${navigationButtons.color};
  &:hover {
    border: 1px solid ${defaultButton.hover.background};
    color: ${defaultButton.hover.color};
    background: ${defaultButton.hover.background}!important;
    svg {
      fill: ${defaultButton.hover.color};
    }
  }
  &:focus {
    border: none;
    outline: 0;
    box-shadow: 0 0 0 2px ${themeColorBlue};
  }
  svg {
    fill: ${navigationButtons.color};
  }
`

export const Container = styled.div`
  margin-left: 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  span {
    line-height: 11px;
  }
`

export const HeaderTopMenu = styled.div`
  width: 100%;
  display: flex;
  padding: 8px 21px 8px 13px;
  background: ${header.topMenu.background};
  .ant-dropdown-link {
    min-width: 144px;
    color: ${defaultButton.color};
    text-transform: uppercase;
    font-size: 11px;
    padding-top: 3px;
    .anticon-down {
      margin-left: 48px;
    }
  }
  .ant-dropdown-placement-bottomLeft {
    top: 5px !important;
    ul {
      max-height: 250px;
      overflow: auto;
      text-transform: uppercase;
      li {
        font-size: 13px;
        &:hover {
          background: ${defaultButton.hover.background};
          color: ${defaultButton.hover.color};
        }
      }
      .ant-dropdown-menu-item-disabled {
        color: ${defaultButton.color};
        text-transform: initial;
        .anticon-down {
          margin-right: 0;
          margin-left: 8px;
        }
        &:hover {
          background: white;
          color: ${defaultButton.color};
        }
      }
    }
  }
`

export const StyledFlexContainer = styled(FlexContainer)`
  .sbac-question-audio-controller {
    position: relative;
    height: auto;
    padding: 0;
    margin-left: 5px;
    button {
      width: 35px;
      height: 35px;
      padding: 3px 0 0 0;
      background: ${navigationButtons.background}!important;
      border: 1px solid ${navigationButtons.color};
      float: left;
      &:hover {
        border: 1px solid ${defaultButton.hover.background};
        color: ${defaultButton.hover.color};
        background: ${defaultButton.hover.background}!important;
        svg {
          fill: ${defaultButton.hover.color};
        }
      }
      &:focus {
        background: ${navigationButtons.background} !important;
        border: 1px solid ${navigationButtons.color} !important;
        svg {
          fill: ${navigationButtons.color} !important;
        }
      }
      margin-right: 5px;
      svg {
        fill: ${navigationButtons.color};
      }
      .audio-pause {
        fill: ${defaultButton.audioPauseColor};
      }
      .anticon-loading {
        position: relative;
        left: 0;
        top: 0;
      }
    }
  }
  svg {
    font-size: 13px;
  }
  .sbac-toolbar {
    button {
      padding-top: 3px;
      margin-left: 5px;
    }
  }
`

export const StyledDropdown = styled(Dropdown)`
  background: transparent;
  border: none;
  height: 19px;
  display: flex;
  align-items: center;
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 2px ${themeColorBlue};
  }
`

export const StyledIcon = styled(Icon)`
  color: #00ad50;
`

export const StyledProgress = styled(Progress)`
  .ant-progress-success-bg,
  .ant-progress-bg {
    height: 13px !important;
  }
`

export const StyledTitle = styled.div`
  letter-spacing: 0.2px;
  color: ${defaultButton.color};
  text-transform: uppercase;
  font-size: 11px;
  margin-left: 30px;
`

export const StyledQuestionMark = styled(Icon)`
  width: 16px;
  height: 16px;
  color: ${defaultButton.questionMarkColor};
  cursor: pointer;
`

export const StyledButton = styled(Button)`
  width: 35px;
  height: 35px;
  padding: ${({ padding }) => padding || 0};
  border: 1px solid ${navigationButtons.color};
  svg {
    width: 18px;
    height: 18px;
    fill: ${defaultButton.hover.background};
  }
  &:hover {
    border: 1px solid ${defaultButton.hover.background};
    color: ${defaultButton.hover.color};
    background: ${defaultButton.hover.background}!important;
    svg {
      fill: ${defaultButton.hover.color};
    }
  }
  &:focus {
    border: none;
    outline: 0;
    box-shadow: 0 0 0 2px ${themeColorBlue};
  }
  ${({ active }) =>
    active &&
    `border: 1px solid ${defaultButton.hover.background};
  color: ${defaultButton.hover.color};
  background: ${defaultButton.hover.background}!important;
  svg {
    fill: ${defaultButton.hover.color};
  }`}
`
