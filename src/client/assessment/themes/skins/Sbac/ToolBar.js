import React, { useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { EduIf } from '@edulastic/common'
import { questionType } from '@edulastic/constants'
import {
  IconCalculator,
  IconClose,
  IconScratchPad,
  IconMagnify,
  IconLanguage,
  IconCloudUpload,
  IconCheck,
  IconEduReferenceSheet,
} from '@edulastic/icons'
import { TokenStorage } from '@edulastic/api'
import { Tooltip } from '../../../../common/utils/helpers'
import { Container, StyledButton, StyledIcon } from './styled'
import TimedTestTimer from '../../common/TimedTestTimer'
import { setSettingsModalVisibilityAction } from '../../../../student/Sidebar/ducks'
import { getIsMultiLanguageEnabled } from '../../../../common/components/LanguageSelector/duck'
import { getCalcTypeSelector } from '../../../selectors/test'

const zoomIndex = [1, 1.5, 1.75, 2.5, 3]

const ToolBar = ({
  settings = {},
  tool = [],
  changeTool,
  qType,
  setZoomLevel,
  isDocbased,
  handleMagnifier,
  showMagnifier,
  enableMagnifier,
  timedAssignment,
  utaId,
  groupId,
  header,
  multiLanguageEnabled,
  setSettingsModalVisibility,
  toggleUserWorkUploadModal,
  isPremiumContentWithoutAccess = false,
  checkAnswerInProgress,
  checkAnswer,
  answerChecksUsedForItem,
  canShowReferenceMaterial,
  isShowReferenceModal,
  openReferenceModal,
  i18Translate,
  calcTypes,
}) => {
  const [zoom, setZoom] = useState(0)
  const toolbarHandler = (value) => changeTool(value)

  const { enableScratchpad, isTeacherPremium, maxAnswerChecks } = settings
  const isDisableCrossBtn = qType !== questionType.MULTIPLE_CHOICE
  const handleZoomIn = () => {
    if (zoom !== zoomIndex.length - 1) {
      setZoomLevel(zoomIndex[zoom + 1])
      setZoom(zoom + 1)
    }
  }

  const handleZoomOut = () => {
    if (zoom !== 0) {
      setZoomLevel(zoomIndex[zoom - 1])
      setZoom(zoom - 1)
    }
  }

  const showLangSwitchPopUp = () => {
    setSettingsModalVisibility(true)
  }

  const handleCheckAnswer = () => {
    if (checkAnswerInProgress || typeof checkAnswer !== 'function') {
      return null
    }
    checkAnswer()
  }

  const hideCheckAnswer = !TokenStorage.getAccessToken()

  return (
    <Container className="sbac-toolbar">
      {maxAnswerChecks > 0 && !hideCheckAnswer && (
        <StyledButton
          onClick={handleCheckAnswer}
          title={
            checkAnswerInProgress
              ? i18Translate(
                  'student:common.test.checkAnswerInfoTexts.inProgress'
                )
              : answerChecksUsedForItem >= maxAnswerChecks
              ? i18Translate(
                  'student:common.test.checkAnswerInfoTexts.usageLimitExceeded'
                )
              : i18Translate('student:common.test.checkanswer')
          }
          data-cy="checkAnswer"
          disabled={isPremiumContentWithoutAccess}
          aria-label="Check Answer"
        >
          <IconCheck />
        </StyledButton>
      )}

      {canShowReferenceMaterial && (
        <Tooltip
          placement="top"
          title={i18Translate('header:toolbar.refMaterial')}
        >
          <StyledButton
            onClick={openReferenceModal}
            active={isShowReferenceModal}
            disabled={isPremiumContentWithoutAccess}
            aria-label={i18Translate('header:toolbar.refMaterial')}
          >
            <IconEduReferenceSheet />
          </StyledButton>
        </Tooltip>
      )}

      <EduIf condition={!isEmpty(calcTypes)}>
        <Tooltip
          placement="top"
          title={i18Translate('header:toolbar.calculator')}
        >
          <StyledButton
            active={tool.indexOf(2) !== -1}
            onClick={() => toolbarHandler(2)}
            aria-label={i18Translate('header:toolbar.calculator')}
            disabled={isPremiumContentWithoutAccess}
          >
            <CaculatorIcon />
          </StyledButton>
        </Tooltip>
      </EduIf>

      {!isDocbased && (
        <Tooltip
          placement="top"
          title={
            isDisableCrossBtn
              ? i18Translate('header:toolbar.crossDisabled')
              : i18Translate('header:toolbar.cross')
          }
        >
          <StyledButton
            active={tool.indexOf(3) !== -1}
            disabled={isDisableCrossBtn || isPremiumContentWithoutAccess}
            onClick={() => toolbarHandler(3)}
            aria-label={
              isDisableCrossBtn
                ? i18Translate('header:toolbar.crossDisabled')
                : i18Translate('header:toolbar.cross')
            }
          >
            <CloseIcon />
          </StyledButton>
        </Tooltip>
      )}

      {!isDocbased && enableScratchpad && (
        <Tooltip
          placement="top"
          title={i18Translate('header:toolbar.scratchPad')}
        >
          <StyledButton
            active={tool.indexOf(5) !== -1}
            onClick={() => toolbarHandler(5)}
            disabled={isPremiumContentWithoutAccess}
            aria-label={i18Translate('header:toolbar.scratchPad')}
          >
            <ScratchPadIcon />
          </StyledButton>
        </Tooltip>
      )}
      {!isDocbased && (
        <Tooltip placement="top" title={i18Translate('header:toolbar.zoomIn')}>
          <StyledButton
            onClick={handleZoomIn}
            disabled={isPremiumContentWithoutAccess}
            aria-label={i18Translate('header:toolbar.zoomIn')}
          >
            <StyledIcon type="zoom-in" />
          </StyledButton>
        </Tooltip>
      )}
      {!isDocbased && (
        <Tooltip placement="top" title={i18Translate('header:toolbar.zoomOut')}>
          <StyledButton
            onClick={handleZoomOut}
            disabled={isPremiumContentWithoutAccess}
            aria-label={i18Translate('header:toolbar.zoomOut')}
          >
            <StyledIcon type="zoom-out" />
          </StyledButton>
        </Tooltip>
      )}
      {showMagnifier && (
        <Tooltip placement="top" title={i18Translate('header:toolbar.magnify')}>
          <StyledButton
            onClick={handleMagnifier}
            active={enableMagnifier}
            disabled={isPremiumContentWithoutAccess}
            aria-label={i18Translate('header:toolbar.magnify')}
          >
            <IconMagnify />
          </StyledButton>
        </Tooltip>
      )}
      {!isDocbased && isTeacherPremium && (
        <Tooltip
          placement="top"
          title={i18Translate('header:toolbar.uploadWork')}
        >
          <StyledButton
            onClick={toggleUserWorkUploadModal}
            disabled={isPremiumContentWithoutAccess}
            aria-label={i18Translate('header:toolbar.uploadWork')}
          >
            <IconCloudUpload />
          </StyledButton>
        </Tooltip>
      )}
      {multiLanguageEnabled && (
        <Tooltip
          placement="top"
          title={i18Translate('header:testOptions.selectLanguage')}
        >
          <StyledButton
            onClick={showLangSwitchPopUp}
            data-cy="SBAC_selectLang"
            disabled={isPremiumContentWithoutAccess}
            aria-label={i18Translate('header:testOptions.selectLanguage')}
          >
            <IconLanguage />
          </StyledButton>
        </Tooltip>
      )}
      {timedAssignment && (
        <TimedTestTimer
          utaId={utaId}
          groupId={groupId}
          fgColor={header?.logoColor}
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
  i18Translate: PropTypes.func.isRequired,
}

const enhance = compose(
  connect(
    (state) => ({
      multiLanguageEnabled: getIsMultiLanguageEnabled(state),
      checkAnswerInProgress: state?.test?.checkAnswerInProgress,
      calcTypes: getCalcTypeSelector(state),
    }),
    {
      setSettingsModalVisibility: setSettingsModalVisibilityAction,
    }
  )
)

export default enhance(ToolBar)

export const CaculatorIcon = styled(IconCalculator)`
  ${({ theme }) => `
    width: ${theme.default.headerCalculatorIconWidth};
    height: ${theme.default.headerCalculatorIconHeight};
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
