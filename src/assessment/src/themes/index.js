import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { gotoItem, saveUserResponse, loadUserResponse } from '../actions/items';
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
  gotoItem: gotoIt,
  saveUserResponse: saveUser,
  loadUserResponse: loadUser,
  evaluateAnswer: evaluate,
}) => {
  const isLast = () => currentItem === items.length - 1;
  const isFirst = () => currentItem === 0;

  const gotoQuestion = (index) => {
    gotoIt(index);
    saveUser(currentItem);
    loadUser(index);
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
  };

  return defaultAP ? (
    <AssesmentPlayerDefault {...props} />
  ) : (
    <AssesmentPlayerSimple {...props} />
  );
};

AssessmentContainer.propTypes = {
  gotoQuestion: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  currentItem: PropTypes.number.isRequired,
};

export default connect(
  state => ({
    view: state.view.preview,
    items: state.test.items,
    currentItem: state.test.currentItem,
    itemRows: currentItemRowsSelector(state),
  }),
  { gotoItem, saveUserResponse, loadUserResponse, evaluateAnswer },
)(AssessmentContainer);
