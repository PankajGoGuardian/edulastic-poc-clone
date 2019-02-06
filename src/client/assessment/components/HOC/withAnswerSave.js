import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { setUserAnswerAction } from '../../actions/answers';
import { getAnswerByQuestionIdSelector } from '../../selectors/answers';

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
      (state, { testItemId, data: { id: questionId } }) => ({
        userAnswer: getAnswerByQuestionIdSelector(getQuestionId(testItemId, questionId))(state)
      }),
      { setUserAnswer: setUserAnswerAction }
    )
  );

  return enhance(hocComponent);
};
