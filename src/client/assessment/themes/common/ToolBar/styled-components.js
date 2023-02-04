import styled, { css } from 'styled-components'
import { Button } from 'antd'
import {
  themeColorBlue,
  white,
  mediumDesktopExactWidth,
} from '@edulastic/colors'
import {
  IconMultiCalculators,
  IconClose,
  IconCursor,
  IconInRuler,
  IconProtactor,
  IconScratchPad,
} from '@edulastic/icons'

export const ToolBarContainer = styled.div`
  margin-left: 0px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  span {
    line-height: 11px;
  }
`

const iOSButtonStyles = css`
  ${({ theme, active }) => css`
    &:focus,
    &:hover {
      background: ${active
        ? theme.default.headerButtonBgHoverColor
        : theme.default.headerButtonBgColor};
      svg {
        fill: ${active
          ? theme.header.headerButtonHoverColor
          : theme.header.headerButtonColor};
        &.multi-calculators {
          stroke: ${active
            ? theme.header.headerButtonHoverColor
            : theme.header.headerButtonColor};
        }
      }
    }
  `}
`

const normalButtonStyles = css`
  ${({ theme, active }) => css`
    &:focus {
      background: ${active
        ? theme.default.headerButtonBgHoverColor
        : theme.default.headerButtonBgColor};
      svg {
        fill: ${active
          ? theme.header.headerButtonHoverColor
          : theme.header.headerButtonColor};
        &.multi-calculators {
          stroke: ${active
            ? theme.header.headerButtonHoverColor
            : theme.header.headerButtonColor};
        }
      }
    }
    &:hover,
    &:active {
      background: ${theme.default.headerButtonBgHoverColor};

      svg {
        fill: ${theme.header.headerButtonHoverColor};
        &.multi-calculators {
          stroke: ${theme.header.headerButtonHoverColor};
        }
      }
    }
  `}
`

export const ButtonWithStyle = styled(Button)`
  border: 1px solid ${white};
  margin-right: 5px;
  border-radius: 5px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 40px;
    width: 40px;
  }

  &:focus {
    outline: 0;
    box-shadow: 0 0 0 2px ${themeColorBlue};
  }

  ${({ theme, active, hidden }) => css`
    display: ${hidden ? 'none' : ''};
    background: ${active
      ? theme.default.headerButtonBgHoverColor
      : theme.default.headerButtonBgColor};
    height: ${theme.default.headerToolbarButtonWidth};
    width: ${theme.default.headerToolbarButtonHeight};

    svg {
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      fill: ${active
        ? theme.header.headerButtonHoverColor
        : theme.header.headerButtonColor};

      &.multi-calculators {
        stroke: ${active
          ? theme.header.headerButtonHoverColor
          : theme.header.headerButtonColor};
      }
    }

    :disabled {
      opacity: 0.4;
      background: ${theme.default.headerButtonBgColor};
    }
  `}
  ${window.isIOS ? iOSButtonStyles : normalButtonStyles}
`

export const CursorIcon = styled(IconCursor)`
  ${({ theme }) => css`
    width: ${theme.default.headerCursorIconWidth};
    height: ${theme.default.headerCursorIconHeight};
  `}
`

export const InRulerIcon = styled(IconInRuler)`
  ${({ theme }) => css`
    width: ${theme.default.headerInRulerIconWidth};
    height: ${theme.default.headerInRulerIconHeight};
  `}
`

export const MultiCalculatorIcon = styled(IconMultiCalculators)`
  ${({ theme }) => css`
    width: ${theme.default.headerMultiCalculatorIconWidth};
    height: ${theme.default.headerMultiCalculatorIconHeight};
    top: 55% !important;
    left: 55% !important;
  `}
`

export const CloseIcon = styled(IconClose)`
  ${({ theme }) => css`
    width: ${theme.default.headerCloseIconWidth};
    height: ${theme.default.headerCloseIconHeight};
  `}
`

export const ProtactorIcon = styled(IconProtactor)`
  ${({ theme }) => css`
    width: ${theme.default.headerProtactorIconWidth};
    height: ${theme.default.headerProtactorIconHeight};
  `}
`

export const ScratchPadIcon = styled(IconScratchPad)`
  ${({ theme }) => css`
    width: ${theme.default.headerScratchPadIconWidth};
    height: ${theme.default.headerScratchPadIconHeight};
  `}
`
