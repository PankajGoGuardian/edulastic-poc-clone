import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { cloneDeep } from "lodash";
import styled, { withTheme } from "styled-components";
import produce from "immer";
import { Checkbox } from "antd";

import { Paper, WithResources, AnswerContext } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { ContentArea } from "../../styled/ContentArea";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { changePreviewAction } from "../../../author/src/actions/view";
import { EDIT } from "../../constants/constantsForQuestions";

import { CorrectAnswerOptions } from "../../styled/CorrectAnswerOptions";

import Authoring from "./Authoring";
import CorrectAnswers from "./CorrectAnswers";
import Display from "./Display";
import Options from "./components/Options";

import { replaceVariables, updateVariables } from "../../utils/variables";
import { CheckContainer } from "./styled/CheckContainer";
import Question from "../../components/Question";

const EmptyWrapper = styled.div``;

class ClozeDragDrop extends Component {
  static contextType = AnswerContext;

  getRenderData = () => {
    const { item: templateItem, history, view } = this.props;
    const itemForPreview = replaceVariables(templateItem);
    const item = view === EDIT ? templateItem : itemForPreview;

    const locationState = history.location.state;
    const isDetailPage = locationState !== undefined ? locationState.itemDetail : false;
    const previewDisplayOptions = item.hasGroupResponses ? item.groupResponses : item.options;
    let previewStimulus;
    let itemForEdit;
    if (item.smallSize || isDetailPage) {
      previewStimulus = item.stimulus;
      itemForEdit = templateItem;
    } else {
      previewStimulus = item.stimulus;
      itemForEdit = {
        ...templateItem,
        stimulus: templateItem.stimulus,
        list: templateItem.options,
        validation: templateItem.validation
      };
    }
    return {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      itemForPreview,
      uiStyle: item.uiStyle
    };
  };

  handleAddAltResponses = () => {
    const { setQuestionData, item } = this.props;
    setQuestionData(
      produce(item, draft => {
        const response = {
          score: 1,
          value: []
        };

        if (draft.validation.altResponses && draft.validation.altResponses.length) {
          draft.validation.altResponses.push(response);
        } else {
          draft.validation.altResponses = [response];
        }
      })
    );
  };

  handleRemoveAltResponses = index => {
    const { setQuestionData, item } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.validation && draft.validation.altResponses && draft.validation.altResponses.length) {
          draft.validation.altResponses.splice(index, 1);
          setQuestionData(draft);
        }
      })
    );
  };

  handleOptionsChange = (name, value) => {
    const { setQuestionData, item } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft[name] = value;
        updateVariables(draft);
      })
    );
  };

  handleAddAnswer = userAnswer => {
    const { saveAnswer } = this.props;
    const newAnswer = cloneDeep(userAnswer);
    saveAnswer(newAnswer);
  };

  render() {
    const answerContextConfig = this.context;

    const {
      view,
      previewTab,
      smallSize,
      item,
      userAnswer,
      t,
      testItem,
      evaluation,
      // eslint-disable-next-line no-unused-vars
      theme,
      fillSections,
      cleanSections,
      isSidebarCollapsed,
      advancedAreOpen,
      ...restProps
    } = this.props;

    const { previewStimulus, previewDisplayOptions, itemForEdit, itemForPreview, uiStyle } = this.getRenderData();
    const { duplicatedResponses, showDraghandle, shuffleOptions, responseIds: responseIDs } = item;
    const Wrapper = testItem ? EmptyWrapper : Paper;

    return (
      <WithResources
        resources={["https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"]}
        fallBack={<span />}
        onLoaded={() => null}
      >
        {view === "edit" && (
          <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
            <React.Fragment>
              <div className="authoring">
                <Authoring item={itemForEdit} fillSections={fillSections} cleanSections={cleanSections} />
                <Question
                  section="main"
                  label={t("component.correctanswers.setcorrectanswers")}
                  position="unset"
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                >
                  <CorrectAnswers
                    // key={duplicatedResponses || showDraghandle || shuffleOptions}
                    validation={item.validation}
                    hasGroupResponses={item.hasGroupResponses}
                    configureOptions={{
                      duplicatedResponses,
                      showDraghandle,
                      shuffleOptions
                    }}
                    options={previewDisplayOptions}
                    stimulus={previewStimulus}
                    uiStyle={uiStyle}
                    onAddAltResponses={this.handleAddAltResponses}
                    onRemoveAltResponses={this.handleRemoveAltResponses}
                    fillSections={fillSections}
                    cleanSections={cleanSections}
                    responseIDs={item.responseIds}
                  />
                  <CorrectAnswerOptions>
                    <CheckContainer>
                      <Checkbox
                        className="additional-options"
                        key={`duplicatedResponses_${duplicatedResponses}`}
                        onChange={() => this.handleOptionsChange("duplicatedResponses", !duplicatedResponses)}
                        checked={duplicatedResponses}
                      >
                        {t("component.cloze.dragDrop.duplicatedresponses")}
                      </Checkbox>
                    </CheckContainer>
                    <CheckContainer>
                      <Checkbox
                        className="additional-options"
                        key={`showDraghandle_${showDraghandle}`}
                        onChange={() => this.handleOptionsChange("showDraghandle", !showDraghandle)}
                        checked={showDraghandle}
                      >
                        {t("component.cloze.dragDrop.showdraghandle")}
                      </Checkbox>
                    </CheckContainer>
                    <CheckContainer>
                      <Checkbox
                        className="additional-options"
                        key={`shuffleOptions_${shuffleOptions}`}
                        onChange={() => this.handleOptionsChange("shuffleOptions", !shuffleOptions)}
                        checked={shuffleOptions}
                      >
                        {t("component.cloze.dragDrop.shuffleoptions")}
                      </Checkbox>
                    </CheckContainer>
                  </CorrectAnswerOptions>
                </Question>
              </div>
              <div style={{ marginTop: 35 }}>
                <Options
                  onChange={this.handleOptionsChange}
                  uiStyle={uiStyle}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                  advancedAreOpen={advancedAreOpen}
                  outerStyle={{
                    padding: "30px 120px"
                  }}
                  responseIDs={responseIDs}
                />
              </div>
            </React.Fragment>
          </ContentArea>
        )}
        {view === "preview" && (
          <Wrapper>
            {(previewTab === "check" ||
              (answerContextConfig.expressGrader && !answerContextConfig.isAnswerModifiable)) && (
              <Display
                view={view}
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
                stimulus={previewStimulus}
                uiStyle={uiStyle}
                userSelections={userAnswer}
                onChange={this.handleAddAnswer}
                evaluation={evaluation}
                responseIDs={item.responseIds}
                {...restProps}
              />
            )}
            {previewTab === "show" && !answerContextConfig.expressGrader && (
              <Display
                view={view}
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
                stimulus={previewStimulus}
                uiStyle={uiStyle}
                userSelections={userAnswer}
                validation={item.validation}
                evaluation={evaluation}
                responseIDs={item.responseIds}
                {...restProps}
              />
            )}
            {(previewTab === "clear" ||
              (answerContextConfig.isAnswerModifiable && answerContextConfig.expressGrader)) && (
              <Display
                view={view}
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
                stimulus={previewStimulus}
                uiStyle={uiStyle}
                userSelections={userAnswer}
                onChange={this.handleAddAnswer}
                responseIDs={item.responseIds}
                {...restProps}
              />
            )}
          </Wrapper>
        )}
      </WithResources>
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
  theme: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  isSidebarCollapsed: PropTypes.bool.isRequired
};

ClozeDragDrop.defaultProps = {
  previewTab: "clear",
  item: {
    options: []
  },
  smallSize: false,
  history: {},
  userAnswer: [],
  testItem: false,
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  withTheme,
  connect(
    ({ authorUi }) => ({ isSidebarCollapsed: authorUi.isSidebarCollapsed }),
    { setQuestionData: setQuestionDataAction, changePreview: changePreviewAction }
  )
);

const ClozeDragDropContainer = enhance(ClozeDragDrop);

export { ClozeDragDropContainer as ClozeDragDrop };
