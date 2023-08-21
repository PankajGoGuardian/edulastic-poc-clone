import {
  IconMinusRounded,
  IconPlus,
  IconScratchPad,
  IconCloudUpload,
  IconMagnify,
  IconQuester,
  IconCheck,
  IconReferenceGuide,
} from '@edulastic/icons'
import React, { useState } from 'react'
import { withNamespaces } from '@edulastic/localization'
import { roleuser } from '@edulastic/constants'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash'
import { compose } from 'redux'
import styled from 'styled-components'
import questionType from '@edulastic/constants/const/questionType'
import { withWindowSizes, withKeyboard, EduIf } from '@edulastic/common'
import { TokenStorage } from '@edulastic/api'
import { getUserRole } from '../../../../author/src/selectors/user'
import { getIsPreviewModalVisibleSelector } from '../../../selectors/test'
import { setZoomLevelAction } from '../../../../student/Sidebar/ducks'
import { themes } from '../../../../theme'
import ItemAudioControl from './ItemAudioControl'

const { IconAnswerEliminator, IconBookMark, IconCalculator } = IconQuester

const {
  playerSkin: { quester },
} = themes

const { footer, button } = quester

const zoomIndex = [1, 1.5, 1.75, 2.5, 3]

const CALC = 2
const CROSS_BUTTON = 3
const SCRATCHPAD = 5

const PlayerFooter = ({
  setZoomLevel,
  blockNavigationToAnsweredQuestions,
  defaultAP,
  toggleBookmark,
  currentItem,
  items,
  isBookmarked,
  t,
  changeTool,
  tool,
  qType,
  hasDrawingResponse,
  settings,
  showUserTTS,
  userRole,
  LCBPreviewModal,
  isTestPreviewModalVisible,
  windowWidth,
  toggleUserWorkUploadModal,
  enableMagnifier,
  handleMagnifier,
  answerChecksUsedForItem,
  checkAnswerInProgress,
  checkAnswer,
  isPremiumContentWithoutAccess = false,
  passage,
  openReferenceModal,
  canShowReferenceMaterial,
  calcTypes,
}) => {
  const [zoom, setZoom] = useState(0)
  const {
    enableScratchpad,
    isTeacherPremium,
    showMagnifier,
    maxAnswerChecks,
    showTtsForPassages = true,
  } = settings
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

  const handleCheckAnswer = () => {
    if (checkAnswerInProgress || typeof checkAnswer !== 'function') {
      return null
    }
    checkAnswer()
  }

  const canShowPlayer =
    (showUserTTS === 'yes' && userRole === roleuser.STUDENT) ||
    (userRole !== roleuser.STUDENT &&
      (!!LCBPreviewModal || isTestPreviewModalVisible))

  const hideCheckAnswer = !TokenStorage.getAccessToken()

  return (
    <MainFooter isSidebarVisible className="quester-player-footer">
      <ActionContainer
        data-cy="zoomOut"
        onClick={handleZoomOut}
        aria-label="Zoom Out"
        disabled={isPremiumContentWithoutAccess}
      >
        <IconWrap className="hover-effect">
          <IconMinusRounded color={footer.textColor} />
        </IconWrap>
        <span>ZOOM OUT</span>
      </ActionContainer>

      <ActionContainer
        data-cy="zoomIn"
        onClick={handleZoomIn}
        aria-label="Zoom In"
        disabled={isPremiumContentWithoutAccess}
      >
        <IconWrap className="hover-effect">
          <IconPlus color={footer.textColor} />
        </IconWrap>
        <span>ZOOM IN</span>
      </ActionContainer>
      {!blockNavigationToAnsweredQuestions && (
        <ActionContainer
          hoverEffect
          active={isBookmarked}
          onClick={
            defaultAP
              ? toggleBookmark
              : () => toggleBookmark(items[currentItem]?._id)
          }
          title={t('common.test.bookmark')}
          data-cy="bookmark"
          aria-label={t('common.test.bookmark')}
          disabled={isPremiumContentWithoutAccess}
        >
          <IconWrapper>
            <IconBookMark
              color={isBookmarked ? button.background : footer.textColor}
              hoverColor={button.background}
            />
          </IconWrapper>

          <span>{t('common.test.bookmark')}</span>
        </ActionContainer>
      )}
      <Devider />

      {canShowReferenceMaterial && (
        <ActionContainer
          hoverEffect
          onClick={openReferenceModal}
          title={t('common.test.referenceGuide')}
          data-cy="referenceGuide"
          disabled={isPremiumContentWithoutAccess}
          aria-label={t('common.test.referenceGuide')}
        >
          <IconWrapper>
            <IconReferenceGuide
              color={footer.textColor}
              hoverColor={button.background}
            />
          </IconWrapper>

          <span>{t('common.test.referenceGuide')}</span>
        </ActionContainer>
      )}

      {maxAnswerChecks > 0 && !hideCheckAnswer && (
        <ActionContainer
          hoverEffect
          onClick={handleCheckAnswer}
          title={
            checkAnswerInProgress
              ? 'In progress'
              : answerChecksUsedForItem >= maxAnswerChecks
              ? 'Usage limit exceeded'
              : 'Check Answer'
          }
          data-cy="checkAnswer"
          aria-label={t('common.test.checkanswer')}
          disabled={isPremiumContentWithoutAccess}
        >
          <IconCheck color={footer.textColor} hoverColor={button.background} />
          <span> {t('common.test.checkanswer')}</span>
        </ActionContainer>
      )}
      <ActionContainer
        hoverEffect
        active={tool?.includes(CROSS_BUTTON)}
        onClick={() => (isDisableCrossBtn ? null : changeTool(CROSS_BUTTON))}
        disabled={isDisableCrossBtn || isPremiumContentWithoutAccess}
        title={
          isDisableCrossBtn
            ? 'This option is available only for multiple choice'
            : 'Crossout'
        }
        data-cy="crossButton"
        aria-label="Crossout"
      >
        <IconWrapper>
          <IconAnswerEliminator
            color={footer.textColor}
            hoverColor={button.background}
          />
        </IconWrapper>

        <span>{t('common.test.answerEliminator')}</span>
      </ActionContainer>
      <EduIf condition={!isEmpty(calcTypes)}>
        <ActionContainer
          hoverEffect
          active={tool?.includes(CALC)}
          onClick={() => changeTool(CALC)}
          title={t('common.test.calculator')}
          data-cy="calculator"
          aria-label="Calculator Icon"
          disabled={isPremiumContentWithoutAccess}
        >
          <IconWrapper>
            <IconCalculator
              color={footer.textColor}
              hoverColor={button.background}
            />
          </IconWrapper>

          <span>{t('common.test.calculator')}</span>
        </ActionContainer>
      </EduIf>
      <EduIf condition={enableScratchpad && !hasDrawingResponse}>
        <ActionContainer
          hoverEffect
          active={tool?.includes(SCRATCHPAD)}
          onClick={() => changeTool(SCRATCHPAD)}
          title={t('common.test.scratchPad')}
          data-cy="scratchPad"
          aria-label="ScratchPad Icon"
          disabled={isPremiumContentWithoutAccess}
        >
          <IconWrapper>
            <IconScratchPad
              color={footer.textColor}
              hoverColor={button.background}
            />
          </IconWrapper>

          <span>{t('common.test.scratchPad')}</span>
        </ActionContainer>
      </EduIf>
      <EduIf condition={showMagnifier}>
        <ActionContainer
          hoverEffect
          active={enableMagnifier}
          onClick={handleMagnifier}
          title={t('common.test.magnify')}
          data-cy="magnify"
          disabled={isPremiumContentWithoutAccess}
          aria-label="Magnify Icon"
        >
          <IconWrapper>
            <IconMagnify
              color={footer.textColor}
              hoverColor={button.background}
            />
          </IconWrapper>

          <span>{t('common.test.magnify')}</span>
        </ActionContainer>
      </EduIf>
      <EduIf condition={isTeacherPremium}>
        <ActionContainer
          hoverEffect
          onClick={toggleUserWorkUploadModal}
          title={t('common.test.uploadWork')}
          data-cy="uploadWork"
          aria-label="Upload Icon"
          disabled={isPremiumContentWithoutAccess}
        >
          <IconWrapper>
            <IconCloudUpload
              color={footer.textColor}
              hoverColor={button.background}
            />
          </IconWrapper>

          <span>{t('common.test.uploadWork')}</span>
        </ActionContainer>
      </EduIf>

      <EduIf condition={canShowPlayer && windowWidth}>
        <ItemAudioControl
          passage={passage}
          item={items[currentItem]}
          windowWidth={windowWidth}
          isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
          showTtsForPassages={showTtsForPassages}
        />
      </EduIf>
    </MainFooter>
  )
}

const enhance = compose(
  withNamespaces('student'),
  withWindowSizes,
  connect(
    (state) => ({
      settings: state.test.settings,
      showUserTTS: get(state, 'user.user.tts', 'no'),
      userRole: getUserRole(state),
      timedAssignment: state.test?.settings?.timedAssignment,
      testType: state.test?.settings?.testType,
      isTestPreviewModalVisible: getIsPreviewModalVisibleSelector(state),
      checkAnswerInProgress: state?.test?.checkAnswerInProgress,
    }),
    {
      setZoomLevel: setZoomLevelAction,
    }
  )
)

export default enhance(PlayerFooter)

const MainFooter = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  display: flex;
  padding: 0 15px;
  z-index: 9999;
  background: ${footer.background};
  border-top: 1px solid ${footer.border};
  color: ${footer.textColor};
  font-size: 13px;
  height: 70px;
  .quester-question-audio-controller {
    position: relative;
    height: auto;
    padding: 0;
    margin-left: 5px;
    button {
      border-radius: 50%;
      width: 35px;
      height: 35px;
      padding: 3px 0 0 0;
      background: ${button.background} !important;
      border: none;
      float: left;
      &:focus,
      &:active,
      &:hover {
        background: ${button.background} !important;
        border: none !important;
        svg {
          fill: ${footer.background} !important;
        }
      }

      margin-right: 5px;
      svg {
        fill: ${footer.background};
      }
      .audio-pause {
        fill: ${footer.background};
      }
      .anticon-loading {
        position: relative;
        left: 0;
        top: 0;
      }
    }
  }
`

const ActionContainer = withKeyboard(styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  padding: 8px 15px;
  transition: all 0.5s ease;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 10px;
  ${(props) =>
    props.disabled &&
    `
    cursor:default;
    pointer-events:none; 
  `}
  ${(props) =>
    props.active &&
    `
      background-color: ${footer.hover.background};
      color: ${footer.hover.color};
    `}
  ${(props) =>
    props.hoverEffect &&
    !props.disabled &&
    `
      &:hover{
        background-color: ${footer.hover.background};
        color: ${footer.hover.color};
      }
    `}
`)

const IconWrap = styled.span`
  padding: 4px 15px 0px 15px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  border: 1px solid ${footer.textColor};
  &:hover {
    background-color: ${footer.hover.background};
    color: ${footer.hover.color};
  }
`
const Devider = styled.div`
  width: 1px;
  background: ${footer.hover.background};
`

const IconWrapper = styled.div`
  cursor: pointer;
`
