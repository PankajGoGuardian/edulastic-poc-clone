import { white } from '@edulastic/colors'
import { Tooltip } from 'antd'
import { EduIf, FlexContainer } from '@edulastic/common'
import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import Draggable from '@edulastic/common/src/components/MathInput/Draggable'
import { IconClose, IconInfoCircle } from '@edulastic/icons'
import SpeakableText from '../SpeakableText'
import {
  ModalContentArea,
  NextArrowTTS,
  PrevArrowTTS,
  StyledWrapper,
  Title,
} from './styled'
import { TTS_NAV_NEXT, TTS_NAV_PREV } from './constants'

const CustomizeTTSModal = ({
  showTTSTextModal,
  modalDraggable,
  data,
  currentQuestionIndex,
  toggleTTSTextModal,
  changeQuestion,
  ttsTextAPIStatus,
  updateTTSAPIStatus,
  ttsTextResult,
  voiceLanguage,
  updateQuestionTTSText,
  regenerateTTSText,
  onLanguageChange,
  onChangeVoiceLanguge,
  selectedLanguage,
  handleDraggable,
}) => {
  const isMultipartItem = (data?.questions || [])?.length > 1
  return (
    <EduIf condition={showTTSTextModal}>
      <Draggable
        usePortal
        position={{ x: '50%', y: '50%' }}
        transform="translate(-50%, -50%)"
        borderRadius="8px"
        disabled={modalDraggable}
        width="75%"
        height="calc(70vh + 60px)"
      >
        <ModalInner width="100%" height="100%">
          <ModalHeader justifyContent="space-between" padding="32px">
            <FlexContainer flexDirection="column">
              <Title justifyContent="flex-start" alignItems="center">
                Customize TTS
                <EduIf condition={isMultipartItem}>
                  : Part {currentQuestionIndex + 1}/
                  {(data?.questions || []).length}{' '}
                  <Tooltip
                    zIndex="1500"
                    title="Only parts with Customize TTS support are available."
                  >
                    <IconInfoCircle
                      margin="0 0 0 5px"
                      width="20px"
                      height="20px"
                    />
                  </Tooltip>
                </EduIf>
              </Title>
              <p>
                Please refresh the page to update the audio after a few minutes
              </p>
            </FlexContainer>
            <IconClose onClick={toggleTTSTextModal} />
          </ModalHeader>

          <StyledWrapper
            background="#f7f7f7"
            alignmentItems="center"
            height="calc(100% - 115px)"
          >
            <EduIf condition={currentQuestionIndex > 0}>
              <PrevArrowTTS onClick={() => changeQuestion(TTS_NAV_PREV)}>
                <FlexContainer flexDirection="column">
                  <FontAwesomeIcon icon={faAngleLeft} />
                  <b className="help-text">PREV</b>
                </FlexContainer>
              </PrevArrowTTS>
            </EduIf>
            <StyledWrapper
              background={white}
              flexDirection="column"
              width="100%"
              marginLeft="32px"
              mr="32px"
              mt="2px"
              marginBottom="32px"
            >
              <ModalContentArea
                tts
                style={{ minHeight: 400, padding: '32px' }}
                width="100%"
              >
                <div
                  onMouseEnter={() => handleDraggable(true)}
                  onMouseLeave={() => handleDraggable(false)}
                >
                  <SpeakableText
                    ttsTextAPIStatus={ttsTextAPIStatus}
                    updateTTSAPIStatus={updateTTSAPIStatus}
                    ttsTextData={ttsTextResult}
                    updateQuestionTTSText={updateQuestionTTSText}
                    regenerateTTSText={regenerateTTSText}
                    question={data?.questions?.[currentQuestionIndex] || {}}
                    showTTSTextModal={showTTSTextModal}
                    onLanguageChange={onLanguageChange}
                    selectedLanguage={selectedLanguage}
                    onChangeVoiceLanguge={onChangeVoiceLanguge}
                    voiceLanguage={voiceLanguage}
                    currentQuestionIndex={currentQuestionIndex}
                  />
                </div>
              </ModalContentArea>
            </StyledWrapper>
            <EduIf
              condition={
                currentQuestionIndex + 1 < (data?.questions || []).length
              }
            >
              <NextArrowTTS onClick={() => changeQuestion(TTS_NAV_NEXT)}>
                <FlexContainer flexDirection="column">
                  <FontAwesomeIcon icon={faAngleRight} />
                  <b className="help-text">NEXT</b>
                </FlexContainer>
              </NextArrowTTS>
            </EduIf>
          </StyledWrapper>
        </ModalInner>
      </Draggable>
    </EduIf>
  )
}

const ModalInner = styled.div`
  position: relative;
  background: ${white};
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  z-index: 1003;
  border-radius: 8px;
  & .input__math {
    margin: 0px 15px;
    width: calc(100% - 30px);
  }
`

const ModalHeader = styled(FlexContainer)`
  border-radius: 8px;
  svg {
    cursor: pointer;
  }
`
export default CustomizeTTSModal
