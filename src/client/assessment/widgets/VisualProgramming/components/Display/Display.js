import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { withNamespaces } from '@edulastic/localization'
import {
  Stimulus,
  QuestionNumberLabel,
  FlexContainer,
  QuestionSubLabel,
  CorrectAnswersContainer,
} from '@edulastic/common'
import { isEmpty } from 'lodash'
import Instructions from '../../../../components/Instructions'
import { EDIT } from '../../../../constants/constantsForQuestions'
import VisualEditor from '../VisualEditor/VisualEditor'

// import Options, { SortableOptions } from './components/Options'
// import { QuestionTitleWrapper } from "./styled/Label";

const Display = ({
  qIndex,
  view,
  smallSize,
  question,
  uiStyle,
  instructorStimulus,
  index,
  styleType,
  multipleResponses,
  showQuestionNumber,
  flowLayout,
  qLabel,
  fontSize,
  item = {},
  qSubLabel,
  fromSetAnswers,
  onSortOptions,
  ...restProps
}) => {
  const {
    t,
    hideCorrectAnswer,
    showAnswer,
    showAnswerScore,
    onChange,
  } = restProps

  const OptListComp = React.Fragment // fromSetAnswers ? SortableOptions : Options
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
              <QuestionNumberLabel
                fontSize={fontSize}
                className="__print-space-reduce-qlabel"
              >
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
            {!fromSetAnswers && (
              <StyledStimulus
                fontSize={fontSize}
                dangerouslySetInnerHTML={{ __html: question }}
                className="_print-space-reduce-stimulus"
              />
            )}
            <OptListComp
              view={view}
              smallSize={smallSize}
              question={question}
              uiStyle={uiStyle}
              styleType={styleType}
              multipleResponses={multipleResponses}
              fontSize={fontSize}
              fromSetAnswers={fromSetAnswers}
              item={item}
              distance={10}
              useDragHandle
              onSortEnd={onSortOptions}
              {...restProps}
            />
            <VisualEditor
              initialCode={
                isEmpty(restProps.userSelections)
                  ? item.initialCode
                  : restProps.userSelections
              }
              onChange={onChange}
            />
            {view !== EDIT && <Instructions item={item} />}

            {showAnswer &&
              showAnswerScore &&
              !hideCorrectAnswer &&
              !!item?.validation?.validResponse && (
                <CorrectAnswersContainer
                  title={t('component.math.correctAnswers')}
                  minHeight="auto"
                  showAnswerScore={showAnswerScore}
                  score={item.validation.validResponse?.score}
                />
              )}

            {showAnswer &&
              showAnswerScore &&
              !hideCorrectAnswer &&
              item?.validation?.altResponses?.map((ans, i) => (
                <CorrectAnswersContainer
                  title={`${t('component.math.alternateAnswers')} ${i + 1}`}
                  minHeight="auto"
                  showAnswerScore={showAnswerScore}
                  score={ans?.score}
                />
              ))}
          </FlexContainer>
        </>
      )}
    </FlexContainer>
  )
}

Display.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  showAnswer: PropTypes.bool,
  validation: PropTypes.object,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  question: PropTypes.string.isRequired,
  instructorStimulus: PropTypes.string,
  uiStyle: PropTypes.object,
  qLabel: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  qIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  fontSize: PropTypes.any.isRequired,
  item: PropTypes.object.isRequired,
  styleType: PropTypes.string,
  multipleResponses: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  flowLayout: PropTypes.bool,
  qSubLabel: PropTypes.string,
}

Display.defaultProps = {
  options: [],
  onChange: () => {},
  showAnswer: false,
  checkAnswer: false,
  validation: {},
  userSelections: [],
  smallSize: false,
  instructorStimulus: '',
  uiStyle: {
    type: 'standard',
    fontsize: 'normal',
    columns: 1,
    orientation: 'horizontal',
    choiceLabel: 'number',
  },
  showQuestionNumber: false,
  flowLayout: false,
  styleType: 'default',
  multipleResponses: false,
  qSubLabel: '',
}

const StyledStimulus = styled(Stimulus)`
  word-break: break-word;
  overflow: hidden;
  img {
    padding: 0px;
  }
`

export default withNamespaces('assessment')(Display)
