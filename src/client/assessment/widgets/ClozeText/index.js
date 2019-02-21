import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import styled, { withTheme } from 'styled-components';

import { PaddingDiv, Paper } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';

import { setQuestionDataAction } from '../../../author/src/actions/question';

import Options from './components/Options';
import CorrectAnswers from './CorrectAnswers';
import Authoring from './Authoring';
import Display from './Display';

const EmptyWrapper = styled.div``;

class ClozeText extends Component {
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
      uiStyle: item.ui_style
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

  render() {
    const {
      view,
      previewTab,
      smallSize,
      item,
      userAnswer,
      testItem,
      evaluation,
      theme
    } = this.props;
    const { previewStimulus, previewDisplayOptions, itemForEdit, uiStyle } = this.getRenderData();
    const { duplicatedResponses, showDraghandle, shuffleOptions } = item;
    const Wrapper = testItem ? EmptyWrapper : Paper;
    return (
      <div>
        {view === 'edit' && (
          <React.Fragment>
            <PaddingDiv
              style={{
                borderRadius: 5,
                background: theme.widgets.clozeText.editViewBgColor
              }}
              top={30}
              bottom={30}
              left={120}
              right={120}
            >
              <div style={{ width: 640 }} className="authoring">
                <Authoring item={itemForEdit} />
                <CorrectAnswers
                  key={duplicatedResponses || showDraghandle || shuffleOptions}
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
              <Display
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
                instructorStimulus={item.instructor_stimulus}
              />
            )}
            {previewTab === 'show' && (
              <Display
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
                instructorStimulus={item.instructor_stimulus}
              />
            )}
            {previewTab === 'clear' && (
              <Display
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
                instructorStimulus={item.instructor_stimulus}
              />
            )}
          </Wrapper>
        )}
      </div>
    );
  }
}

ClozeText.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  item: PropTypes.object,
  smallSize: PropTypes.bool,
  history: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any,
  theme: PropTypes.object.isRequired
};

ClozeText.defaultProps = {
  previewTab: 'clear',
  item: {
    options: []
  },
  smallSize: false,
  history: {},
  userAnswer: [],
  testItem: false,
  evaluation: {}
};

const enhance = compose(
  withRouter,
  withNamespaces('assessment'),
  withTheme,
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    },
  ),
);

const ClozeTextContainer = enhance(ClozeText);

export { ClozeTextContainer as ClozeText };
