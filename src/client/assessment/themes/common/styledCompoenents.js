import {
  desktopWidth,
  extraDesktopWidthMax,
  largeDesktopWidth,
  mediumDesktopExactWidth,
  smallDesktopWidth,
  themeColor,
  themeColorBlue,
} from '@edulastic/colors'

import { Button } from 'antd'
import styled from 'styled-components'

export const StyledButton = styled(Button)`
  border: none;
  margin-left: 5px;
  background: ${({ theme }) => theme.default.headerRightButtonBgColor};
  color: ${({ theme }) => theme.default.headerRightButtonIconColor};
  height: ${(props) => props.theme.default.headerToolbarButtonWidth};
  width: ${(props) => props.theme.default.headerToolbarButtonHeight};
  border: ${({ theme }) =>
    `1px solid ${theme.default.headerRightButtonBgColor}`};

  svg {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    height: ${(props) => props.theme.default.headerRightButtonFontIconHeight};
    width: ${(props) => props.theme.default.headerRightButtonFontIconWidth};
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
    outline: 0;
    box-shadow: 0 0 0 2px ${themeColorBlue};
  }

  &:hover,
  &:active {
    background: ${({ theme }) => theme.default.headerRightButtonIconColor};
    color: ${({ theme }) => theme.default.headerRightButtonBgColor};
    border: ${({ theme }) =>
      `solid 1px ${theme.default.headerRightButtonBgColor}`};
    svg {
      fill: ${({ theme }) => theme.default.headerRightButtonBgColor};
    }
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 40px;
    width: 40px;
  }
`

export const SaveAndExitButton = styled(StyledButton)`
  width: auto;
  background: ${({ theme }) => theme.default.headerRightButtonBgColor};
  border: ${({ theme }) =>
    `1px solid ${theme.default.headerRightButtonBgColor}`};
  color: ${({ theme }) => theme.default.headerRightButtonIconColor};
  font-size: 12px;
  font-weight: 600;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;

  svg {
    position: relative;
    transform: none;
    top: unset;
    left: unset;
    fill: ${({ theme }) => theme.default.headerRightButtonIconColor};
  }

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.default.headerRightButtonIconColor};
    color: ${({ theme }) => theme.default.headerRightButtonBgColor};
    border: ${({ theme }) =>
      `solid 1px ${theme.default.headerRightButtonBgColor}`};
    svg {
      fill: ${({ theme }) => theme.default.headerRightButtonBgColor};
    }
  }

  &:focus {
    border: none;
    outline: 0;
    box-shadow: 0 0 0 2px ${themeColorBlue};
  }

  span {
    margin-left: 8px;
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    width: auto;
    &.ant-btn {
      height: ${(props) => props.height};
    }
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    margin-left: 5px;
    width: auto;
    &.ant-btn {
      height: ${(props) => props.height};
    }
  }

  @media (max-width: ${smallDesktopWidth}) {
    height: ${(props) => props.height};
  }
`

export const ScratchpadVisibilityToggler = styled(SaveAndExitButton)`
  width: auto !important;
  text-transform: uppercase;
`

export const AdjustScratchpad = styled(SaveAndExitButton)`
  padding: 0px 12px;
`
export const StyledDiv = styled.div`
  height: 40px;
`

export const ImmersiveReaderButton = styled(StyledButton)

export const StyledMenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  fill: ${themeColor};
  font-weight: 550;
`

export const StyledDefaultMenuItem = styled.div`
  background: white;
  width: 180px;
  padding: 10px;
  color: ${themeColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-weight: 550;
`

export const StyledTextForStudent = styled.p`
  font-size: ${({ fontSize }) => fontSize || '16px'};
  font-weight: 550;
  color: ${({ color }) => color || 'black'};
  margin-right: ${({ marginRight }) => marginRight || '15px'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${({ maxWidth }) => maxWidth || '180px'};
  text-transform: uppercase;
  @media (max-width: ${mediumDesktopExactWidth}) {
    max-width: ${({ $timedAssignment }) =>
      $timedAssignment ? '85px' : '130px'};
    margin-right: 0px;
  }
  @media (max-width: ${largeDesktopWidth}) {
    max-width: ${({ $timedAssignment }) =>
      $timedAssignment ? '65px' : '120px'};
  }
  @media (max-width: 1100px) {
    max-width: ${({ $timedAssignment }) =>
      $timedAssignment ? '20px' : '100px'};
  }
  @media (max-width: ${smallDesktopWidth}) {
    max-width: ${({ $timedAssignment }) =>
      $timedAssignment ? '55px' : '85px'};
  }
  @media (max-width: ${desktopWidth}) {
    max-width: ${({ $timedAssignment }) =>
      $timedAssignment ? '20px' : '85px'};
  }
`

export const StyledTextForDropdown = styled.p`
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  @media (max-width: ${smallDesktopWidth}) {
    max-width: ${({ $smallDesktopWidth }) => $smallDesktopWidth || '85px'};
  }
  @media (max-width: ${desktopWidth}) {
    max-width: ${({ $desktopWidth }) => $desktopWidth || '30px'};
  }
`
