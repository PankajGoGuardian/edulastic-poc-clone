import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { gotoQuestion } from '../actions/questions';
import AssesmentPlayerDefault from './AssessmentPlayerDefault';

const AssessmentContainer = ({ gotoQuestion, questions, currentQuestion }) => {
  const isLast = () => currentQuestion === questions.length - 1;
  const isFirst = () => currentQuestion === 0;

  const questionSelectChange = (e) => {
    const currentQuestion = parseInt(e.target.value, 10);
    gotoQuestion(currentQuestion);
  };

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
    questionSelectChange,
    questions,
    currentQuestion,
  };

  return <AssesmentPlayerDefault {...props} />;
};

AssessmentContainer.PropType = {
  questions: PropTypes.array.isRequired,
  currentQuestion: PropTypes.number.isRequired,
  gotoQuestion: PropTypes.func.isRequired,
};

export default connect(
  ({ assessmentQuestions: questions }) => ({
    questions: questions.questions,
    currentQuestion: questions.currentQuestion,
  }),
  { gotoQuestion },
)(AssessmentContainer);
