import { mediumDesktopExactWidth, themeColorBlue } from '@edulastic/colors'
import { questionType, test } from '@edulastic/constants'
import {
  IconCalculator,
  IconClose,
  IconCursor,
  IconInRuler,
  IconMagnify,
  IconProtactor,
  IconScratchPad,
  IconCloudUpload,
  IconReferenceSheet,
} from '@edulastic/icons'
import { Button } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { Tooltip } from '../../../common/utils/helpers'
import LineReader from '../../../common/components/LineReader'

const { calculatorTypes } = test

export const Container = styled.div`
  margin-left: 0px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  span {
    line-height: 11px;
  }
`

export const ButtonWithStyle = styled(Button)`
  border: 1px solid #ffffff;
  margin-right: 5px;
  border-radius: 5px;
  ${(props) => props.hidden && 'display:none;'}
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

${({ theme, active }) =>
    window.isIOS
      ? `
      &:focus, &:hover{
            background: ${
              active
                ? theme.default.headerButtonBgHoverColor
                : theme.default.headerButtonBgColor
            };
            svg{
              fill: ${
                active
                  ? theme.header.headerButtonHoverColor
                  : theme.header.headerButtonColor
              };
            }
          }
      `
      : `
      &:focus{
      background: ${
        active
          ? theme.default.headerButtonBgHoverColor
          : theme.default.headerButtonBgColor
      };
      svg{
        fill: ${
          active
            ? theme.header.headerButtonHoverColor
            : theme.header.headerButtonColor
        };
      }
    }
    &:hover,
    &:active {
      background: ${theme.default.headerButtonBgHoverColor};

      svg {
        fill: ${theme.header.headerButtonHoverColor};
      }
    }

`}

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 40px;
    width: 40px;
  }

  &:focus {
    outline: 0;
    box-shadow: 0 0 0 2px ${themeColorBlue};
  }
`

const CursorIcon = styled(IconCursor)`
  ${({ theme }) => `
    width: ${theme.default.headerCursorIconWidth};
    height: ${theme.default.headerCursorIconHeight};
  `}
`

const InRulerIcon = styled(IconInRuler)`
  ${({ theme }) => `
    width: ${theme.default.headerInRulerIconWidth};
    height: ${theme.default.headerInRulerIconHeight};
  `}
`

export const CaculatorIcon = styled(IconCalculator)`
  ${({ theme }) => `
    width: ${theme.default.headerCaculatorIconWidth};
    height: ${theme.default.headerCaculatorIconHeight};
  `}
`

const CloseIcon = styled(IconClose)`
  ${({ theme }) => `
    width: ${theme.default.headerCloseIconWidth};
    height: ${theme.default.headerCloseIconHeight};
  `}
`

const ProtactorIcon = styled(IconProtactor)`
  ${({ theme }) => `
    width: ${theme.default.headerProtactorIconWidth};
    height: ${theme.default.headerProtactorIconHeight};
  `}
`

const ScratchPadIcon = styled(IconScratchPad)`
  ${({ theme }) => `
    width: ${theme.default.headerScratchPadIconWidth};
    height: ${theme.default.headerScratchPadIconHeight};
  `}
`

const ActionButton = ({ title, icon, ...rest }) => (
  <Tooltip placement="top" title={title}>
    <ButtonWithStyle {...rest}>{icon}</ButtonWithStyle>
  </Tooltip>
)

const CROSS_OUT_QUES = [
  questionType.MULTIPLE_CHOICE,
  questionType.CHOICE_MATRIX,
]

const ToolBar = ({
  settings,
  tool = [],
  qType,
  handleMagnifier,
  openReferenceModal,
  isShowReferenceModal,
  allowReferenceMaterial,
  enableMagnifier,
  toggleUserWorkUploadModal,
  changeTool,
  hasDrawingResponse,
  isPremiumContentWithoutAccess = false,
}) => {
  const {
    calcType,
    showMagnifier,
    enableScratchpad,
    isTeacherPremium,
  } = settings
  const isDisableCrossBtn = !CROSS_OUT_QUES.includes(qType)

  const toolbarHandler = (value) => () => {
    changeTool(value)
  }

  return (
    <Container>
      <ActionButton
        disabled={isPremiumContentWithoutAccess}
        title="Pointer"
        icon={<CursorIcon />}
        active={tool.includes(0)}
        onClick={toolbarHandler(0)}
        hidden
      />
      <ActionButton
        disabled={isPremiumContentWithoutAccess}
        title="Ruler"
        icon={<InRulerIcon />}
        active={tool.includes(1)}
        onClick={toolbarHandler(1)}
        hidden
      />
      {calcType !== calculatorTypes.NONE && (
        <ActionButton
          disabled={isPremiumContentWithoutAccess}
          title="Calculator"
          icon={<CaculatorIcon />}
          active={tool.includes(2)}
          onClick={toolbarHandler(2)}
        />
      )}
      {allowReferenceMaterial && (
        <ActionButton
          disabled={isPremiumContentWithoutAccess}
          title="Reference Sheet"
          icon={<IconReferenceSheet />}
          active={isShowReferenceModal}
          onClick={openReferenceModal}
        />
      )}
      <ActionButton
        title={
          isDisableCrossBtn
            ? 'This option is available only for multiple choice and matching questions'
            : 'Crossout'
        }
        icon={<CloseIcon />}
        active={tool.includes(3)}
        onClick={toolbarHandler(3)}
        disabled={isDisableCrossBtn || isPremiumContentWithoutAccess}
      />
      <ActionButton
        disabled={isPremiumContentWithoutAccess}
        title="Protactor"
        icon={<ProtactorIcon />}
        active={tool.includes(4)}
        onClick={toolbarHandler(4)}
        hidden
      />

      {enableScratchpad && !hasDrawingResponse && (
        <ActionButton
          disabled={isPremiumContentWithoutAccess}
          title="Scratch Pad"
          icon={<ScratchPadIcon />}
          active={tool.includes(5)}
          onClick={toolbarHandler(5)}
        />
      )}
      {showMagnifier && (
        <ActionButton
          disabled={isPremiumContentWithoutAccess}
          title="Magnify"
          icon={<IconMagnify />}
          active={enableMagnifier}
          onClick={handleMagnifier}
        />
      )}
      {isTeacherPremium && (
        <ActionButton
          disabled={isPremiumContentWithoutAccess}
          title="Upload work"
          icon={<IconCloudUpload />}
          onClick={toggleUserWorkUploadModal}
        />
      )}
      <LineReader btnComponent={ButtonWithStyle} />
    </Container>
  )
}

ToolBar.propTypes = {
  tool: PropTypes.array.isRequired,
  changeTool: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  qType: PropTypes.string.isRequired,
}

export default ToolBar
