import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { setUserAnswerAction } from '../../actions/answers';
import { getAnswerByQuestionIdSelector } from '../../selectors/answers';

export default (WrappedComponent) => {
  const hocComponent = ({ setUserAnswer, match, ...props }) => {
    const { data: question } = props;
    return (
      <WrappedComponent
        saveAnswer={(data) => {
          setUserAnswer(question.id || match.params.id, data);
        }}
        questionId={question.id}
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
      (state, { data: { id } }) => ({
        userAnswer: getAnswerByQuestionIdSelector(id)(state)
      }),
      { setUserAnswer: setUserAnswerAction }
    )
  );

  return enhance(hocComponent);
};
