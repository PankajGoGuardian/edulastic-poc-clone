import styled from 'styled-components'
import {
  mobileWidthMax,
  smallDesktopWidth,
  borderGrey2,
  darkOrange1,
  red,
  themeColor,
} from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'
import { AI_EVALUATION_STATUS } from '@edulastic/constants/const/evaluationType'
import { StyledPaperWrapper } from './Widget'

export const StyledFlexContainer = styled(FlexContainer)`
  font-size: ${(props) => props.theme.fontSize};
  overflow: ${({ showScroll }) => showScroll && 'auto'};
  width: 100%;
`

export const QuestionMenuWrapper = styled.div`
  position: relative;
  width: 250px;

  @media (max-width: ${smallDesktopWidth}) {
    display: none;
  }
`

export const RubricTableWrapper = styled.div`
  border: 1px solid ${borderGrey2};
  border-radius: 10px;
  margin-top: 10px;
  padding: 10px 10px 0px;

  .rubric-title {
    font-size: ${(props) => props.theme.titleSectionFontSize};
    font-weight: ${(props) => props.theme.semiBold};
    margin: 0px 16px 10px;
  }
  .rubric-name {
    font-size: ${(props) => props.theme.standardFont};
    margin: 0px 42px 10px;
  }
`

export const QuestionContainer = styled.div`
  padding: ${({ noPadding }) => (noPadding ? '0px' : null)};
  display: ${({ isFlex }) => (isFlex ? 'flex' : 'block')};
  justify-content: space-between;
  ${({ style }) => style};
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
  .ql-indent-1:not(.ql-direction-rtl) {
    padding-left: 3em;
  }
  .ql-indent-1.ql-direction-rtl.ql-align-right {
    padding-right: 3em;
  }
  .ql-indent-2:not(.ql-direction-rtl) {
    padding-left: 6em;
  }
  .ql-indent-2.ql-direction-rtl.ql-align-right {
    padding-right: 6em;
  }
  .ql-indent-3:not(.ql-direction-rtl) {
    padding-left: 9em;
  }
  .ql-indent-3.ql-direction-rtl.ql-align-right {
    padding-right: 9em;
  }
  .ql-indent-4:not(.ql-direction-rtl) {
    padding-left: 12em;
  }
  .ql-indent-4.ql-direction-rtl.ql-align-right {
    padding-right: 12em;
  }
  .ql-indent-5:not(.ql-direction-rtl) {
    padding-left: 15em;
  }
  .ql-indent-5.ql-direction-rtl.ql-align-right {
    padding-right: 15em;
  }
  .ql-indent-6:not(.ql-direction-rtl) {
    padding-left: 18em;
  }
  .ql-indent-6.ql-direction-rtl.ql-align-right {
    padding-right: 18em;
  }
  .ql-indent-7:not(.ql-direction-rtl) {
    padding-left: 21em;
  }
  .ql-indent-7.ql-direction-rtl.ql-align-right {
    padding-right: 21em;
  }
  .ql-indent-8:not(.ql-direction-rtl) {
    padding-left: 24em;
  }
  .ql-indent-8.ql-direction-rtl.ql-align-right {
    padding-right: 24em;
  }
  .ql-indent-9:not(.ql-direction-rtl) {
    padding-left: 27em;
  }
  .ql-indent-9.ql-direction-rtl.ql-align-right {
    padding-right: 27em;
  }

  .print-preview-feedback {
    width: 100%;
    padding: 0 35px;
  }

  /**
 * @see https://snapwiz.atlassian.net/browse/EV-21030
 * zwibbler canvas has z-index 999
 */
  .fr-video {
    z-index: 1000;
  }

  @media print {
    .__print_question-content-wrapper {
      max-width: calc(100% - 55px);
      display: block !important;
      position: relative !important;
      /**
	 * @see https://snapwiz.atlassian.net/browse/EV-30606
	 */
      .katex .halfarrow-left,
      .katex .halfarrow-right {
        overflow: hidden !important;
      }
      .fr-toolbar {
        display: none !important;
      }
    }
    .question-wrapper {
      padding: 5px;
    }
    .__print-question-option {
      margin-top: 20px !important;
    }
    .__print-question-main-wrapper {
      display: inline-table;
      width: 100%;
    }
    .__print-space-reduce {
      &-qlabel {
        margin-right: 0.5rem !important;
        margin-bottom: 0.5rem !important;
      }
      &-option {
        align-items: flex-start !important;
      }
      &-options {
        margin-bottom: 0px !important;
        label {
          padding: 0 !important;
        }
      }
      &-stimulus {
        margin-bottom: 5px !important;
        & p {
          br {
            display: none !important;
          }
        }
      }
    }
  }
`

export const EvaluationMessage = styled.div`
  color: rgb(250, 135, 52);
  width: 100%;
  text-align: center;
`

export const getBgColor = ({ aiEvaluationStatus }) => {
  switch (aiEvaluationStatus) {
    case AI_EVALUATION_STATUS.PENDING:
      return darkOrange1
    case AI_EVALUATION_STATUS.FAILED:
      return red
    default:
      return themeColor
  }
}

export const AiEvaluationWrapper = styled.div`
  height: 24px;
  width: content-width;
  background: ${getBgColor};
  margin-left: auto;
  border-radius: 3px;
  padding: 2px 7px;
`

export const AiEvaluationMessage = styled.div`
  color: white;
  width: 100%;
  text-align: center;
`

export const ManualEvaluationMessage = styled.div`
  text-align: center;
  height: 24px;
  width: content-width;
  margin-top: 3px;
  margin-left: auto;
  border-radius: 3px;
  color: ${themeColor};
`
export const getPadding = ({
  flowLayout,
  isV1Multipart,
  isStudentReport,
  isLCBView,
}) => {
  // use the same padding for top, bottom, and left in everywhere,
  // so we wil render scratchpad data in the same position
  if (flowLayout) {
    return '8px 0px'
  }
  if (isV1Multipart) {
    return '8px 35px'
  }
  if (isStudentReport) {
    return '8px 16px'
  }
  if (isLCBView) {
    return '8px 28px 8px'
  }
  return '8px 16px'
}

export const PaperWrapper = styled(StyledPaperWrapper)`
  padding: ${getPadding};
  min-width: ${({ style }) => style.minWidth};
  ${({ style }) => style};

  @media (max-width: ${mobileWidthMax}) {
    padding: ${({ flowLayout }) => (flowLayout ? '0px' : '8px')};
    margin-bottom: 15px;
  }
`
