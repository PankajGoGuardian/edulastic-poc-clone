import React, { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import {
  EduButton,
  EduIf,
  FlexContainer,
  SelectInputStyled,
  TextAreaInputStyled,
} from '@edulastic/common'
import { Spin } from 'antd'
import { ALPHABET } from '@edulastic/common/src/helpers'
import {
  LANGUAGES_OPTIONS,
  LANGUAGE_EN,
  VOICE_LANGUAGE_OPTIONS,
} from '@edulastic/constants/const/languages'
import connect from 'react-redux/es/connect/connect'
import { questionType as constantsQuestionType } from '@edulastic/constants'
import {
  StyledOptionContainer,
  StyledOptionLabel,
  StyledTextArea,
  StyledSpeakableTextContainer,
  TTSFormLabel,
  VoiceLanguageSelector,
} from './styled-components'
import AudioControls from '../../../../../assessment/AudioControls'
import { allowedToSelectMultiLanguageInTest } from '../../../selectors/user'
import { changeDataToPreferredLanguage } from '../../../../../assessment/utils/question'

const SpeakableText = ({
  ttsTextAPIStatus,
  updateTTSAPIStatus,
  ttsTextData = {},
  updateQuestionTTSText,
  question,
  showTTSTextModal,
  regenerateTTSText,
  onLanguageChange,
  selectedLanguage,
  allowedToSelectMultiLanguage,
  onChangeVoiceLanguge,
  voiceLanguage,
}) => {
  const [updatedTtsData, setUpdatedTtsData] = useState(ttsTextData)

  useEffect(() => {
    setUpdatedTtsData(ttsTextData)
  }, [ttsTextData])

  const { text: stimulusText = '', options = {} } = updatedTtsData || {}
  const optionIds = Array.isArray(question?.options)
    ? (question?.options || []).map(({ value }) => value)
    : []

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
  const { useLanguageFeatureQn } = constantsQuestionType
  const showLanguageSelector =
    allowedToSelectMultiLanguage &&
    useLanguageFeatureQn.includes(question.type) &&
    Object.keys(question.languageFeatures || {}).length

  const questionDataByLanguage = changeDataToPreferredLanguage(
    question,
    selectedLanguage
  )
  const audioSrc = questionDataByLanguage?.tts?.titleAudioURL

  const isEnglishLanguageDisable = !question.stimulus

  return (
    <>
      <EduIf condition={showLanguageSelector}>
        <FlexContainer justifyContent="flex-end" marginBottom="10px">
          <SelectInputStyled
            data-cy="tts-language-selector"
            width="120px"
            height="30px"
            onSelect={(value) => onLanguageChange(value)}
            value={selectedLanguage}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            {LANGUAGES_OPTIONS.map((language) => (
              <option
                disabled={
                  language.value === LANGUAGE_EN
                    ? isEnglishLanguageDisable
                    : !question?.languageFeatures?.[language.value]
                }
                value={language.value}
                key={language.value}
              >
                {language.label}
              </option>
            ))}
          </SelectInputStyled>
        </FlexContainer>
      </EduIf>
      <EduIf condition={ttsTextAPIStatus === 'INITIATED'}>
        <Spin style={{ marginTop: '20px' }} />
      </EduIf>
      <EduIf condition={ttsTextAPIStatus === 'SUCCESS'}>
        <StyledSpeakableTextContainer>
          <EduIf condition={(audioSrc || '').length > 0 && showTTSTextModal}>
            <AudioControls
              key={question?.id}
              item={questionDataByLanguage}
              qId={question?.id}
              audioSrc={audioSrc}
              className="speakable-text-audio-controls"
            />
          </EduIf>

          <h4>Question TTS Text</h4>
          <TextAreaInputStyled
            style={{ paddingLeft: '5px', paddingTop: '5px', marginBottom: 10 }}
            value={stimulusText}
            autoSize={{ minRows: 4 }}
            onChange={(e) =>
              handleUpdateTtsData(e?.target?.value || '', 'stimulus')
            }
          />
          <EduIf condition={optionIds.length}>
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
          </EduIf>
          <FlexContainer justifyContent="space-between">
            <FlexContainer justifyContent="flex-start">
              <EduIf condition={!showLanguageSelector}>
                <FlexContainer justifyContent="flex-start" alignItems="center">
                  <TTSFormLabel margin="0">Set TTS Language to:</TTSFormLabel>
                  <VoiceLanguageSelector
                    data-cy="tts-language-selector"
                    width="100px"
                    height="30px"
                    margin="0px"
                    onSelect={(value) => onChangeVoiceLanguge(value)}
                    value={voiceLanguage}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    padding="0px 30px 0px 5px"
                    bg="transparent"
                    noBorder
                  >
                    {VOICE_LANGUAGE_OPTIONS.map((language) => (
                      <option value={language.value} key={language.value}>
                        {language.label}
                      </option>
                    ))}
                  </VoiceLanguageSelector>
                </FlexContainer>
              </EduIf>
            </FlexContainer>
            <FlexContainer justifyContent="flex-end" alignItems="center">
              <EduButton
                isGhost
                loading={ttsTextAPIStatus === 'INITIATED'}
                onClick={regenerateTTSText}
                disabled={ttsTextAPIStatus === 'INITIATED'}
              >
                Regenerate TTS Text
              </EduButton>
              <EduButton
                loading={updateTTSAPIStatus === 'INITIATED'}
                onClick={updateTTSText}
                disabled={updateTTSAPIStatus === 'INITIATED'}
              >
                Generate TTS
              </EduButton>
            </FlexContainer>
          </FlexContainer>
        </StyledSpeakableTextContainer>
      </EduIf>
    </>
  )
}

export default connect((state) => ({
  allowedToSelectMultiLanguage: allowedToSelectMultiLanguageInTest(state),
}))(SpeakableText)
