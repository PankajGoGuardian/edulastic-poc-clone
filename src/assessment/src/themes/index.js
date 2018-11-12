import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { gotoItem, saveUserResponse, loadUserResponse } from '../actions/items';
import {
  initiateTestActivityAction,
  finishTestAcitivityAction,
} from '../actions/test';
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
  initTestActivity,
  finishTest,
  gotoItem: gotoIt,
  saveUserResponse: saveUser,
  loadUserResponse: loadUser,
  evaluateAnswer: evaluate,
}) => {
  useEffect(() => {
    if (items.length) {
      loadUser(currentItem);
    }
  }, []);

  useEffect(() => {
    initTestActivity();
  }, []);

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
    finishTest,
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
  currentItem: PropTypes.number.isRequired,
  initTestActivity: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    view: state.view.preview,
    items: state.test.items,
    currentItem: state.test.currentItem,
    itemRows: currentItemRowsSelector(state),
  }),
  {
    gotoItem,
    saveUserResponse,
    loadUserResponse,
    evaluateAnswer,
    initTestActivity: initiateTestActivityAction,
    finishTest: finishTestAcitivityAction,
  },
)(AssessmentContainer);
