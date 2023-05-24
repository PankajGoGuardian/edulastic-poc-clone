import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { AnswerContext } from '@edulastic/common'
import { isUndefined } from 'lodash'
import { setUserAnswerAction } from '../../actions/answers'
import {
  getUserAnswerSelector,
  getEvaluationByIdSelector,
  getUserPrevAnswerSelector,
  getAIEvaluationByIdSelector,
} from '../../selectors/answers'
import { changedPlayerContentAction } from '../../../author/sharedDucks/testPlayer'

const getQuestionId = (questionId) => questionId || 'tmp'

export default (WrappedComponent) => {
  const hocComponent = ({
    setUserAnswer,
    testItemId,
    evaluation,
    aiEvaluationStatus,
    userAnswer: _userAnswer,
    userPrevAnswer,
    changedPlayerContent,
    ...props
  }) => {
    const { data: question } = props
    const questionId = getQuestionId(question?.id)
    const answerContext = useContext(AnswerContext)
    const saveAnswer = (data) => {
      if (answerContext.isAnswerModifiable && questionId) {
        const _testItemId =
          testItemId || props.itemId || props.data?.activity?.testItemId
        setUserAnswer(_testItemId, questionId, data)
        changedPlayerContent()
      }
    }

    const userAnswer = answerContext.hideAnswers
      ? undefined
      : isUndefined(_userAnswer)
      ? userPrevAnswer
      : _userAnswer

    // `isReviewTab` is being only passed from test page's review tab, in which case
    // userAnswer nor evaluation should be propagated forward. Doing the same will cause
    // issues since we are using showAnswer view, but userAnswer not evaluation should be shown
    // residues form other components (esp. popup) can pollute the store - all components
    // share evaluation/answer store.
    return (
      <WrappedComponent
        saveAnswer={saveAnswer}
        questionId={questionId}
        userAnswer={!props.isReviewTab ? userAnswer : undefined}
        evaluation={!props.isReviewTab ? evaluation : undefined}
        aiEvaluationStatus={!props.isReviewTab ? aiEvaluationStatus : undefined}
        {...props}
      />
    )
  }

  hocComponent.propTypes = {
    setUserAnswer: PropTypes.func.isRequired,
  }

  const enhance = compose(
    withRouter,
    connect(
      (state, props) => {
        return {
          userAnswer: getUserAnswerSelector(state, props),
          userPrevAnswer: getUserPrevAnswerSelector(state, props),
          evaluation: getEvaluationByIdSelector(state, props),
          aiEvaluationStatus: getAIEvaluationByIdSelector(state, props),
        }
      },
      {
        setUserAnswer: setUserAnswerAction,
        changedPlayerContent: changedPlayerContentAction,
      }
    )
  )

  return enhance(hocComponent)
}
