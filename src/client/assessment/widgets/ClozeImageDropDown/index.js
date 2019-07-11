import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { cloneDeep } from "lodash";
import produce from "immer";

import { Checkbox, Paper } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { changePreviewAction } from "../../../author/src/actions/view";
import { EDIT } from "../../constants/constantsForQuestions";
import { replaceVariables, updateVariables } from "../../utils/variables";

import { CorrectAnswerOptions } from "../../styled/CorrectAnswerOptions";

import Options from "./components/Options";
import Display from "./Display";
import CorrectAnswers from "./CorrectAnswers";
import Authoring from "./Authoring";
import { OptionsContainer } from "./styled/OptionsContainer";
import { EditorContainer } from "./styled/EditorContainer";
import { AdditionalContainer } from "./styled/AdditionalContainer";
import Question from "../../components/Question";

import { ContentArea } from "../../styled/ContentArea";

class ClozeImageDropDown extends Component {
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

  handleItemChangeChange = (prop, uiStyle) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft[prop] = uiStyle;
      })
    );
  };

  handleValidationChange = (prop, uiStyle) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation[prop] = uiStyle;
      })
    );
  };

  handleUiStyleChange = (prop, uiStyle) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.ui_style[prop] = uiStyle;
      })
    );
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

    const { previewStimulus, previewDisplayOptions, itemForEdit, itemForPreview, uiStyle } = this.getRenderData();
    const { duplicatedResponses, showDraghandle, shuffleOptions, transparentResponses } = this.state;

    const Wrapper = testItem ? React.Fragment : Paper;

    const fontSize = item.ui_style ? (item.ui_style.fontsize ? item.ui_style.fontsize : "lol") : "lol";

    const { imagescale } = item;

    return (
      <React.Fragment>
        {view === "edit" && (
          <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
            <React.Fragment>
              <EditorContainer>
                <div className="authoring">
                  <Authoring
                    fontSize={fontSize}
                    item={itemForEdit}
                    fillSections={fillSections}
                    cleanSections={cleanSections}
                  />
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
                        duplicatedResponses,
                        showDraghandle,
                        shuffleOptions,
                        transparentResponses
                      }}
                      item={item}
                      imagescale={imagescale}
                      options={previewDisplayOptions}
                      imageAlterText={item.imageAlterText}
                      responses={item.responses}
                      imageUrl={item.imageUrl}
                      imageWidth={item.imageWidth}
                      imageHeight={item.imageHeight || 0}
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
                      <CorrectAnswerOptions>
                        <Checkbox
                          className="additional-options"
                          onChange={() => this.handleOptionsChange("shuffle_options", !shuffleOptions)}
                          label={t("component.cloze.imageDropDown.shuffleoptions")}
                          checked={shuffleOptions}
                        />
                      </CorrectAnswerOptions>
                    </AdditionalContainer>
                  </Question>
                </div>
              </EditorContainer>
              <OptionsContainer>
                <Options
                  questionData={item}
                  uiStyle={uiStyle}
                  onChange={this.handleOptionsChange}
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
            <Display
              preview={previewTab === "clear"}
              showAnswer={previewTab === "show"}
              checkAnswer={previewTab === "check"}
              validation={itemForPreview.validation}
              configureOptions={{
                duplicatedResponses,
                showDraghandle,
                shuffleOptions,
                transparentResponses
              }}
              item={item}
              options={previewDisplayOptions}
              imageAlterText={item.imageAlterText}
              imagescale={imagescale}
              responseContainers={itemForPreview.responses}
              evaluation={evaluation}
              imageUrl={item.imageUrl}
              imageWidth={item.imageWidth}
              imageHeight={item.imageHeight || 0}
              question={previewStimulus}
              showDashedBorder={item.responseLayout && item.responseLayout.showdashedborder}
              uiStyle={uiStyle}
              backgroundColor={item.background || "#fff"}
              key={previewDisplayOptions && previewStimulus && uiStyle}
              smallSize={smallSize}
              templateMarkUp={itemForPreview.templateMarkUp}
              userSelections={userAnswer}
              maxRespCount={item.maxRespCount}
              onChange={this.handleAddAnswer}
              qIndex={qIndex}
              imageOptions={item.imageOptions}
              {...restProps}
            />
          </Wrapper>
        )}
      </React.Fragment>
    );
  }
}

ClozeImageDropDown.propTypes = {
  qIndex: PropTypes.number.isRequired,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  item: PropTypes.object,
  smallSize: PropTypes.bool,
  history: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.array,
  t: PropTypes.func.isRequired,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  isSidebarCollapsed: PropTypes.bool.isRequired
};

ClozeImageDropDown.defaultProps = {
  previewTab: "clear",
  item: {
    options: []
  },
  smallSize: false,
  history: {},
  userAnswer: [],
  testItem: false,
  advancedAreOpen: false,
  evaluation: [],
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  connect(
    ({ authorUi }) => ({ isSidebarCollapsed: authorUi.isSidebarCollapsed }),
    { setQuestionData: setQuestionDataAction, changePreview: changePreviewAction }
  )
);

const ClozeImageDropDownContainer = enhance(ClozeImageDropDown);

export { ClozeImageDropDownContainer as ClozeImageDropDown };
