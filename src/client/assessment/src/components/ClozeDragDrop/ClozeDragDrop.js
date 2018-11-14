import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { PaddingDiv, Checkbox, Paper } from '@edulastic/common';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';
import { withNamespaces } from '@edulastic/localization';

import {
  ClozeDragDropAuthoring,
  ClozeDragDropDisplay,
  CorrectAnswers,
} from './index';
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import CorrectAnswerOptions from './components/CorrectAnswerOptions';
import Options from './Options';

const EmptyWrapper = styled.div``;

class ClozeDragDrop extends Component {
  state = {
    duplicatedResponses: false,
    shuffleOptions: false,
    showDraghandle: false,
  }

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
        validation: item.validation,
      };
    }
    return {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      uiStyle: item.ui_style,
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

  handleOptionsChange = (name, value) => {
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);
    newItem[name] = value;
    setQuestionData(newItem);
    switch (name) {
      case 'duplicated_responses': {
        this.setState({ duplicatedResponses: value });
        break;
      }
      case 'shuffle_options': {
        this.setState({ shuffleOptions: value });
        break;
      }
      case 'show_draghandle': {
        this.setState({ showDraghandle: value });
        break;
      }
      default:
    }
  };

  handleAddAnswer = (userAnswer) => {
    const { saveAnswer } = this.props;
    const newAnswer = cloneDeep(userAnswer);
    saveAnswer(newAnswer);
  };

  render() {
    const { view, previewTab, smallSize, item, userAnswer, t, testItem, evaluation } = this.props;
    const { previewStimulus, previewDisplayOptions, itemForEdit, uiStyle } = this.getRenderData();
    const { duplicatedResponses, showDraghandle, shuffleOptions } = this.state;

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
                <ClozeDragDropAuthoring item={itemForEdit} />
                <CorrectAnswers
                  key={duplicatedResponses || showDraghandle || shuffleOptions}
                  validation={item.validation}
                  hasGroupResponses={item.hasGroupResponses}
                  configureOptions={{
                    duplicatedResponses,
                    showDraghandle,
                    shuffleOptions,
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
                    onChange={() =>
                      this.handleOptionsChange(
                        'duplicated_responses',
                        !duplicatedResponses,
                      )
                  }
                    label={t('component.clozeDragDrop.duplicatedresponses')}
                    checked={duplicatedResponses}
                  />
                  <Checkbox
                    className="additional-options"
                    onChange={() =>
                      this.handleOptionsChange(
                        'show_draghandle',
                        !showDraghandle,
                      )
                  }
                    label={t('component.clozeDragDrop.showdraghandle')}
                    checked={showDraghandle}
                  />
                  <Checkbox
                    className="additional-options"
                    onChange={() =>
                      this.handleOptionsChange(
                        'shuffle_options',
                        !shuffleOptions,
                      )
                  }
                    label={t('component.clozeDragDrop.shuffleoptions')}
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
              <ClozeDragDropDisplay
                checkAnswer
                hasGroupResponses={item.hasGroupResponses}
                configureOptions={{
                  duplicatedResponses,
                  showDraghandle,
                  shuffleOptions,
                }}
                smallSize={smallSize}
                options={previewDisplayOptions}
                question={previewStimulus}
                uiStyle={uiStyle}
                templateMarkUp={item.templateMarkUp}
                userSelections={userAnswer}
                onChange={this.handleAddAnswer}
                evaluation={evaluation}
              />
            )}
            {previewTab === 'show' && (
              <ClozeDragDropDisplay
                showAnswer
                hasGroupResponses={item.hasGroupResponses}
                configureOptions={{
                  duplicatedResponses,
                  showDraghandle,
                  shuffleOptions,
                }}
                smallSize={smallSize}
                options={previewDisplayOptions}
                question={previewStimulus}
                uiStyle={uiStyle}
                templateMarkUp={item.templateMarkUp}
                userSelections={userAnswer}
                validation={item.validation}
                evaluation={evaluation}
              />
            )}
            {previewTab === 'clear' && (
              <ClozeDragDropDisplay
                preview
                hasGroupResponses={item.hasGroupResponses}
                configureOptions={{
                  duplicatedResponses,
                  showDraghandle,
                  shuffleOptions,
                }}
                key={previewDisplayOptions && previewStimulus && uiStyle}
                smallSize={smallSize}
                options={previewDisplayOptions}
                question={previewStimulus}
                uiStyle={uiStyle}
                templateMarkUp={item.templateMarkUp}
                userSelections={[]}
                onChange={this.handleAddAnswer}
              />
            )}
          </Wrapper>
        )}
      </div>
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
  t: PropTypes.func.isRequired,
  testItem: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  evaluation: PropTypes.any.isRequired,
};

ClozeDragDrop.defaultProps = {
  previewTab: 'clear',
  item: {
    options: [],
  },
  smallSize: false,
  history: {},
  userAnswer: [],
  testItem: false,
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

export default enhance(ClozeDragDrop);
