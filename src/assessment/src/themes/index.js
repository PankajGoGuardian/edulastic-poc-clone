import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { gotoItem } from '../actions/items';
import AssesmentPlayerDefault from './AssessmentPlayerDefault';
import AssesmentPlayerSimple from './AssessmentPlayerSimple';

import { currentItemRowsSelector } from '../selectors/item';
const AssessmentContainer = ({
  gotoQuestion,
  currentItem,
  defaultAP,
  items,
  itemRows
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
    gotoQuestion,
    itemRows
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
  state => ({
    items: state.test.items,
    currentItem: state.test.currentItem,
    itemRows: currentItemRowsSelector(state)
  }),
  { gotoQuestion: gotoItem }
)(AssessmentContainer);
