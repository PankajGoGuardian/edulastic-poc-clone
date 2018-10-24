import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { PaddingDiv, Paper, Checkbox } from '@edulastic/common';
import { cloneDeep } from 'lodash';
import { withNamespaces } from '@edulastic/localization';

import {
  MultipleChoiceAuthoring,
  MultipleChoiceDisplay,
  MultipleChoiceReport,
  CorrectAnswers,
} from './index';
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import Options from './Options/Options';

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

  handleOptionsChange = (name, value) => {
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);

    newItem[name] = value;

    setQuestionData(newItem);
  };

  render() {
    const { view, previewTab, smallSize, item, userAnswer, t } = this.props;
    const { previewStimulus, previewDisplayOptions, itemForEdit } = this.getRenderData();

    return (
      <React.Fragment>
        <Paper style={{ marginBottom: 25 }}>
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
                    userSelections={userAnswer}
                    options={previewDisplayOptions}
                    question={previewStimulus}
                    handleMultiSelect={this.handleMultiSelect}
                    validation={item.validation}
                  />
                )}
                {previewTab === 'show' && (
                  <MultipleChoiceReport
                    showAnswer
                    options={previewDisplayOptions}
                    question={previewStimulus}
                    userSelections={userAnswer}
                    handleMultiSelect={this.handleMultiSelect}
                    validation={item.validation}
                  />
                )}
                {previewTab === 'clear' && (
                  <MultipleChoiceDisplay
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
          <Checkbox
            onChange={() =>
              this.handleOptionsChange('multiple_responses', !item.multiple_responses)
            }
            label={t('component.multiplechoice.multipleResponses')}
            checked={item.multiple_responses}
          />
        </Paper>
        <Options onChange={this.handleOptionsChange} uiStyle={item.ui_style} />
      </React.Fragment>
    );
  }
}

MultipleChoice.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  item: PropTypes.object,
  smallSize: PropTypes.bool,
  history: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  t: PropTypes.func.isRequired,
};

MultipleChoice.defaultProps = {
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
  withNamespaces('assessment'),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction,
    },
  ),
);

export default enhance(MultipleChoice);
