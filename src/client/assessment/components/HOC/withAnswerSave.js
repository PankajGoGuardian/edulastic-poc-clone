import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { setUserAnswerAction } from '../../actions/answers';
import { getAnswerByQuestionIdSelector } from '../../selectors/answers';
import createShowAnswerData from '../../../author/src/utils/showAnswer';

const getQuestionId = questionId => questionId || 'tmp';

export default (WrappedComponent) => {
  const hocComponent = ({ setUserAnswer, testItemId, ...props }) => {
    const { data: question } = props;
    const questionId = getQuestionId(question.id);

    return (
      <WrappedComponent
        saveAnswer={(data) => {
          setUserAnswer(questionId, data);
        }}
        questionId={questionId}
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
      (state, { data }) => {
        const { id: qId, activity } = data;
        let userAnswer;
        if (activity && activity.userResponse) {
          userAnswer = activity.userResponse;
        } else {
          userAnswer = getAnswerByQuestionIdSelector(getQuestionId(qId))(state);
        }
        const validation = {
          [qId]: data
        };
        let evaluations = [];
        if (data.validation) {
          evaluations = createShowAnswerData(validation, userAnswer || {});
        }
        return {
          userAnswer,
          evaluation: evaluations[[qId]] || []
        };
      },
      { setUserAnswer: setUserAnswerAction }
    )
  );

  return enhance(hocComponent);
};
