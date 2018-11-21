import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { setUserAnswerAction } from '../../actions/answers';
import { getAnswerByQuestionIdSelector } from '../../selectors/answers';

export default (WrappedComponent) => {
  const hocComponent = ({ setUserAnswer, match, questionId, ...props }) => (
    <WrappedComponent
      saveAnswer={(data) => {
        setUserAnswer(questionId || match.params.id, data);
      }}
      questionId={questionId}
      {...props}
    />
  );

  hocComponent.propTypes = {
    setUserAnswer: PropTypes.func.isRequired
  };

  const enhance = compose(
    withRouter,
    connect(
      (state, { questionId, match }) => ({
        userAnswer: getAnswerByQuestionIdSelector(questionId || match.params.id)(state)
      }),
      { setUserAnswer: setUserAnswerAction }
    )
  );

  return enhance(hocComponent);
};
