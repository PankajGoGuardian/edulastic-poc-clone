import React, { useEffect } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { gotoItem, saveUserResponse } from '../actions/items';
import { finishTestAcitivityAction } from '../actions/test';
import { evaluateAnswer } from '../actions/evaluation';
import { changePreview as changePreviewAction } from '../actions/view';
import { startAssessmentAction } from '../actions/assessment';
import AssesmentPlayerDefault from './AssessmentPlayerDefault';
import AssesmentPlayerSimple from './AssessmentPlayerSimple';

import { currentItemRowsSelector } from '../selectors/item';

const AssessmentContainer = ({
  view,
  items,
  defaultAP,
  finishTest,
  history,
  changePreview,
  startAssessment,
  saveUserResponse: saveUser,
  evaluateAnswer: evaluate,
  match,
  url
}) => {
  let { qid = 0 } = match.params;
  let currentItem = Number(qid);
  const isLast = () => currentItem === items.length - 1;
  const isFirst = () => currentItem === 0;

  // start assessment
  useEffect(() => {
    startAssessment();
  }, []);

  const gotoQuestion = index => {
    history.push(`${url}/qid/${index}`);
    saveUser(currentItem);
    changePreview('clear');
  };

  const moveToNext = () => {
    if (!isLast()) {
      gotoQuestion(Number(currentItem) + 1);
    }
    if (isLast()) {
      saveUser(currentItem);
      history.push('/student/test-summary');
    }
  };

  const moveToPrev = () => {
    if (!isFirst()) gotoQuestion(Number(currentItem) - 1);
  };

  let itemRows = items[currentItem] && items[currentItem].rows;

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
  url: PropTypes.string.isRequired
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      view: state.view.preview,
      items: state.test.items,
      itemRows: currentItemRowsSelector(state)
    }),
    {
      saveUserResponse,
      evaluateAnswer,
      changePreview: changePreviewAction,
      startAssessment: startAssessmentAction,
      finishTest: finishTestAcitivityAction
    }
  )
);

export default enhance(AssessmentContainer);
