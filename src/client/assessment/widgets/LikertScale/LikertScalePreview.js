import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  Stimulus,
  QuestionNumberLabel,
  FlexContainer,
  QuestionSubLabel,
} from '@edulastic/common'
import LikertScaleDisplay from './components/Display/LikertScaleDisplay'

const LikertScalePreview = ({
  view,
  showQuestionNumber,
  flowLayout,
  item = {},
  saveAnswer,
  userAnswer,
  inLCB,
  isStudentReport,
  isLCBView,
}) => {
  const { stimulus, options, qLabel, qSubLabel } = item
  return (
    <FlexContainer alignItems="flex-start" justifyContent="flex-start">
      {!flowLayout && (
        <>
          <FlexContainer
            justifyContent="flex-start"
            flexDirection="column"
            alignItems="flex-start"
          >
            {showQuestionNumber && (
              <QuestionNumberLabel className="__print-space-reduce-qlabel">
                {qLabel}
              </QuestionNumberLabel>
            )}
            {qSubLabel && <QuestionSubLabel>({qSubLabel})</QuestionSubLabel>}
          </FlexContainer>

          <FlexContainer
            width="100%"
            className="__print_question-content-wrapper"
            flexDirection="column"
            alignItems="flex-start"
            data-cy="question-content-wrapper"
          >
            <StyledStimulus
              dangerouslySetInnerHTML={{ __html: stimulus }}
              className="_print-space-reduce-stimulus"
            />
            <LikertScaleDisplay
              options={options}
              view={view}
              saveAnswer={saveAnswer}
              userAnswer={userAnswer}
              disableOptions={inLCB || isStudentReport || isLCBView}
            />
          </FlexContainer>
        </>
      )}
    </FlexContainer>
  )
}

LikertScalePreview.propTypes = {
  view: PropTypes.string.isRequired,
  showQuestionNumber: PropTypes.bool,
  flowLayout: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.string,
  inLCB: PropTypes.bool,
  isStudentReport: PropTypes.bool,
  isLCBView: PropTypes.bool,
}

LikertScalePreview.defaultProps = {
  userAnswer: '',
  showQuestionNumber: false,
  inLCB: false,
  isStudentReport: false,
  isLCBView: false,
}

const StyledStimulus = styled(Stimulus)`
  word-break: break-word;
  overflow: hidden;
`

export default LikertScalePreview
