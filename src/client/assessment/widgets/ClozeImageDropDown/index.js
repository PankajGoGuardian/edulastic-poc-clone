import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import produce from "immer";

import { AnswerContext } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { changePreviewAction } from "../../../author/src/actions/view";
import { EDIT } from "../../constants/constantsForQuestions";
import { replaceVariables, updateVariables } from "../../utils/variables";

import { CorrectAnswerOptions } from "../../styled/CorrectAnswerOptions";

import Options from "./components/Options";
import Question from "../../components/Question";
import Display from "./Display";
import CorrectAnswers from "./CorrectAnswers";
import Authoring from "./Authoring";
import { EditorContainer } from "./styled/EditorContainer";
import { ContentArea } from "../../styled/ContentArea";
import { StyledPaperWrapper } from "../../styled/Widget";
import { CheckboxLabel } from "../../styled/CheckboxWithLabel";

class ClozeImageDropDown extends Component {
  static contextType = AnswerContext;

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
      uiStyle: item.uiStyle
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
        draft.uiStyle[prop] = uiStyle;
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
      case "shuffleOptions": {
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
    saveAnswer(userAnswer);
  };

  render() {
    const answerContextConfig = this.context;
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
      advancedAreOpen,
      advancedLink,
      ...restProps
    } = this.props;

    const { previewStimulus, previewDisplayOptions, itemForEdit, itemForPreview, uiStyle } = this.getRenderData();
    const { duplicatedResponses, showDraghandle, shuffleOptions, transparentResponses } = this.state;

    const Wrapper = testItem ? React.Fragment : StyledPaperWrapper;

    const fontSize = item.uiStyle ? (item.uiStyle.fontsize ? item.uiStyle.fontsize : "lol") : "lol";

    const { imagescale } = item;

    return (
      <React.Fragment>
        {view === "edit" && (
          <ContentArea>
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
                      showDashedBorder={item.responseLayout && item.responseLayout.showdashedborder}
                      uiStyle={uiStyle}
                      backgroundColor={item.background}
                      maxRespCount={item.maxRespCount}
                      fillSections={fillSections}
                      cleanSections={cleanSections}
                      imageOptions={item.imageOptions}
                    />
                    <CorrectAnswerOptions>
                      <CheckboxLabel
                        className="additional-options"
                        onChange={() => this.handleOptionsChange("shuffleOptions", !shuffleOptions)}
                        data-cy="shuffle-options"
                        checked={shuffleOptions}
                      >
                        {t("component.cloze.imageDropDown.shuffleoptions")}
                      </CheckboxLabel>
                    </CorrectAnswerOptions>
                  </Question>
                </div>
              </EditorContainer>

              {advancedLink}

              <Options
                questionData={item}
                uiStyle={uiStyle}
                onChange={this.handleOptionsChange}
                advancedAreOpen={advancedAreOpen}
                fillSections={fillSections}
                cleanSections={cleanSections}
                responses={item.responses}
                item={item}
              />
            </React.Fragment>
          </ContentArea>
        )}
        {view === "preview" && (
          <Wrapper>
            <Display
              preview={
                previewTab === "clear" || (answerContextConfig.isAnswerModifiable && answerContextConfig.expressGrader)
              }
              showAnswer={previewTab === "show" && !answerContextConfig.expressGrader}
              checkAnswer={
                previewTab === "check" || (answerContextConfig.expressGrader && !answerContextConfig.isAnswerModifiable)
              }
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
              isExpressGrader={answerContextConfig.expressGrader && previewTab === "show"}
              view={view}
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
  userAnswer: PropTypes.object,
  t: PropTypes.func.isRequired,
  testItem: PropTypes.bool,
  evaluation: PropTypes.object,
  advancedLink: PropTypes.any,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

ClozeImageDropDown.defaultProps = {
  previewTab: "clear",
  item: {
    options: []
  },
  smallSize: false,
  history: {},
  userAnswer: {},
  testItem: false,
  advancedAreOpen: false,
  evaluation: {},
  advancedLink: null,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  connect(
    null,
    { setQuestionData: setQuestionDataAction, changePreview: changePreviewAction }
  )
);

const ClozeImageDropDownContainer = enhance(ClozeImageDropDown);

export { ClozeImageDropDownContainer as ClozeImageDropDown };
