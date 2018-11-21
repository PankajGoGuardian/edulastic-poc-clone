import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { gotoItem, saveUserResponse } from '../actions/items';
import { finishTestAcitivityAction } from '../actions/test';
import { evaluateAnswer } from '../actions/evaluation';

import AssesmentPlayerDefault from './AssessmentPlayerDefault';
import AssesmentPlayerSimple from './AssessmentPlayerSimple';

import { currentItemRowsSelector } from '../selectors/item';

const AssessmentContainer = ({
  view,
  items,
  itemRows,
  defaultAP,
  currentItem,
  finishTest,
  gotoItem: gotoIt,
  saveUserResponse: saveUser,
  evaluateAnswer: evaluate
}) => {
  const isLast = () => currentItem === items.length - 1;
  const isFirst = () => currentItem === 0;

  const gotoQuestion = (index) => {
    gotoIt(index);
    saveUser(currentItem);
  };

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
    itemRows,
    evaluate,
    view,
    finishTest
  };

  return defaultAP ? (
    <AssesmentPlayerDefault {...props} />
  ) : (
    <AssesmentPlayerSimple {...props} />
  );
};

AssessmentContainer.propTypes = {
  gotoItem: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  currentItem: PropTypes.number.isRequired
};

export default connect(
  state => ({
    view: state.view.preview,
    items: state.test.items,
    currentItem: state.test.currentItem,
    itemRows: currentItemRowsSelector(state)
  }),
  {
    gotoItem,
    saveUserResponse,
    evaluateAnswer,
    finishTest: finishTestAcitivityAction
  }
)(AssessmentContainer);
