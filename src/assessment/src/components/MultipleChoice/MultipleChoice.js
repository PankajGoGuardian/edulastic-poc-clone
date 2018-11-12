import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { PaddingDiv, Paper, Checkbox } from '@edulastic/common';
import { cloneDeep } from 'lodash';
import { withNamespaces } from '@edulastic/localization';

import styled from 'styled-components';
import { MultipleChoiceAuthoring, MultipleChoiceDisplay, CorrectAnswers } from './index';
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import Options from './Options/Options';

const EmptyWrapper = styled.div``;

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
      uiStyle: item.ui_style,
      multipleResponses: !!item.multiple_responses,
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
    const { saveAnswer, userAnswer, item } = this.props;
    const newAnswer = cloneDeep(userAnswer);

    if (item.multiple_responses) {
      if (newAnswer.includes(qid)) {
        const removeIndex = newAnswer.findIndex(el => el === qid);
        newAnswer.splice(removeIndex, 1);
        saveAnswer(newAnswer);
      } else {
        saveAnswer([...newAnswer, qid]);
      }
    } else {
      saveAnswer([qid]);
    }
  };

  handleOptionsChange = (name, value) => {
    const { setQuestionData, item, saveAnswer } = this.props;
    const newItem = cloneDeep(item);
    const reduceResponses = (acc, val, index) => {
      if (index === 0) {
        acc.push(val);
      }
      return acc;
    };

    if (name === 'multiple_responses' && value === false) {
      newItem.validation.valid_response.value = newItem.validation.valid_response.value.reduce(
        reduceResponses,
        [],
      );
      newItem.validation.alt_responses = newItem.validation.alt_responses.map((res) => {
        res.value = res.value.reduce(reduceResponses, []);
        return res;
      });
      saveAnswer([]);
    }

    newItem[name] = value;

    setQuestionData(newItem);
  };

  render() {
    const { view, previewTab, smallSize, item, userAnswer, t, testItem, evaluation } = this.props;
    const {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      uiStyle,
      multipleResponses,
    } = this.getRenderData();

    const Wrapper = testItem ? EmptyWrapper : Paper;

    return (
      <React.Fragment>
        <PaddingDiv>
          {view === 'edit' && (
            <React.Fragment>
              <Paper style={{ marginBottom: 25 }}>
                <MultipleChoiceAuthoring item={itemForEdit} />
                <CorrectAnswers
                  uiStyle={uiStyle}
                  options={previewDisplayOptions}
                  question={previewStimulus}
                  multipleResponses={multipleResponses}
                  onAddAltResponses={this.handleAddAltResponses}
                  validation={item.validation}
                />
                <Checkbox
                  onChange={() =>
                    this.handleOptionsChange('multiple_responses', !multipleResponses)
                  }
                  label={t('component.multiplechoice.multipleResponses')}
                  checked={multipleResponses}
                />
              </Paper>
              <Options onChange={this.handleOptionsChange} uiStyle={uiStyle} />
            </React.Fragment>
          )}
          {view === 'preview' && (
            <Wrapper>
              {previewTab === 'check' && (
                <MultipleChoiceDisplay
                  checkAnswer
                  data={item}
                  onChange={this.handleAddAnswer}
                  smallSize={smallSize}
                  userSelections={userAnswer}
                  options={previewDisplayOptions}
                  question={previewStimulus}
                  handleMultiSelect={this.handleMultiSelect}
                  uiStyle={uiStyle}
                  evaluation={evaluation}
                />
              )}
              {previewTab === 'show' && (
                <MultipleChoiceDisplay
                  showAnswer
                  smallSize={smallSize}
                  options={previewDisplayOptions}
                  question={previewStimulus}
                  userSelections={userAnswer}
                  handleMultiSelect={this.handleMultiSelect}
                  uiStyle={uiStyle}
                  evaluation={evaluation}
                />
              )}
              {previewTab === 'clear' && (
                <MultipleChoiceDisplay
                  preview
                  smallSize={smallSize}
                  options={previewDisplayOptions}
                  question={previewStimulus}
                  data={item}
                  userSelections={userAnswer}
                  onChange={this.handleAddAnswer}
                  uiStyle={uiStyle}
                />
              )}
            </Wrapper>
          )}
        </PaddingDiv>
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
  testItem: PropTypes.bool,
  evaluation: PropTypes.any,
};

MultipleChoice.defaultProps = {
  previewTab: 'clear',
  item: {
    options: [],
  },
  smallSize: false,
  history: {},
  userAnswer: [],
  testItem: false,
  evaluation: '',
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
