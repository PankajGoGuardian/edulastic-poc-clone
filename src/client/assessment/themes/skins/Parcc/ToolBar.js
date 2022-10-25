import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button } from 'antd'
import { TokenStorage } from '@edulastic/api'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { test, questionType } from '@edulastic/constants'
import {
  IconCalculator,
  IconClose,
  IconScratchPad,
  IconCloudUpload,
  IconCheck,
} from '@edulastic/icons'
import { extraDesktopWidthMax, white, themeColorBlue } from '@edulastic/colors'
import { Tooltip } from '../../../../common/utils/helpers'
import { Container } from './styled'
import { themes } from '../../../../theme'
import TimedTestTimer from '../../common/TimedTestTimer'

const {
  playerSkin: { parcc },
} = themes
const { tools } = parcc

const { calculatorTypes } = test
const ToolBar = ({
  settings = {},
  tool = [],
  changeTool,
  qType,
  isDocbased = false,
  timedAssignment,
  utaId,
  groupId,
  toggleUserWorkUploadModal,
  isPremiumContentWithoutAccess = false,
  checkAnswerInProgress,
  answerChecksUsedForItem,
  checkAnswer,
}) => {
  const toolbarHandler = (value) => changeTool(value)

  const handleCheckAnswer = () => {
    if (checkAnswerInProgress || typeof checkAnswer !== 'function') {
      return null
    }
    checkAnswer()
  }

  const {
    calcType,
    enableScratchpad,
    isTeacherPremium,
    maxAnswerChecks,
  } = settings
  const isDisableCrossBtn = qType !== questionType.MULTIPLE_CHOICE
  const hideCheckAnswer = !TokenStorage.getAccessToken()
  return (
    <Container>
      {maxAnswerChecks > 0 && !hideCheckAnswer && (
        <StyledButton
          onClick={handleCheckAnswer}
          title={
            checkAnswerInProgress
              ? 'In progress'
              : answerChecksUsedForItem >= maxAnswerChecks
              ? 'Usage limit exceeded'
              : 'Check Answer'
          }
          data-cy="checkAnswer"
          aria-label="Check answer"
          disabled={isPremiumContentWithoutAccess}
        >
          <IconCheck aria-hidden="true" />
        </StyledButton>
      )}
      {calcType !== calculatorTypes.NONE && (
        <Tooltip placement="top" title="Calculator">
          <StyledButton
            active={tool.indexOf(2) !== -1}
            onClick={() => toolbarHandler(2)}
            disabled={isPremiumContentWithoutAccess}
            aria-label="Calculator"
          >
            <CaculatorIcon aria-hidden="true" />
          </StyledButton>
        </Tooltip>
      )}

      {!isDocbased && (
        <Tooltip
          placement="top"
          title={
            isDisableCrossBtn
              ? 'This option is available only for multiple choice'
              : 'Crossout'
          }
        >
          <StyledButton
            active={tool.indexOf(3) !== -1}
            disabled={isDisableCrossBtn || isPremiumContentWithoutAccess}
            onClick={() => toolbarHandler(3)}
            aria-label="Crossout"
          >
            <CloseIcon aria-hidden="true" />
          </StyledButton>
        </Tooltip>
      )}

      {!isDocbased && enableScratchpad && (
        <Tooltip placement="top" title="Scratch Pad">
          <StyledButton
            active={tool.indexOf(5) !== -1}
            onClick={() => toolbarHandler(5)}
            disabled={isPremiumContentWithoutAccess}
            aria-label="Scratch Pad"
          >
            <ScratchPadIcon aria-hidden="true" />
          </StyledButton>
        </Tooltip>
      )}
      {!isDocbased && isTeacherPremium && (
        <Tooltip placement="top" title="Upload work">
          <StyledButton
            onClick={toggleUserWorkUploadModal}
            disabled={isPremiumContentWithoutAccess}
            aria-label="Upload work"
          >
            <IconCloudUpload aria-hidden="true" />
          </StyledButton>
        </Tooltip>
      )}
      {timedAssignment && (
        <TimedTestTimer
          utaId={utaId}
          groupId={groupId}
          fgColor={tools.svgColor}
          bgColor={tools.color}
        />
      )}
    </Container>
  )
}

ToolBar.propTypes = {
  tool: PropTypes.array.isRequired,
  changeTool: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  qType: PropTypes.string.isRequired,
}

const enhance = compose(
  connect((state) => ({
    checkAnswerInProgress: state?.test?.checkAnswerInProgress,
  }))
)

export default enhance(ToolBar)

export const StyledButton = styled(Button)`
  border: none;
  margin-right: 3px;
  border-radius: 5px;
  height: 40px;
  width: 40px;
  ${(props) => props.hidden && 'display:none'};
  background: ${({ active }) =>
    active ? tools.active.background : tools.color}!important;

  svg {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    fill: ${({ active }) => (active ? tools.active.svgColor : tools.svgColor)};
  }
  &:hover {
    background: ${tools.active.background}!important;
    svg {
      fill: ${white};
    }
  }
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 2px ${themeColorBlue};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    margin-right: 5px;
  }
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

const ScratchPadIcon = styled(IconScratchPad)`
  ${({ theme }) => `
    width: ${theme.default.headerScratchPadIconWidth};
    height: ${theme.default.headerScratchPadIconHeight};
  `}
`
