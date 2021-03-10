import {
  IconBookmark,
  IconMinusRounded,
  IconPlus,
  IconClose,
  IconScratchPad,
  IconCalculator,
  IconMore,
  IconCloudUpload,
  IconMagnify,
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
import { setZoomLevelAction } from '../../../../student/Sidebar/ducks'
import AudioControls from '../../../AudioControls'
import { getUserRole } from '../../../../author/src/selectors/user'
import { getIsPreviewModalVisibleSelector } from '../../../selectors/test'
import { themes } from '../../../../theme'

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
}) => {
  const [zoom, setZoom] = useState(0)
  const {
    calcType,
    enableScratchpad,
    isTeacherPremium,
    showMagnifier,
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

  const showAudioControls = userRole === 'teacher' && !!LCBPreviewModal
  const data = items[currentItem]?.data?.questions[0]
  const canShowPlayer =
    ((showUserTTS === 'yes' && userRole === roleuser.STUDENT) ||
      (userRole !== roleuser.STUDENT &&
        (!!LCBPreviewModal || isTestPreviewModalVisible))) &&
    data?.tts &&
    data?.tts?.taskStatus === 'COMPLETED'
  return (
    <MainFooter isSidebarVisible className="quester-player-footer">
      <ActionContainer>
        <PlusOrMinus>
          <IconWrap className="hover-effect" onClick={handleZoomOut}>
            <IconMinusRounded color={footer.textColor} />
          </IconWrap>
          <Devider />
          <IconWrap className="hover-effect" onClick={handleZoomIn}>
            <IconPlus color={footer.textColor} />
          </IconWrap>
        </PlusOrMinus>
        <div>Zoom</div>
      </ActionContainer>
      {!blockNavigationToAnsweredQuestions && (
        <ActionContainer
          hoverEffect
          onClick={
            defaultAP
              ? toggleBookmark
              : () => toggleBookmark(items[currentItem]?._id)
          }
          title={t('common.test.bookmark')}
        >
          <IconWrapper>
            <IconBookmark
              color={isBookmarked ? button.background : footer.textColor}
              hoverColor={button.background}
            />
          </IconWrapper>

          <span>{t('common.test.bookmark')}</span>
        </ActionContainer>
      )}
      <Devider />
      <ActionContainer
        hoverEffect
        active={tool.includes(CROSS_BUTTON)}
        onClick={() => (isDisableCrossBtn ? null : changeTool(CROSS_BUTTON))}
        disabled={isDisableCrossBtn}
        title={
          isDisableCrossBtn
            ? 'This option is available only for multiple choice'
            : 'Crossout'
        }
      >
        <IconWrapper>
          <IconClose color={footer.textColor} hoverColor={button.background} />
        </IconWrapper>

        <span>{t('common.test.answerEliminator')}</span>
      </ActionContainer>
      {calcType !== testConstants.calculatorTypes.NONE && (
        <ActionContainer
          hoverEffect
          active={tool.includes(CALC)}
          onClick={() => changeTool(CALC)}
          title={t('common.test.calculator')}
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
          active={tool.includes(SCRATCHPAD)}
          onClick={() => changeTool(SCRATCHPAD)}
          title={t('common.test.scratchPad')}
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
      {isTeacherPremium && (
        <ActionContainer
          hoverEffect
          onClick={toggleUserWorkUploadModal}
          title={t('common.test.uploadWork')}
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

      {showMagnifier && (
        <ActionContainer
          hoverEffect
          active={enableMagnifier}
          onClick={handleMagnifier}
          title={t('common.test.magnify')}
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

const PlusOrMinus = styled.div`
  border: 1px solid ${footer.textColor};
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  overflow: hidden;
`

const IconWrap = styled.span`
  padding: 5px 20px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  &:hover {
    background-color: ${footer.hover.background};
    color: ${footer.hover.color};
  }
`
const Devider = styled.div`
  width: 1px;
  background: ${footer.textColor};
`

const IconWrapper = styled.div`
  cursor: pointer;
`
