import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { cloneDeep, isEqual } from "lodash";
import styled, { withTheme } from "styled-components";
import produce from "immer";
import { Paper, Checkbox, WithResources } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { EDIT } from "../../constants/constantsForQuestions";
import { updateVariables, replaceVariables } from "../../utils/variables";

import Options from "./components/Options";
import CorrectAnswers from "./CorrectAnswers";
import Authoring from "./Authoring";
import Display from "./Display";
import { ContentArea } from "../../styled/ContentArea";
import { Widget } from "../../styled/Widget";

const EmptyWrapper = styled.div``;

class ClozeText extends Component {
  componentDidUpdate(prevProps) {
    const { item, setQuestionData } = this.props;
    const newItem = cloneDeep(item);
    if (!isEqual(prevProps.item.validation, newItem.validation)) {
      let maxLength = 0;

      newItem.validation.valid_response.value.forEach(resp => {
        maxLength = Math.max(maxLength, resp.length);
      });

      newItem.validation.alt_responses.forEach(arr => {
        arr.value.forEach(resp => {
          maxLength = Math.max(maxLength, resp.length);
        });
      });

      const finalWidth = 30 + maxLength * 7;
      newItem.ui_style.widthpx = finalWidth < 140 ? 140 : finalWidth > 400 ? 400 : finalWidth;

      setQuestionData(newItem);
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
      uiStyle: item.ui_style
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
        if (draft.validation.alt_responses && draft.validation.alt_responses.length) {
          draft.validation.alt_responses = draft.validation.alt_responses.filter((response, i) => i !== index);
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
                <Widget>
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
                    responseIds={item.response_ids}
                    onAddAltResponses={this.handleAddAltResponses}
                    onRemoveAltResponses={this.handleRemoveAltResponses}
                    cleanSections={cleanSections}
                    fillSections={fillSections}
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
                  </div>
                </Widget>
                <Options
                  onChange={this.handleOptionsChange}
                  uiStyle={uiStyle}
                  characterMap={item.character_map}
                  multipleLine={item.multiple_line}
                  advancedAreOpen={advancedAreOpen}
                  cleanSections={cleanSections}
                  fillSections={fillSections}
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
            {previewTab === "check" && (
              <Display
                checkAnswer
                configureOptions={{
                  shuffleOptions
                }}
                smallSize={smallSize}
                options={previewDisplayOptions}
                question={previewStimulus}
                uiStyle={uiStyle}
                templateMarkUp={itemForPreview.templateMarkUp}
                userSelections={userAnswer}
                onChange={this.handleAddAnswer}
                evaluation={evaluation}
                instructorStimulus={itemForPreview.instructor_stimulus}
                item={itemForPreview}
                responseIds={item.response_ids}
                showIndex
              />
            )}
            {previewTab === "show" && (
              <Display
                showAnswer
                configureOptions={{
                  shuffleOptions
                }}
                smallSize={smallSize}
                options={previewDisplayOptions}
                question={previewStimulus}
                uiStyle={uiStyle}
                templateMarkUp={itemForPreview.templateMarkUp}
                userSelections={userAnswer}
                validation={itemForPreview.validation}
                evaluation={evaluation}
                instructorStimulus={itemForPreview.instructor_stimulus}
                item={itemForPreview}
                responseIds={item.response_ids}
                showIndex
                {...restProps}
              />
            )}
            {previewTab === "clear" && (
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
                templateMarkUp={itemForPreview.templateMarkUp}
                userSelections={userAnswer}
                onChange={this.handleAddAnswer}
                instructorStimulus={itemForPreview.instructor_stimulus}
                item={itemForPreview}
                responseIds={item.response_ids}
                showIndex={false}
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
