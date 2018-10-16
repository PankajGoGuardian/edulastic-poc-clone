import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { PaddingDiv } from '@edulastic/common';
import { cloneDeep } from 'lodash';

import {
  MultipleChoiceAuthoring,
  MultipleChoiceDisplay,
  MultipleChoiceReport,
  CorrectAnswers,
} from './index';
import {
  addQuestion as addQuestionAction,
  addAnswer as addAnswerAction,
} from '../../actions/questions';
import { getPreivewTabSelector } from './selectors/preview';
import { setQuestionDataAction } from '../../../../author/src/actions/question';

class MultipleChoice extends Component {
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

  get userSelections() {
    const { item } = this.props;
    return item.options.map(o => o.label);
  }

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

  render() {
    const { view, previewTab, smallSize, item, addAnswer, answer } = this.props;
    const { previewStimulus, previewDisplayOptions, itemForEdit } = this.getRenderData();

    return (
      <PaddingDiv>
        {view === 'edit' && (
          <React.Fragment>
            <MultipleChoiceAuthoring item={itemForEdit} />
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
              <MultipleChoiceReport
                checkAnswer
                userSelections={this.userSelections}
                options={previewDisplayOptions}
                question={previewStimulus}
                handleMultiSelect={this.handleMultiSelect}
              />
            )}
            {previewTab === 'show' && (
              <MultipleChoiceReport
                showAnswer
                options={previewDisplayOptions}
                question={previewStimulus}
                userSelections={this.userSelections}
                handleMultiSelect={this.handleMultiSelect}
              />
            )}
            {previewTab === 'clear' && (
              <MultipleChoiceDisplay
                preview
                key={previewDisplayOptions && previewStimulus}
                smallSize={smallSize}
                options={previewDisplayOptions}
                answer={answer}
                question={previewStimulus}
                addAnswer={addAnswer}
                data={item}
                userSelections={!!item && item.userSelections ? item.userSelections : []}
                onChange={addAnswer}
              />
            )}
          </React.Fragment>
        )}
      </PaddingDiv>
    );
  }
}

MultipleChoice.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  item: PropTypes.object,
  smallSize: PropTypes.bool,
  history: PropTypes.object,
  answer: PropTypes.any,
  addAnswer: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
};

MultipleChoice.defaultProps = {
  item: {
    options: [],
  },
  smallSize: false,
  history: {},
  answer: {},
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      previewTab: getPreivewTabSelector(state),
    }),
    {
      addAnswer: addAnswerAction,
      setQuestionData: setQuestionDataAction,
      add: addQuestionAction,
    },
  ),
);

export default enhance(MultipleChoice);
