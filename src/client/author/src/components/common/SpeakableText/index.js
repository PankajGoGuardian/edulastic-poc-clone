import React, { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import {
  EduButton,
  EduIf,
  FlexContainer,
  TextAreaInputStyled,
} from '@edulastic/common'
import { Spin } from 'antd'
import { ALPHABET } from '@edulastic/common/src/helpers'
import {
  StyledOptionContainer,
  StyledOptionLabel,
  StyledTextArea,
  StyledSpeakableTextContainer,
} from './styled-components'
import AudioControls from '../../../../../assessment/AudioControls'

const SpeakableText = ({
  ttsTextAPIStatus,
  updateTTSAPIStatus,
  ttsTextData = {},
  updateQuestionTTSText,
  question,
}) => {
  const [updatedTtsData, setUpdatedTtsData] = useState(ttsTextData)

  useEffect(() => {
    setUpdatedTtsData(ttsTextData)
  }, [ttsTextData])

  const { text: stimulusText = '', options = {} } = updatedTtsData || {}
  const optionIds = Object.keys(options) || []

  const handleUpdateTtsData = (text, type, optionId) => {
    if (type === 'stimulus') {
      setUpdatedTtsData((previousState) => ({ ...previousState, text }))
    } else if (type === 'option') {
      setUpdatedTtsData((previousState) => ({
        ...previousState,
        options: {
          ...previousState.options,
          [optionId]: { text },
        },
      }))
    }
  }

  const updateTTSText = () => {
    updateQuestionTTSText(updatedTtsData)
  }

  if (isEmpty(question)) {
    return null
  }

  return (
    <>
      <EduIf condition={ttsTextAPIStatus === 'INITIATED'}>
        <Spin style={{ marginTop: '20px' }} />
      </EduIf>
      <EduIf condition={ttsTextAPIStatus === 'SUCCESS'}>
        <StyledSpeakableTextContainer>
          <EduIf condition={question?.tts?.titleAudioURL?.length > 0}>
            <AudioControls
              key={question?.id}
              item={question}
              qId={question?.id}
              audioSrc={question?.tts?.titleAudioURL}
              className="speakable-text-audio-controls"
            />
          </EduIf>
          <h4>Question TTS Text</h4>
          <TextAreaInputStyled
            style={{ paddingLeft: '5px', paddingTop: '5px' }}
            value={stimulusText}
            onChange={(e) =>
              handleUpdateTtsData(e?.target?.value || '', 'stimulus')
            }
          />
          <h4 style={{ marginTop: '20px' }}>Options TTS Text</h4>
          {(optionIds || []).map((optionId, index) => {
            const optionText = options?.[optionId]?.text || ''
            return (
              <StyledOptionContainer>
                <StyledOptionLabel>{ALPHABET[index]}</StyledOptionLabel>
                <StyledTextArea
                  bordered={false}
                  style={{ paddingLeft: '5px', paddingTop: '5px' }}
                  value={optionText || ''}
                  onChange={(e) =>
                    handleUpdateTtsData(
                      e?.target?.value || '',
                      'option',
                      optionId
                    )
                  }
                />
              </StyledOptionContainer>
            )
          })}
          <FlexContainer justifyContent="flex-end">
            <EduButton
              loading={updateTTSAPIStatus === 'INITIATED'}
              onClick={updateTTSText}
              disabled={updateTTSAPIStatus === 'INITIATED'}
            >
              Generate TTS
            </EduButton>
          </FlexContainer>
        </StyledSpeakableTextContainer>
      </EduIf>
    </>
  )
}

export default SpeakableText
