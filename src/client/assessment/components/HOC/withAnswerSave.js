import React, { useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { AnswerContext } from "@edulastic/common";
import { setUserAnswerAction } from "../../actions/answers";
import { getUserAnswerSelector, getEvaluationByIdSelector } from "../../selectors/answers";

const getQuestionId = questionId => questionId || "tmp";

export default WrappedComponent => {
  const hocComponent = ({ setUserAnswer, testItemId, evaluation, ...props }) => {
    const { data: question } = props;
    const questionId = getQuestionId(question.id);
    const answerContext = useContext(AnswerContext);

    const saveAnswer = data => {
      if (answerContext.isAnswerModifiable && questionId) {
        setUserAnswer(questionId, data);
      }
    };
    return <WrappedComponent saveAnswer={saveAnswer} questionId={questionId} evaluation={evaluation} {...props} />;
  };

  hocComponent.propTypes = {
    setUserAnswer: PropTypes.func.isRequired
  };

  const enhance = compose(
    withRouter,
    connect(
      (state, props) => ({
        userAnswer: getUserAnswerSelector(state, props),
        evaluation: getEvaluationByIdSelector(state, props)
      }),
      {
        setUserAnswer: setUserAnswerAction
      }
    )
  );

  return enhance(hocComponent);
};
