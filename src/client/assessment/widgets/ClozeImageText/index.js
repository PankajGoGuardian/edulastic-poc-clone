import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { cloneDeep } from "lodash";
import produce from "immer";

import { Checkbox, Paper, PaddingDiv } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { EDIT } from "../../constants/constantsForQuestions";
import { replaceVariables, updateVariables } from "../../utils/variables";

import { ContentArea } from "../../styled/ContentArea";
import { EditorContainer } from "./styled/EditorContainer";
import { OptionsContainer } from "./styled/OptionsContainer";
import { MaxRespCountWrapper } from "./styled/FieldWrapper";
import { MaxRespCountInput } from "./styled/MaxRespCountInput";
import { AdditionalContainer } from "./styled/AdditionalContainer";
import Options from "./components/Options";
import Display from "./Display";
import Authoring from "./Authoring";
import CorrectAnswers from "./CorrectAnswers";
import { Widget } from "../../styled/Widget";

class ClozeImageText extends Component {
  state = {
    duplicatedResponses: false,
    shuffleOptions: false,
    showDraghandle: false,
    transparentResponses: false
  };

  getRenderData = () => {
    const { item: templateItem, history, view } = this.props;
    const itemForPreview = replaceVariables(templateItem);
    const item = view === EDIT ? templateItem : itemForPreview;

    const locationState = history.location.state;
    const isDetailPage = locationState !== undefined ? locationState.itemDetail : false;
    const previewDisplayOptions = item.options;
    let previewStimulus;
    let itemForEdit;
    if (isDetailPage) {
      previewStimulus = item.stimulus;
      itemForEdit = templateItem;
    } else {
      previewStimulus = item.stimulus;
      itemForEdit = {
        ...item,
        stimulus: templateItem.stimulus,
        list: templateItem.options,
        validation: templateItem.validation
      };
    }
    return {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      uiStyle: item.ui_style,
      itemForPreview
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

        if (draft.validation.alt_responses && draft.validation.alt_responses.length) {
          draft.validation.alt_responses.push(response);
        } else {
          draft.validation.alt_responses = [response];
        }
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

    switch (name) {
      case "duplicated_responses": {
        this.setState({ duplicatedResponses: value });
        break;
      }
      case "shuffle_options": {
        this.setState({ shuffleOptions: value });
        break;
      }
      case "show_draghandle": {
        this.setState({ showDraghandle: value });
        break;
      }
      case "transparent_responses": {
        this.setState({ transparentResponses: value });
        break;
      }
      default:
    }
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
      qIndex,
      view,
      previewTab,
      item,
      userAnswer,
      t,
      testItem,
      evaluation,
      advancedAreOpen,
      fillSections,
      cleanSections,
      isSidebarCollapsed,
      ...restProps
    } = this.props;

    const { previewStimulus, previewDisplayOptions, itemForEdit, itemForPreview, uiStyle } = this.getRenderData();

    const ignoreCase = item && item.validation ? item.validation.ignoreCase : false;

    const allowSingleLetterMistake = item && item.validation ? item.validation.allowSingleLetterMistake : false;

    const { duplicatedResponses, showDraghandle, shuffleOptions, transparentResponses } = this.state;

    const Wrapper = testItem ? React.Fragment : Paper;
    return (
      <React.Fragment>
        {view === "edit" && (
          <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
            <React.Fragment>
              <EditorContainer>
                <div className="authoring">
                  <Authoring
                    item={itemForEdit}
                    fillSections={fillSections}
                    cleanSections={cleanSections}
                    imageWidth={item.imageWidth}
                  />
                  <Widget>
                    <CorrectAnswers
                      key={duplicatedResponses || showDraghandle || shuffleOptions}
                      validation={item.validation}
                      configureOptions={{
                        duplicatedResponses,
                        showDraghandle,
                        shuffleOptions,
                        transparentResponses
                      }}
                      options={previewDisplayOptions}
                      imageAlterText={item.imageAlterText}
                      responses={item.responses}
                      imageUrl={item.imageUrl}
                      imageWidth={item.imageWidth}
                      question={previewStimulus}
                      showDashedBorder={item.responseLayout && item.responseLayout.showdashedborder}
                      uiStyle={uiStyle}
                      backgroundColor={item.background}
                      maxRespCount={item.maxRespCount}
                      onAddAltResponses={this.handleAddAltResponses}
                      onRemoveAltResponses={this.handleRemoveAltResponses}
                      fillSections={fillSections}
                      cleanSections={cleanSections}
                      imageOptions={item.imageOptions}
                    />

                    <AdditionalContainer>
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
                      <MaxRespCountWrapper>
                        <MaxRespCountInput
                          data-cy="drag-drop-image-max-res"
                          min={1}
                          max={10}
                          defaultValue={item.maxRespCount}
                          onChange={val => this.handleOptionsChange("maxRespCount", val)}
                        />
                        <PaddingDiv>{t("component.cloze.imageText.maximumresponses")}</PaddingDiv>
                      </MaxRespCountWrapper>
                    </AdditionalContainer>
                  </Widget>
                </div>
              </EditorContainer>
              <OptionsContainer>
                <Options
                  onChange={this.handleOptionsChange}
                  uiStyle={uiStyle}
                  outerStyle={{
                    padding: "16px 60px 7px 60px"
                  }}
                  advancedAreOpen={advancedAreOpen}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                  responses={item.responses}
                />
              </OptionsContainer>
            </React.Fragment>
          </ContentArea>
        )}
        {view === "preview" && (
          <Wrapper>
            {previewTab === "check" && (
              <Display
                checkAnswer
                options={previewDisplayOptions}
                question={previewStimulus}
                uiStyle={uiStyle}
                item={itemForPreview}
                templateMarkUp={itemForPreview.templateMarkUp}
                userSelections={userAnswer}
                onChange={this.handleAddAnswer}
                configureOptions={{
                  duplicatedResponses,
                  showDraghandle,
                  shuffleOptions,
                  transparentResponses
                }}
                imageAlterText={item.imageAlterText}
                responseContainers={itemForPreview.responses}
                imageUrl={item.imageUrl}
                imageWidth={item.imageWidth}
                evaluation={evaluation}
                qIndex={qIndex}
                imageOptions={item.imageOptions}
              />
            )}
            {previewTab === "show" && (
              <Display
                showAnswer
                options={previewDisplayOptions}
                question={previewStimulus}
                uiStyle={uiStyle}
                item={itemForPreview}
                templateMarkUp={itemForPreview.templateMarkUp}
                userSelections={userAnswer}
                validation={itemForPreview.validation}
                configureOptions={{
                  duplicatedResponses,
                  showDraghandle,
                  shuffleOptions,
                  transparentResponses
                }}
                imageAlterText={item.imageAlterText}
                responseContainers={item.responses}
                imageUrl={item.imageUrl}
                imageWidth={item.imageWidth}
                evaluation={evaluation}
                qIndex={qIndex}
                imageOptions={item.imageOptions}
                {...restProps}
              />
            )}
            {previewTab === "clear" && (
              <Display
                preview
                validation={itemForPreview.validation}
                configureOptions={{
                  duplicatedResponses,
                  showDraghandle,
                  shuffleOptions,
                  transparentResponses
                }}
                options={previewDisplayOptions}
                imageAlterText={item.imageAlterText}
                responseContainers={item.responses}
                imageUrl={item.imageUrl}
                imageWidth={item.imageWidth}
                question={previewStimulus}
                showDashedBorder={item.responseLayout && item.responseLayout.showdashedborder}
                uiStyle={uiStyle}
                item={itemForPreview}
                backgroundColor={item.background}
                key={previewDisplayOptions && previewStimulus && uiStyle}
                templateMarkUp={itemForPreview.templateMarkUp}
                userSelections={userAnswer}
                maxRespCount={item.maxRespCount}
                onChange={this.handleAddAnswer}
                qIndex={qIndex}
                imageOptions={item.imageOptions}
                {...restProps}
              />
            )}
          </Wrapper>
        )}
      </React.Fragment>
    );
  }
}

ClozeImageText.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  item: PropTypes.object,
  history: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  qIndex: PropTypes.number.isRequired,
  userAnswer: PropTypes.array,
  t: PropTypes.func.isRequired,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  isSidebarCollapsed: PropTypes.bool.isRequired
};

ClozeImageText.defaultProps = {
  previewTab: "clear",
  item: {
    opttions: []
  },
  history: {},
  userAnswer: [],
  testItem: false,
  evaluation: [],
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  connect(
    ({ authorUi }) => ({ isSidebarCollapsed: authorUi.isSidebarCollapsed }),
    { setQuestionData: setQuestionDataAction }
  )
);

const ClozeImageTextContainer = enhance(ClozeImageText);

export { ClozeImageTextContainer as ClozeImageText };
