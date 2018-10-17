import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { gotoItem } from '../actions/items';
import AssesmentPlayerDefault from './AssessmentPlayerDefault';
import AssesmentPlayerSimple from './AssessmentPlayerSimple';

const AssessmentContainer = ({
  gotoQuestion,
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
  gotoQuestion: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  currentItem: PropTypes.number.isRequired
};

export default connect(
  ({ test }) => ({
    items: test.items,
    currentItem: test.currentItem
  }),
  { gotoQuestion: gotoItem }
)(AssessmentContainer);
