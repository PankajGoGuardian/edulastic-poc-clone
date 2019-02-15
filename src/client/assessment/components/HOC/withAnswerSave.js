import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { setUserAnswerAction } from '../../actions/answers';
import { getAnswerByQuestionIdSelector } from '../../selectors/answers';
import createShowAnswerData from '../../../author/src/utils/showAnswer';

const getQuestionId = (testItemId, questionId) => testItemId || questionId || 'tmp';

export default (WrappedComponent) => {
  const hocComponent = ({ setUserAnswer, testItemId, ...props }) => {
    const { data: question } = props;
    const questionId = getQuestionId(testItemId, question.id);

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
      (state, { data, match }) => {
        const { id: qId, activity } = data;
        let userAnswer;
        if (activity && activity.userResponse) {
          userAnswer = activity.userResponse;
        } else {
          const { params: { id: testItemId } } = match;
          userAnswer = getAnswerByQuestionIdSelector(getQuestionId(testItemId, qId))(state);
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
