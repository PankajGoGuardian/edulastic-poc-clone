import {
  IconMinusRounded,
  IconPlus,
  IconScratchPad,
  IconMore,
  IconCloudUpload,
  IconMagnify,
  IconQuester,
  IconCheck,
} from '@edulastic/icons'
import React, { useState } from 'react'
import { withNamespaces } from '@edulastic/localization'
import { test as testConstants, roleuser } from '@edulastic/constants'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'
import styled from 'styled-components'
import questionType from '@edulastic/constants/const/questionType'
import { Rnd } from 'react-rnd'
import { withWindowSizes } from '@edulastic/common'
import { TokenStorage } from '@edulastic/api'
import { setZoomLevelAction } from '../../../../student/Sidebar/ducks'
import AudioControls from '../../../AudioControls'
import { getUserRole } from '../../../../author/src/selectors/user'
import { getIsPreviewModalVisibleSelector } from '../../../selectors/test'
import { themes } from '../../../../theme'

const { IconAnswerEliminator, IconBookMark, IconCalculator } = IconQuester

const {
  playerSkin: { quester },
} = themes

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px #ddd',
  background: '#334049',
  padding: '10px',
  borderRadius: '5px',
  zIndex: 999,
}

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
}) => {
  const [zoom, setZoom] = useState(0)
  const {
    calcType,
    enableScratchpad,
    isTeacherPremium,
    showMagnifier,
    maxAnswerChecks,
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

  const showAudioControls = userRole === 'teacher' && !!LCBPreviewModal
  const data = items[currentItem]?.data?.questions[0]
  const canShowPlayer =
    ((showUserTTS === 'yes' && userRole === roleuser.STUDENT) ||
      (userRole !== roleuser.STUDENT &&
        (!!LCBPreviewModal || isTestPreviewModalVisible))) &&
    data?.tts &&
    data?.tts?.taskStatus === 'COMPLETED'
  const hideCheckAnswer = !TokenStorage.getAccessToken()

  return (
    <MainFooter isSidebarVisible className="quester-player-footer">
      <ActionContainer data-cy="zoomIn">
        <IconWrap className="hover-effect" onClick={handleZoomOut}>
          <IconMinusRounded color={footer.textColor} />
        </IconWrap>
        <span>ZOOM OUT</span>
      </ActionContainer>

      <ActionContainer data-cy="zoomOut">
        <IconWrap className="hover-effect" onClick={handleZoomIn}>
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
        >
          <IconCheck color={footer.textColor} hoverColor={button.background} />
          <span> {t('common.test.checkanswer')}</span>
        </ActionContainer>
      )}
      <ActionContainer
        hoverEffect
        active={tool?.includes(CROSS_BUTTON)}
        onClick={() => (isDisableCrossBtn ? null : changeTool(CROSS_BUTTON))}
        disabled={isDisableCrossBtn}
        title={
          isDisableCrossBtn
            ? 'This option is available only for multiple choice'
            : 'Crossout'
        }
        data-cy="crossButton"
      >
        <IconWrapper>
          <IconAnswerEliminator
            color={footer.textColor}
            hoverColor={button.background}
          />
        </IconWrapper>

        <span>{t('common.test.answerEliminator')}</span>
      </ActionContainer>
      {calcType !== testConstants.calculatorTypes.NONE && (
        <ActionContainer
          hoverEffect
          active={tool?.includes(CALC)}
          onClick={() => changeTool(CALC)}
          title={t('common.test.calculator')}
          data-cy="calculator"
        >
          <IconWrapper>
            <IconCalculator
              color={footer.textColor}
              hoverColor={button.background}
            />
          </IconWrapper>

          <span>{t('common.test.calculator')}</span>
        </ActionContainer>
      )}
      {enableScratchpad && !hasDrawingResponse && (
        <ActionContainer
          hoverEffect
          active={tool?.includes(SCRATCHPAD)}
          onClick={() => changeTool(SCRATCHPAD)}
          title={t('common.test.scratchPad')}
          data-cy="scratchPad"
        >
          <IconWrapper>
            <IconScratchPad
              color={footer.textColor}
              hoverColor={button.background}
            />
          </IconWrapper>

          <span>{t('common.test.scratchPad')}</span>
        </ActionContainer>
      )}

      {showMagnifier && (
        <ActionContainer
          hoverEffect
          active={enableMagnifier}
          onClick={handleMagnifier}
          title={t('common.test.magnify')}
          data-cy="magnify"
        >
          <IconWrapper>
            <IconMagnify
              color={footer.textColor}
              hoverColor={button.background}
            />
          </IconWrapper>

          <span>{t('common.test.magnify')}</span>
        </ActionContainer>
      )}

      {isTeacherPremium && (
        <ActionContainer
          hoverEffect
          onClick={toggleUserWorkUploadModal}
          title={t('common.test.uploadWork')}
          data-cy="uploadWork"
        >
          <IconWrapper>
            <IconCloudUpload
              color={footer.textColor}
              hoverColor={button.background}
            />
          </IconWrapper>

          <span>{t('common.test.uploadWork')}</span>
        </ActionContainer>
      )}

      {canShowPlayer && windowWidth && (
        <Rnd
          style={style}
          default={{
            x: windowWidth - 300,
            y: -80,
            width: '200px',
            height: '60',
          }}
        >
          Play All
          <AudioControls
            showAudioControls={showAudioControls}
            key={data.id}
            item={data}
            qId={data.id}
            audioSrc={data?.tts?.titleAudioURL}
            className="quester-question-audio-controller"
          />
          <IconMoreVertical
            color={footer.textColor}
            hoverColor={footer.textColor}
          />
        </Rnd>
      )}
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
  height: 80px;
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

const IconMoreVertical = styled(IconMore)`
  transform: rotate(90deg);
  position: absolute;
  right: 10px;
`

const ActionContainer = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  padding: 8px 15px;
  transition: all 0.5s ease;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 11px;
  ${(props) =>
    props.disabled &&
    `
    cursor:default;

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
`

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
