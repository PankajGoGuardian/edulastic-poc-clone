import React from 'react'
import PropTypes from 'prop-types'
import {
  MathFormulaDisplay,
  QuestionNumberLabel,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper,
} from '@edulastic/common'

import MathEssayInput from './MathEssayInput'

import { QuestionStimulusWrapper } from '../styled/QuestionStimulus'
import { MathEssayInputWrapper } from '../styled/MathEssayInputWrapper'
import Instructions from '../../../components/Instructions'

const FormulaEssayPreview = ({
  item,
  lines,
  setLines,
  showQuestionNumber,
  disableResponse,
}) => (
  <MathEssayInputWrapper>
    <FlexContainer
      justifyContent="flex-start"
      alignItems="baseline"
      width="100%"
    >
      <QuestionLabelWrapper>
        {showQuestionNumber && (
          <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>
        )}
        {item.qSubLabel && (
          <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>
        )}
      </QuestionLabelWrapper>

      <QuestionContentWrapper showQuestionNumber={showQuestionNumber}>
        <QuestionStimulusWrapper>
          <MathFormulaDisplay
            style={{ marginBottom: 15 }}
            dangerouslySetInnerHTML={{ __html: item.stimulus }}
          />
        </QuestionStimulusWrapper>
        <MathEssayInput
          disableResponse={disableResponse}
          item={item}
          textFormattingOptions={
            item.uiStyle && item.uiStyle.textFormattingOptions
          }
          uiStyle={item.uiStyle}
          value={item.template}
          lines={lines}
          setLines={setLines}
          onInput={(latex) => latex}
        />
      </QuestionContentWrapper>
    </FlexContainer>
    <Instructions item={item} />
  </MathEssayInputWrapper>
)

FormulaEssayPreview.propTypes = {
  item: PropTypes.object.isRequired,
  lines: PropTypes.array.isRequired,
  setLines: PropTypes.func.isRequired,
  showQuestionNumber: PropTypes.bool,
  disableResponse: PropTypes.bool,
}
FormulaEssayPreview.defaultProps = {
  disableResponse: false,
  showQuestionNumber: false,
}

export default FormulaEssayPreview
