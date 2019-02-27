import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { cloneDeep } from "lodash";
import styled, { withTheme } from "styled-components";

import { Checkbox, Paper } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import { CorrectAnswerOptions } from "../../styled/CorrectAnswerOptions";
import { ResponseQuestion } from "./styled/ResponseQuestion";

import Authoring from "./Authoring";
import CorrectAnswers from "./CorrectAnswers";
import Display from "./Display";
import Options from "./components/Options";

const EmptyWrapper = styled.div``;

class ClozeDragDrop extends Component {
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

  handleRemoveAltResponses = (index) => {
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);

    if (
      newItem.validation &&
      newItem.validation.alt_responses &&
      newItem.validation.alt_responses.length
    ) {
      newItem.validation.alt_responses.splice(index, 1);
      setQuestionData(newItem);
    }
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
      t,
      testItem,
      evaluation,
      theme
    } = this.props;
    const {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      uiStyle
    } = this.getRenderData();
    const {
      duplicatedResponses,
      showDraghandle,
      shuffleOptions
    } = item;

    const Wrapper = testItem ? EmptyWrapper : Paper;

    return (
      <div>
        {view === 'edit' && (
          <React.Fragment>
            <ResponseQuestion
              background={theme.widgets.clozeDragDrop.editViewBgColor}
            >
              <div  className="authoring">
                <Authoring item={itemForEdit} />
                <CorrectAnswers
                  key={duplicatedResponses || showDraghandle || shuffleOptions}
                  validation={item.validation}
                  hasGroupResponses={item.hasGroupResponses}
                  configureOptions={{
                    duplicatedResponses,
                    showDraghandle,
                    shuffleOptions
                  }}
                  options={previewDisplayOptions}
                  question={previewStimulus}
                  uiStyle={uiStyle}
                  templateMarkUp={itemForEdit.templateMarkUp}
                  onAddAltResponses={this.handleAddAltResponses}
                  onRemoveAltResponses={this.handleRemoveAltResponses}
                />
                <CorrectAnswerOptions>
                  <Checkbox
                    className="additional-options"
                    key={`duplicatedResponses_${duplicatedResponses}`}
                    onChange={() =>
                      this.handleOptionsChange('duplicatedResponses', !duplicatedResponses)
                    }
                    label={t('component.cloze.dragDrop.duplicatedresponses')}
                    checked={duplicatedResponses}
                  />
                  <Checkbox
                    className="additional-options"
                    key={`showDraghandle_${showDraghandle}`}
                    onChange={() => this.handleOptionsChange('showDraghandle', !showDraghandle)}
                    label={t('component.cloze.dragDrop.showdraghandle')}
                    checked={showDraghandle}
                  />
                  <Checkbox
                    className="additional-options"
                    key={`shuffleOptions_${shuffleOptions}`}
                    onChange={() => this.handleOptionsChange('shuffleOptions', !shuffleOptions)}
                    label={t('component.cloze.dragDrop.shuffleoptions')}
                    checked={shuffleOptions}
                  />
                </CorrectAnswerOptions>
              </div>
            </ResponseQuestion>
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
                item={item}
                checkAnswer
                hasGroupResponses={item.hasGroupResponses}
                configureOptions={{
                  duplicatedResponses,
                  showDraghandle,
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
              />
            )}
            {previewTab === 'show' && (
              <Display
                showAnswer
                item={item}
                hasGroupResponses={item.hasGroupResponses}
                configureOptions={{
                  duplicatedResponses,
                  showDraghandle,
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
              />
            )}
            {previewTab === 'clear' && (
              <Display
                item={item}
                preview
                hasGroupResponses={item.hasGroupResponses}
                configureOptions={{
                  duplicatedResponses,
                  showDraghandle,
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
  evaluation: PropTypes.any.isRequired,
  theme: PropTypes.object.isRequired
};

ClozeDragDrop.defaultProps = {
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
  withTheme,
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

const ClozeDragDropContainer = enhance(ClozeDragDrop);

export { ClozeDragDropContainer as ClozeDragDrop };
