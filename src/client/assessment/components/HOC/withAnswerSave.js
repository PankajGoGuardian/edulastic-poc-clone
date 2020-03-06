import React, { useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { AnswerContext } from "@edulastic/common";
import { setUserAnswerAction } from "../../actions/answers";
import { getUserAnswerSelector, getEvaluationByIdSelector, getUserPrevAnswerSelector } from "../../selectors/answers";

const getQuestionId = questionId => questionId || "tmp";

export default WrappedComponent => {
  const hocComponent = ({
    setUserAnswer,
    testItemId,
    evaluation,
    userAnswer: _userAnswer,
    userPrevAnswer,
    ...props
  }) => {
    const { data: question } = props;
    const questionId = getQuestionId(question?.id);
    const answerContext = useContext(AnswerContext);

    const saveAnswer = data => {
      if (answerContext.isAnswerModifiable && questionId) {
        setUserAnswer(questionId, data);
      }
    };

    const userAnswer = answerContext.hideAnswers ? undefined : _userAnswer || userPrevAnswer;

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
        {...props}
      />
    );
  };

  hocComponent.propTypes = {
    setUserAnswer: PropTypes.func.isRequired
  };

  const enhance = compose(
    withRouter,
    connect(
      (state, props) => {
        return {
          userAnswer: getUserAnswerSelector(state, props),
          userPrevAnswer: getUserPrevAnswerSelector(state, props),
          evaluation: getEvaluationByIdSelector(state, props)
        };
      },
      {
        setUserAnswer: setUserAnswerAction
      }
    )
  );

  return enhance(hocComponent);
};
