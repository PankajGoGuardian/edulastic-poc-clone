import { greyThemeLight } from '@edulastic/colors'
import { SelectInputStyled, TextAreaInputStyled } from '@edulastic/common'

import styled from 'styled-components'

export const StyledOptionContainer = styled.div`
  display: flex;
  border: 1px solid ${greyThemeLight};
  border-radius: 4px;
  margin-bottom: 15px;
`
export const StyledOptionLabel = styled.span`
  width: 20px;
  border-right: 1px solid ${greyThemeLight};
  padding: 5px;
  font-weight: 700;
`
export const StyledTextArea = styled(TextAreaInputStyled)`
  border: none !important;
`

export const StyledSpeakableTextContainer = styled.div`
  .speakable-text-audio-controls {
    padding: 0px 0px 20px 0px !important;
  }
`

export const VoiceLanguageSelector = styled(SelectInputStyled)`
  &.ant-select {
    .ant-select-selection {
      font-size: 14px;
    }
  }
`
export const TTSFormLabel = styled.h4`
  margin: 0;
`
