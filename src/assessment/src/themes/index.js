import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { gotoQuestion as gotoQuestionAction } from '../actions/questions';
import AssesmentPlayerDefault from './AssessmentPlayerDefault';
import AssesmentPlayerSimple from './AssessmentPlayerSimple';

const AssessmentContainer = ({
  gotoQuestion,
  questions,
  currentQuestion,
  defaultAP
}) => {
  const isLast = () => currentQuestion === questions.length - 1;
  const isFirst = () => currentQuestion === 0;

  const moveToNext = () => {
    if (!isLast()) {
      gotoQuestion(currentQuestion + 1);
    }
  };

  const moveToPrev = () => {
    if (!isFirst()) gotoQuestion(currentQuestion - 1);
  };

  const props = {
    isFirst,
    isLast,
    moveToNext,
    moveToPrev,
    questions,
    currentQuestion,
    gotoQuestion
  };

  return defaultAP ? (
    <AssesmentPlayerDefault {...props} />
  ) : (
    <AssesmentPlayerSimple {...props} />
  );
};

AssessmentContainer.PropType = {
  questions: PropTypes.array.isRequired,
  currentQuestion: PropTypes.number.isRequired,
  gotoQuestion: PropTypes.func.isRequired
};

export default connect(
  ({ assessmentQuestions: questions }) => ({
    questions: questions.questions,
    currentQuestion: questions.currentQuestion
  }),
  { gotoQuestion: gotoQuestionAction }
)(AssessmentContainer);
