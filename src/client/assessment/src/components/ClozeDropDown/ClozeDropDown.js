import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { PaddingDiv, Checkbox, Paper } from '@edulastic/common';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';
import { withNamespaces } from '@edulastic/localization';

import { ClozeDropDownAuthoring, ClozeDropDownDisplay, CorrectAnswers } from './index';
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import CorrectAnswerOptions from './components/CorrectAnswerOptions';
import Options from './Options';
import { checkAnswerAction } from '../../../../author/src/actions/testItem';

const EmptyWrapper = styled.div``;

class ClozeDropDown extends Component {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    feedbackAttempts: this.props.item.feedback_attempts || 0
  };

  getRenderData = () => {
    const { item, history } = this.props;
    const locationState = history.location.state;
    const isDetailPage = locationState !== undefined ? locationState.itemDetail : false;
    const previewDisplayOptions = item.hasGroupResponses ? item.groupResponses : item.options;
    let previewStimulus;
    let itemForEdit;
    if (item.smallSize || isDetailPage) {
      previewStimulus = item.stimulus;
      itemForEdit = item;
    } else {
      previewStimulus = item.stimulus;
      itemForEdit = {
        ...item,
        stimulus: item.stimulus,
        list: item.options,
        validation: item.validation
      };
    }
    return {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      uiStyle: item.ui_style,
      instantFeedback: item.instant_feedback,
      instructorStimulus: item.instructor_stimulus
    };
  };

  handleAddAltResponses = () => {
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);

    const response = {
      score: 1,
      value: []
    };

    if (newItem.validation.alt_responses && newItem.validation.alt_responses.length) {
      newItem.validation.alt_responses.push(response);
    } else {
      newItem.validation.alt_responses = [response];
    }

    setQuestionData(newItem);
  };

  handleOptionsChange = (name, value) => {
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);
    newItem[name] = value;
    setQuestionData(newItem);
  };

  handleAddAnswer = (userAnswer) => {
    const { saveAnswer } = this.props;
    const newAnswer = cloneDeep(userAnswer);
    saveAnswer(newAnswer);
  };

  _checkAnswer = () => {
    const { checkAnswer, userAnswer } = this.props;

    if (!userAnswer || (Array.isArray(userAnswer) && !userAnswer.length)) {
      return;
    }

    this.setState(
      ({ feedbackAttempts }) => ({
        feedbackAttempts: feedbackAttempts - 1
      }),
      () => {
        checkAnswer();
      }
    );
  };

  render() {
    const { view, previewTab, smallSize, item, userAnswer, t, testItem, evaluation } = this.props;
    const { feedbackAttempts } = this.state;
    const {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      uiStyle,
      instantFeedback,
      instructorStimulus
    } = this.getRenderData();
    const { shuffleOptions } = item;

    const Wrapper = testItem ? EmptyWrapper : Paper;
    return (
      <div>
        {view === 'edit' && (
          <React.Fragment>
            <PaddingDiv
              style={{ borderRadius: 5, background: 'white' }}
              top={30}
              bottom={30}
              left={120}
              right={120}
            >
              <div style={{ width: 640 }} className="authoring">
                <ClozeDropDownAuthoring item={itemForEdit} />
                <CorrectAnswers
                  key={shuffleOptions}
                  validation={item.validation}
                  configureOptions={{
                    shuffleOptions
                  }}
                  options={previewDisplayOptions}
                  question={previewStimulus}
                  uiStyle={uiStyle}
                  templateMarkUp={itemForEdit.templateMarkUp}
                  onAddAltResponses={this.handleAddAltResponses}
                />
                <CorrectAnswerOptions>
                  <Checkbox
                    className="additional-options"
                    key={`shuffleOptions_${shuffleOptions}`}
                    onChange={() => this.handleOptionsChange('shuffleOptions', !shuffleOptions)}
                    label={t('component.clozeDropDown.shuffleoptions')}
                    checked={shuffleOptions}
                  />
                </CorrectAnswerOptions>
              </div>
            </PaddingDiv>
            <div style={{ marginTop: 35 }}>
              <Options
                onChange={this.handleOptionsChange}
                uiStyle={uiStyle}
                outerStyle={{
                  padding: '30px 120px'
                }}
              />
            </div>
          </React.Fragment>
        )}
        {view === 'preview' && (
          <Wrapper>
            {previewTab === 'check' && (
              <ClozeDropDownDisplay
                checkAnswer
                configureOptions={{
                  shuffleOptions
                }}
                smallSize={smallSize}
                options={previewDisplayOptions}
                question={previewStimulus}
                uiStyle={uiStyle}
                templateMarkUp={item.templateMarkUp}
                userSelections={userAnswer}
                onChange={this.handleAddAnswer}
                evaluation={evaluation}
                instantFeedback={instantFeedback}
                feedbackAttempts={feedbackAttempts}
                onCheckAnswer={this._checkAnswer}
                instructorStimulus={instructorStimulus}
              />
            )}
            {previewTab === 'show' && (
              <ClozeDropDownDisplay
                showAnswer
                configureOptions={{
                  shuffleOptions
                }}
                smallSize={smallSize}
                options={previewDisplayOptions}
                question={previewStimulus}
                uiStyle={uiStyle}
                templateMarkUp={item.templateMarkUp}
                userSelections={userAnswer}
                validation={item.validation}
                evaluation={evaluation}
                instantFeedback={instantFeedback}
                feedbackAttempts={feedbackAttempts}
                onCheckAnswer={this._checkAnswer}
                instructorStimulus={instructorStimulus}
              />
            )}
            {previewTab === 'clear' && (
              <ClozeDropDownDisplay
                preview
                configureOptions={{
                  shuffleOptions
                }}
                key={previewDisplayOptions && previewStimulus && uiStyle}
                smallSize={smallSize}
                options={previewDisplayOptions}
                question={previewStimulus}
                uiStyle={uiStyle}
                templateMarkUp={item.templateMarkUp}
                userSelections={userAnswer}
                onChange={this.handleAddAnswer}
                instantFeedback={instantFeedback}
                feedbackAttempts={feedbackAttempts}
                onCheckAnswer={this._checkAnswer}
                instructorStimulus={instructorStimulus}
              />
            )}
          </Wrapper>
        )}
      </div>
    );
  }
}

ClozeDropDown.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  item: PropTypes.object,
  smallSize: PropTypes.bool,
  history: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  t: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any.isRequired
};

ClozeDropDown.defaultProps = {
  previewTab: 'clear',
  item: {
    options: []
  },
  smallSize: false,
  history: {},
  userAnswer: [],
  testItem: false
};

const enhance = compose(
  withRouter,
  withNamespaces('assessment'),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction
    }
  )
);

export default enhance(ClozeDropDown);
