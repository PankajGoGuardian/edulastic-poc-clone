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
    previewTab: _previewTab,
    ...props
  }) => {
    const { data: question } = props;
    const questionId = getQuestionId(question.id);
    const answerContext = useContext(AnswerContext);

    const saveAnswer = data => {
      if (answerContext.isAnswerModifiable && questionId) {
        setUserAnswer(questionId, data);
      }
    };

    const userAnswer = answerContext.hideAnswers ? undefined : _userAnswer || userPrevAnswer;
    let previewTab = _previewTab;
    if (_userAnswer === undefined && userPrevAnswer !== undefined && userAnswer !== undefined) {
      previewTab = "check";
    }

    // if review-tab dont pass evaluation forward.
    return (
      <WrappedComponent
        saveAnswer={saveAnswer}
        questionId={questionId}
        userAnswer={userAnswer}
        evaluation={!props.isReviewTab ? evaluation : undefined}
        {...props}
        previewTab={previewTab}
      />
    );
  };

  hocComponent.propTypes = {
    setUserAnswer: PropTypes.func.isRequired
  };

  const enhance = compose(
    withRouter,
    connect(
      (state, props) => ({
        userAnswer: getUserAnswerSelector(state, props),
        userPrevAnswer: getUserPrevAnswerSelector(state, props),
        evaluation: getEvaluationByIdSelector(state, props)
      }),
      {
        setUserAnswer: setUserAnswerAction
      }
    )
  );

  return enhance(hocComponent);
};
