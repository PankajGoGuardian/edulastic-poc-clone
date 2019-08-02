import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { cloneDeep } from "lodash";
import styled, { withTheme } from "styled-components";
import produce from "immer";

import { Checkbox, Paper, WithResources, AnswerContext } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { EDIT } from "../../constants/constantsForQuestions";

import { CorrectAnswerOptions } from "../../styled/CorrectAnswerOptions";

import Authoring from "./Authoring";
import CorrectAnswers from "./CorrectAnswers";
import Display from "./Display";
import Options from "./components/Options";

import { replaceVariables, updateVariables } from "../../utils/variables";
import { ContentArea } from "../../styled/ContentArea";
import ChoicesForResponses from "./ChoicesForResponses";
import Question from "../../components/Question";

const EmptyWrapper = styled.div``;

class ClozeDropDown extends Component {
  static contextType = AnswerContext;

  getRenderData = () => {
    const { item: templateItem, history, view } = this.props;
    const itemForPreview = replaceVariables(templateItem);
    const item = view === EDIT ? templateItem : replaceVariables(templateItem);

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
      uiStyle: item.ui_style,
      instantFeedback: item.instant_feedback,
      instructorStimulus: item.instructor_stimulus
    };
  };

  handleAddAltResponses = () => {
    const { setQuestionData, item } = this.props;
    setQuestionData(
      produce(item, draft => {
        const validAnswers = cloneDeep(draft.validation.valid_response.value);
        validAnswers.map(answer => {
          answer.value = "";
          return answer;
        });
        draft.validation.alt_responses.push({
          score: 1,
          value: validAnswers
        });
      })
    );
  };

  handleRemoveAltResponses = index => {
    const { setQuestionData, item } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.validation && draft.validation.alt_responses && draft.validation.alt_responses.length) {
          draft.validation.alt_responses.splice(index, 1);
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
      fillSections,
      cleanSections,
      isSidebarCollapsed,
      advancedAreOpen,
      ...restProps
    } = this.props;

    const {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      itemForPreview,
      uiStyle,
      instructorStimulus
    } = this.getRenderData();

    const { shuffleOptions, response_ids } = item;

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
                  position="unset"
                  section="main"
                  label={t("component.correctanswers.setcorrectanswers")}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                >
                  <CorrectAnswers
                    key="shuffleOptions"
                    validation={item.validation}
                    configureOptions={{
                      shuffleOptions
                    }}
                    options={previewDisplayOptions}
                    item={itemForPreview}
                    stimulus={previewStimulus}
                    uiStyle={uiStyle}
                    onAddAltResponses={this.handleAddAltResponses}
                    fillSections={fillSections}
                    cleanSections={cleanSections}
                    onRemoveAltResponses={this.handleRemoveAltResponses}
                  />
                  <CorrectAnswerOptions>
                    <Checkbox
                      className="additional-options"
                      key="shuffleOptions"
                      onChange={() => this.handleOptionsChange("shuffleOptions", !shuffleOptions)}
                      label={t("component.cloze.dropDown.shuffleoptions")}
                      checked={shuffleOptions}
                    />
                  </CorrectAnswerOptions>
                </Question>
                <ChoicesForResponses
                  responses={response_ids || []}
                  item={item}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                />
              </div>
              <div style={{ marginTop: 35 }}>
                <Options
                  onChange={this.handleOptionsChange}
                  uiStyle={uiStyle}
                  outerStyle={{
                    padding: "30px 120px"
                  }}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                  advancedAreOpen={advancedAreOpen}
                  responseIDs={response_ids}
                />
              </div>
            </React.Fragment>
          </ContentArea>
        )}
        {view === "preview" && (
          <Wrapper>
            <Display
              showAnswer={previewTab === "show" && !answerContextConfig.expressGrader}
              preview={
                previewTab === "clear" || (answerContextConfig.isAnswerModifiable && answerContextConfig.expressGrader)
              }
              checkAnswer={
                previewTab === "check" || (answerContextConfig.expressGrader && !answerContextConfig.isAnswerModifiable)
              }
              configureOptions={{
                shuffleOptions
              }}
              item={itemForPreview}
              smallSize={smallSize}
              options={previewDisplayOptions}
              stimulus={previewStimulus}
              uiStyle={uiStyle}
              userAnswer={userAnswer}
              userSelections={userAnswer}
              onChange={this.handleAddAnswer}
              evaluation={evaluation}
              instructorStimulus={instructorStimulus}
              {...restProps}
            />
          </Wrapper>
        )}
      </WithResources>
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
  testItem: PropTypes.bool,
  evaluation: PropTypes.any.isRequired,
  theme: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  isSidebarCollapsed: PropTypes.bool.isRequired
};

ClozeDropDown.defaultProps = {
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
    { setQuestionData: setQuestionDataAction }
  )
);

const ClozeDropDownContainer = enhance(ClozeDropDown);

export { ClozeDropDownContainer as ClozeDropDown };
