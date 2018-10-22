import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setUserAnswerAction } from '../../actions/answers';
import { getAnswerByQuestionIdSelector } from '../../selectors/answers';

export default (WrappedComponent) => {
  const hocComponent = ({ setUserAnswer, questionId, ...props }) => (
    <WrappedComponent saveAnswer={data => setUserAnswer(questionId, data)} {...props} />
  );

  hocComponent.propTypes = {
    setUserAnswer: PropTypes.func.isRequired,
  };

  return connect(
    (state, { questionId }) => ({
      userAnswer: getAnswerByQuestionIdSelector(questionId)(state),
    }),
    { setUserAnswer: setUserAnswerAction },
  )(hocComponent);
};
