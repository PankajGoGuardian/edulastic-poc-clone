import styled from 'styled-components'
import { Button } from 'antd'
import {
  boxShadowDefault,
  themeColor,
  lightFadedBlack,
} from '@edulastic/colors'
import { IconClose, IconCalculator } from '@edulastic/icons'

import { Header } from '../common'
import { IPAD_PORTRAIT_WIDTH } from '../../constants/others'

export const Main = styled.main`
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 70px 0px 0px;
  display: flex;
  flex-direction: row;
  min-height: ${({ LCBPreviewModal }) =>
    LCBPreviewModal ? 'calc(100vh - 56px)' : '100vh'};
  box-sizing: border-box;
  margin: 0px;
`

export const MainContent = styled.div`
  background-color: ${(props) => props.theme.mainContentBgColor};
  color: ${(props) => props.theme.mainContentTextColor};
  flex: 1;
  text-align: left;
  font-size: 18px;
  overflow: auto;
  position: relative;

  & * {
    -webkit-touch-callout: none;
    user-select: none;
  }

  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    padding: 24px;
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    overflow: auto;
    height: 100%;
    width: 100%;
    border-style: none;
    border-width: 0px;
  }
`

export const PlayerTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #fff;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const ActionButton = styled(Button)`
  border: none;
  height: 36px;
  font-weight: 600;
  margin-left: 5px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: ${({ theme }) => theme.default.headerRightButtonBgColor};
  color: ${({ theme }) => theme.default.headerRightButtonIconColor};
  border: ${({ theme }) =>
    `1px solid ${theme.default.headerRightButtonBgColor}`};
  width: ${({ iconBtn }) => (iconBtn ? '40px' : null)};
  padding: ${({ iconBtn }) => (iconBtn ? '5px' : '5px 15px')};

  span,
  svg {
    margin: ${({ iconBtn }) => (iconBtn ? 0 : '0px 5px')};
  }

  svg {
    fill: ${({ theme }) => theme.default.headerRightButtonIconColor};
  }

  &:first-child {
    margin-left: 0px;
  }

  &:focus {
    background: ${({ theme }) => theme.default.headerButtonBgColor};
    svg {
      fill: ${({ theme }) => theme.default.headerRightButtonBgColor};
    }
  }

  &:hover,
  &:focus,
  &:active {
    background: ${({ theme }) => theme.default.headerRightButtonIconColor};
    color: ${({ theme }) => theme.default.headerRightButtonBgColor};
    border: ${({ theme }) =>
      `solid 1px ${theme.default.headerRightButtonBgColor}`};
    svg {
      fill: ${({ theme }) => theme.default.headerRightButtonBgColor};
    }
  }

  &.ant-btn[disabled] {
    color: ${lightFadedBlack};
    svg {
      fill: ${lightFadedBlack};
    }
  }
`

export const FlexDisplay = styled.div`
  display: flex;
`

export const ContainerRight = styled.div`
  display: flex;
  margin-left: 40px;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    margin-left: auto;
  }
`

export const HeaderPracticePlayer = styled(Header)`
  background: ${themeColor};
  box-shadow: ${boxShadowDefault};
  height: 70px;
  z-index: 1000;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    height: 104px;
  }
`

export const OverlayDiv = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 9999;
  background: transparent;
`

export const ToolBox = styled.div`
  margin: 0px auto;
`

export const CalculatorIcon = styled(IconCalculator)`
  ${({ theme }) => `
    width: ${theme.default.headerCalculatorIconWidth};
    height: ${theme.default.headerCalculatorIconHeight};
  `}
`

export const CloseIcon = styled(IconClose)`
  ${({ theme }) => `
    width: ${theme.default.headerCloseIconWidth};
    height: ${theme.default.headerCloseIconHeight};
  `}
`

export const ToolButton = styled(Button)`
  border: 1px solid #ffffff;
  margin-right: 10px;
  border-radius: 5px;

  & :hover {
    background: ${({ theme }) => theme.default.headerButtonBgHoverColor};
    & svg {
      fill: ${({ theme }) => theme.header.headerButtonHoverColor};
    }
  }

  ${({ theme, active }) => `
    background: ${
      active
        ? theme.default.headerButtonBgHoverColor
        : theme.default.headerButtonBgColor
    };
    height: ${theme.default.headerToolbarButtonWidth};
    width: ${theme.default.headerToolbarButtonHeight};

    svg {
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      fill: ${
        active
          ? theme.header.headerButtonHoverColor
          : theme.header.headerButtonColor
      };
    }

    :disabled {
      opacity: 0.4;
      background: ${theme.default.headerButtonBgColor};
    }
  `}
`
