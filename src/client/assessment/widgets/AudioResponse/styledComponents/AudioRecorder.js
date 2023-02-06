import styled, { keyframes, css } from 'styled-components'
import { Modal } from 'antd'
import {
  lightGreySecondary,
  themeColor,
  mainBgColor,
  lightBlackBoldText,
  greyThemeLight,
  ligthRed4,
  darkRed2,
} from '@edulastic/colors'
import { Stimulus } from '@edulastic/common'

const rippleAnimation = keyframes`
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(26, 179, 149, 0.5);
    box-shadow: 0 0 0 0 rgba(26, 179, 149,  0.5);
  }
  75% {
      -moz-box-shadow: 0 0 0 10px rgba(26, 179, 149, 0.3);
      box-shadow: 0 0 0 10px rgba(26, 179, 149, 0.3);
  }
  100% {
      -moz-box-shadow: 0 0 0 0 rgba(26, 179, 149, 0);
      box-shadow: 0 0 0 0 rgba(26, 179, 149, 0);
  }
`

const dotsAnimation = keyframes`
  0%, 20% {
    color: rgba(0,0,0,0);
    text-shadow:
      .25em 0 0 rgba(0,0,0,0),
      .5em 0 0 rgba(0,0,0,0);
  }
  40% {
    color: ${greyThemeLight};
    text-shadow:
      .25em 0 0 rgba(0,0,0,0),
      .5em 0 0 rgba(0,0,0,0);
  }
  60% {
    text-shadow:
      .25em 0 0 ${greyThemeLight},
      .5em 0 0 rgba(0,0,0,0);
  }
  80%, 100% {
    text-shadow:
      .25em 0 0 ${greyThemeLight},
      .5em 0 0 ${greyThemeLight};
  }
`

export const StyledStimulus = styled(Stimulus)`
  word-break: break-word;
  overflow: hidden;
`

export const StyledAudioRecorderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 138px;
  background: ${lightGreySecondary} 0% 0% no-repeat padding-box;
  border-radius: 18px;
  opacity: 1;
  margin-top: 20px;
`
export const StyledAudioPlayerContainer = styled.div`
  display: flex;
  width: 100%;
`

export const StyledContainer = styled.div`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent || 'center'};
  align-items: center;
  margin: 0px 7px;
  width: ${({ width }) => width || 'initial'};
  padding: ${({ padding }) => padding || 'initial'};
`

export const StyledButton = styled.button`
  width: 47px;
  height: 47px;
  background: ${themeColor} 0% 0% no-repeat padding-box;
  opacity: 1;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  ${({ isRecording }) =>
    isRecording &&
    css`
      animation-name: ${rippleAnimation};
      animation-duration: 1.5s;
      animation-iteration-count: infinite;
    `}
`

export const StyledUploadingContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 344px;
  height: 56px;
  background: ${mainBgColor} 0% 0% no-repeat padding-box;
  border-radius: 35px;
  opacity: 1;
`

export const StyledText = styled.p`
  text-align: left;
  font: ${({ fontSize }) =>
    `normal normal bold ${fontSize || '14px/19px'} Open Sans;`};
  letter-spacing: 0px;
  color: ${({ isTextBlack }) =>
    isTextBlack ? lightBlackBoldText : greyThemeLight};
  text-transform: uppercase;
  opacity: 1;
  &::after {
    ${({ showLoader }) =>
      showLoader &&
      css`
        content: ' .';
        animation-name: ${dotsAnimation};
        animation-duration: 1s;
        animation-iteration-count: infinite;
      `}
  }
`

export const StyledDivider = styled.div`
  width: 0px;
  height: 15px;
  border: 0.5px solid ${lightBlackBoldText};
  opacity: 0.29;
`

export const StyledTimerContainer = styled.div`
  text-align: left;
  font: normal normal normal 11px/15px Open Sans;
  letter-spacing: 0px;
  color: ${lightBlackBoldText};
  text-transform: uppercase;
  opacity: 1;
`

export const StyledSvg = styled.svg`
  ${({ audioSliderFillCount = 0 }) =>
    audioSliderFillCount &&
    css`
      & > g > rect:nth-child(-n + ${audioSliderFillCount + 1}) {
        fill: ${themeColor};
      }
    `}
`
export const StyledRerecordContainer = styled.div`
  display: flex;
  margin-right: 20px;
`

export const StyledRerecordButton = styled.button`
  width: 32px;
  height: 32px;
  background: ${mainBgColor} 0% 0% no-repeat padding-box;
  border: 2px solid ${themeColor};
  border-radius: 50%;
  opacity: 1;
  cursor: pointer;
`
export const StyledModal = styled(Modal)`
  min-width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  & > .ant-modal-header {
    display: none;
  }
  & > .ant-modal-content {
    width: 450px;
    & > .ant-modal-body {
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    background: ${ligthRed4} 0% 0% no-repeat padding-box;
    border-radius: 6px;
    opacity: 1;
    height: 27px;
    p {
      text-align: left;
      font: normal normal normal 11px/14px Open Sans;
      letter-spacing: 0px;
      color: ${darkRed2};
      opacity: 1;
      margin-right: 12px;
    }
  }
`

export const StyledRecordingDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px;
`
export const StyledRecordingDataContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
`
export const StyledAudioElement = styled.audio`
  width: 364px;
  height: 56px;
`
