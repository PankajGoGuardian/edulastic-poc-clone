import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { PaddingDiv } from '@edulastic/common';
import { cloneDeep } from 'lodash';

import {
  ClozeDragDropAuthoring,
  ClozeDragDropDisplay,
  ClozeDragDropReport,
  CorrectAnswers,
} from './index';
import { setQuestionDataAction } from '../../../../author/src/actions/question';

class ClozeDragDrop extends Component {
  getRenderData = () => {
    const { item, history } = this.props;
    const locationState = history.location.state;
    const isDetailPage = locationState !== undefined ? locationState.itemDetail : false;
    let previewDisplayOptions;
    let previewStimulus;
    let itemForEdit;
    if (item.smallSize || isDetailPage) {
      previewStimulus = item.stimulus;
      previewDisplayOptions = item.options;
      itemForEdit = item;
    } else {
      previewStimulus = item.stimulus;
      previewDisplayOptions = item.options;
      itemForEdit = {
        ...item,
        stimulus: item.stimulus,
        list: item.options,
        validation: item.validation,
      };
    }
    return {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
    };
  };

  handleAddAltResponses = () => {
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);

    const response = {
      score: 1,
      value: [],
    };

    if (newItem.validation.alt_responses && newItem.validation.alt_responses.length) {
      newItem.validation.alt_responses.push(response);
    } else {
      newItem.validation.alt_responses = [response];
    }

    setQuestionData(newItem);
  };

  handleAddAnswer = (qid) => {
    const { saveAnswer, userAnswer } = this.props;
    const newAnswer = cloneDeep(userAnswer);

    if (newAnswer.includes(qid)) {
      const removeIndex = newAnswer.findIndex(el => el === qid);
      newAnswer.splice(removeIndex, 1);
      saveAnswer(newAnswer);
    } else {
      saveAnswer([...newAnswer, qid]);
    }
  };

  render() {
    const { view, previewTab, smallSize, item, userAnswer } = this.props;
    const { previewStimulus, previewDisplayOptions, itemForEdit } = this.getRenderData();

    return (
      <PaddingDiv>
        {view === 'edit' && (
          <React.Fragment>
            <ClozeDragDropAuthoring item={itemForEdit} />
            <CorrectAnswers
              validation={item.validation}
              options={previewDisplayOptions}
              question={previewStimulus}
              onAddAltResponses={this.handleAddAltResponses}
            />
          </React.Fragment>
        )}
        {view === 'preview' && (
          <React.Fragment>
            {previewTab === 'check' && (
              <ClozeDragDropReport
                checkAnswer
                userSelections={userAnswer}
                options={previewDisplayOptions}
                question={previewStimulus}
                handleMultiSelect={this.handleMultiSelect}
                validation={item.validation}
              />
            )}
            {previewTab === 'show' && (
              <ClozeDragDropReport
                showAnswer
                options={previewDisplayOptions}
                question={previewStimulus}
                userSelections={userAnswer}
                handleMultiSelect={this.handleMultiSelect}
                validation={item.validation}
              />
            )}
            {previewTab === 'clear' && (
              <ClozeDragDropDisplay
                preview
                key={previewDisplayOptions && previewStimulus}
                smallSize={smallSize}
                options={previewDisplayOptions}
                validation={item.validation}
                question={previewStimulus}
                data={item}
                userSelections={userAnswer}
                onChange={this.handleAddAnswer}
              />
            )}
          </React.Fragment>
        )}
      </PaddingDiv>
    );
  }
}

ClozeDragDrop.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  item: PropTypes.object,
  smallSize: PropTypes.bool,
  history: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
};

ClozeDragDrop.defaultProps = {
  previewTab: 'clear',
  item: {
    options: [],
  },
  smallSize: false,
  history: {},
  userAnswer: [],
};

const enhance = compose(
  withRouter,
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction,
    },
  ),
);

export default enhance(ClozeDragDrop);
