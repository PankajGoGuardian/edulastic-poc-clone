import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { cloneDeep, isEqual, get, findIndex } from "lodash";
import styled, { withTheme } from "styled-components";
import produce from "immer";
import { Paper, Checkbox, WithResources, AnswerContext } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { EDIT } from "../../constants/constantsForQuestions";
import { updateVariables, replaceVariables } from "../../utils/variables";

import Options from "./components/Options";
import CorrectAnswers from "./CorrectAnswers";
import Authoring from "./Authoring";
import Display from "./Display";
import { ContentArea } from "../../styled/ContentArea";
import Question from "../../components/Question";

const EmptyWrapper = styled.div``;

class ClozeText extends Component {
  static contextType = AnswerContext;

  componentDidUpdate(prevProps) {
    const { item, setQuestionData, previewTab, view } = this.props;
    const newItem = cloneDeep(item);
    let {
      // eslint-disable-next-line prefer-const
      uiStyle: { responsecontainerindividuals: responses = [], globalSettings }
    } = newItem;
    if (!isEqual(prevProps.item.validation, newItem.validation)) {
      let maxLength = 0;

      newItem.validation.validResponse.value.forEach(resp => {
        maxLength = Math.max(maxLength, resp.length);
      });

      newItem.validation.altResponses.forEach(arr => {
        arr.value.forEach(resp => {
          maxLength = Math.max(maxLength, resp.length);
        });
      });
      const finalWidth = 30 + maxLength * 7;
      newItem.uiStyle.widthpx = finalWidth < 140 ? 140 : finalWidth > 400 ? 400 : finalWidth;

      setQuestionData(newItem);
    }
    if (globalSettings && responses.length) {
      const previewTabChange = prevProps.previewTab !== previewTab && previewTab === "clear";
      const tabChange = prevProps.view !== view;
      if (tabChange || previewTabChange) {
        responses = responses.map(response => ({
          ...response,
          previewWidth: null
        }));
        newItem.uiStyle.responsecontainerindividuals = responses;
        setQuestionData(newItem);
      }
    }
  }

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
        const validAnswers = cloneDeep(draft.validation.validResponse.value);
        validAnswers.map(answer => {
          answer.value = "";
          return answer;
        });
        draft.validation.altResponses.push({
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
        if (draft.validation.altResponses && draft.validation.altResponses.length) {
          draft.validation.altResponses = draft.validation.altResponses.filter((response, i) => i !== index);
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

  handleValidationOptionsChange = (name, value) => {
    const { setQuestionData, item } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation[name] = value;
        updateVariables(draft);
      })
    );
  };

  handleAddAnswer = userAnswer => {
    const { saveAnswer, setQuestionData, item } = this.props;
    const { uiStyle } = item;
    let newAnswer = cloneDeep(userAnswer);
    saveAnswer(newAnswer);
    if (uiStyle.globalSettings) {
      setQuestionData(
        produce(item, draft => {
          newAnswer = newAnswer.filter(ans => !!ans);
          newAnswer.forEach(ans => {
            const { id, value, index } = ans;
            const splitWidth = Math.max(value.split("").length * 9, 100);
            const width = Math.min(splitWidth, 400);
            const ind = findIndex(draft.uiStyle.responsecontainerindividuals, container => container.id === id);
            if (ind === -1) {
              draft.uiStyle.responsecontainerindividuals.push({
                id,
                index,
                previewWidth: width
              });
            } else {
              draft.uiStyle.responsecontainerindividuals[ind] = {
                ...draft.uiStyle.responsecontainerindividuals[ind],
                previewWidth: width
              };
            }
          });
        })
      );
    }
  };

  render() {
    const answerContextConfig = this.context;
    const {
      view,
      previewTab,
      smallSize,
      item,
      userAnswer,
      testItem,
      evaluation,
      isSidebarCollapsed,
      advancedAreOpen,
      t,
      cleanSections,
      fillSections,
      ...restProps
    } = this.props;

    const { previewStimulus, previewDisplayOptions, itemForEdit, itemForPreview, uiStyle } = this.getRenderData();

    const { duplicatedResponses, showDraghandle, shuffleOptions } = item;

    const ignoreCase = item && item.validation ? item.validation.ignoreCase : false;

    const allowSingleLetterMistake = item && item.validation ? item.validation.allowSingleLetterMistake : false;
    const mixAndMatch = get(item, ["validation", "mixAndMatch"], false);

    const Wrapper = testItem ? EmptyWrapper : Paper;

    return (
      <WithResources
        resources={["https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"]}
        fallBack={<span />}
        onLoaded={() => null}
      >
        {view === "edit" && (
          <ContentArea data-cy="question-area" isSidebarCollapsed={isSidebarCollapsed}>
            <React.Fragment>
              <div className="authoring">
                <Authoring item={itemForEdit} cleanSections={cleanSections} fillSections={fillSections} />
                <Question
                  section="main"
                  label={t("component.correctanswers.setcorrectanswers")}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                >
                  <CorrectAnswers
                    key={duplicatedResponses || showDraghandle || shuffleOptions}
                    validation={item.validation}
                    configureOptions={{
                      shuffleOptions
                    }}
                    options={previewDisplayOptions}
                    stimulus={previewStimulus}
                    uiStyle={uiStyle}
                    responseIds={item.responseIds}
                    onAddAltResponses={this.handleAddAltResponses}
                    onRemoveAltResponses={this.handleRemoveAltResponses}
                    cleanSections={cleanSections}
                    fillSections={fillSections}
                    view={view}
                    previewTab={previewTab}
                  />
                  <div style={{ marginTop: 40 }}>
                    <Checkbox
                      className="additional-options"
                      onChange={() => this.handleValidationOptionsChange("ignoreCase", !ignoreCase)}
                      label={t("component.cloze.dropDown.ignorecase")}
                      checked={!!ignoreCase}
                    />

                    <Checkbox
                      className="additional-options"
                      onChange={() =>
                        this.handleValidationOptionsChange("allowSingleLetterMistake", !allowSingleLetterMistake)
                      }
                      label={t("component.cloze.dropDown.allowsinglelettermistake")}
                      checked={!!allowSingleLetterMistake}
                    />

                    <Checkbox
                      className="additional-options"
                      onChange={() => this.handleValidationOptionsChange("mixAndMatch", !mixAndMatch)}
                      label="Mix-n-Match alternative answers"
                      checked={!!mixAndMatch}
                    />
                  </div>
                </Question>
                <Options
                  onChange={this.handleOptionsChange}
                  uiStyle={uiStyle}
                  characterMap={item.character_map}
                  multipleLine={item.multiple_line}
                  advancedAreOpen={advancedAreOpen}
                  cleanSections={cleanSections}
                  fillSections={fillSections}
                  responseIds={item.responseIds}
                  outerStyle={{
                    padding: "30px 0px"
                  }}
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
                checkAnswer
                configureOptions={{
                  shuffleOptions
                }}
                smallSize={smallSize}
                options={previewDisplayOptions}
                stimulus={previewStimulus}
                uiStyle={uiStyle}
                userSelections={userAnswer}
                onChange={this.handleAddAnswer}
                evaluation={evaluation}
                instructorStimulus={itemForPreview.instructorStimulus}
                item={itemForPreview}
                responseIds={item.responseIds}
                showIndex
                view={view}
                previewTab={previewTab}
                {...restProps}
              />
            )}
            {previewTab === "show" && !answerContextConfig.expressGrader && (
              <Display
                showAnswer
                configureOptions={{
                  shuffleOptions
                }}
                smallSize={smallSize}
                options={previewDisplayOptions}
                stimulus={previewStimulus}
                uiStyle={uiStyle}
                userSelections={userAnswer}
                validation={itemForPreview.validation}
                onChange={this.handleAddAnswer}
                evaluation={evaluation}
                instructorStimulus={itemForPreview.instructorStimulus}
                item={itemForPreview}
                responseIds={item.responseIds}
                showIndex
                {...restProps}
                view={view}
                previewTab={previewTab}
              />
            )}
            {(previewTab === "clear" ||
              (answerContextConfig.isAnswerModifiable && answerContextConfig.expressGrader)) && (
              <Display
                preview={false}
                configureOptions={{
                  shuffleOptions
                }}
                key={previewDisplayOptions && previewStimulus && uiStyle}
                smallSize={smallSize}
                options={previewDisplayOptions}
                stimulus={previewStimulus}
                uiStyle={uiStyle}
                userSelections={userAnswer}
                onChange={this.handleAddAnswer}
                instructorStimulus={itemForPreview.instructorStimulus}
                item={itemForPreview}
                responseIds={item.responseIds}
                showIndex={false}
                view={view}
                previewTab={previewTab}
                {...restProps}
              />
            )}
          </Wrapper>
        )}
      </WithResources>
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
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  isSidebarCollapsed: PropTypes.bool.isRequired
};

ClozeText.defaultProps = {
  previewTab: "clear",
  item: {
    options: []
  },
  smallSize: false,
  history: {},
  userAnswer: [],
  testItem: false,
  evaluation: {},
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  withTheme,
  connect(
    state => ({
      isSidebarCollapsed: state.authorUi.isSidebarCollapsed
    }),
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

const ClozeTextContainer = enhance(ClozeText);

export { ClozeTextContainer as ClozeText };
