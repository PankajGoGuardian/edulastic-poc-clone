import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { gotoItem } from '../actions/items';
import AssesmentPlayerDefault from './AssessmentPlayerDefault';
import AssesmentPlayerSimple from './AssessmentPlayerSimple';

const AssessmentContainer = ({
  gotoQuestion,
  questions,
  currentQuestion,
  currentItem,
  defaultAP,
  items
}) => {
  const isLast = () => currentItem === items.length - 1;
  const isFirst = () => currentItem === 0;

  const moveToNext = () => {
    if (!isLast()) {
      gotoQuestion(currentItem + 1);
    }
  };

  const moveToPrev = () => {
    if (!isFirst()) gotoQuestion(currentItem - 1);
  };

  const props = {
    items,
    isFirst,
    isLast,
    moveToNext,
    moveToPrev,
    questions,
    currentQuestion,
    currentItem,
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
  ({ assessmentQuestions: questions, test }) => ({
    questions: questions.questions,
    items: test.items,
    currentItem: test.currentItem,
    currentQuestion: questions.currentQuestion
  }),
  { gotoQuestion: gotoItem }
)(AssessmentContainer);
