import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { setUserAnswerAction } from '../../actions/answers';
import { getAnswerByQuestionIdSelector } from '../../selectors/answers';

export default (WrappedComponent) => {
  const hocComponent = ({ setUserAnswer, match, testItemId, ...props }) => {
    const { data: question } = props;
    return (
      <WrappedComponent
        saveAnswer={(data) => {
          setUserAnswer(question.id || match.params.id || testItemId, data);
        }}
        questionId={question.id || testItemId}
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
      (state, { testItemId }) => ({
        userAnswer: getAnswerByQuestionIdSelector(testItemId)(state)
      }),
      { setUserAnswer: setUserAnswerAction }
    )
  );

  return enhance(hocComponent);
};
