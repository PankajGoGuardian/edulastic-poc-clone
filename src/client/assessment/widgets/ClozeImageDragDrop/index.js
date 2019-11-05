/* eslint-disable react/no-unused-state */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { cloneDeep } from "lodash";
import styled, { withTheme } from "styled-components";
import { Checkbox } from "antd";
import produce from "immer";
import { withNamespaces } from "@edulastic/localization";
import { PaddingDiv, AnswerContext } from "@edulastic/common";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { changePreviewAction } from "../../../author/src/actions/view";
import { getSnapItemsByIdSelector } from "../../selectors/snapItems";
import { EDIT } from "../../constants/constantsForQuestions";
import { replaceVariables, updateVariables } from "../../utils/variables";

import { CorrectAnswerOptions } from "../../styled/CorrectAnswerOptions";

import Options from "./components/Options";
import CorrectAnswers from "./CorrectAnswers";
import Display from "./Display";
import Authoring from "./Authoring";
import { ContentArea } from "../../styled/ContentArea";
import { MaxRespCountWrapper, MaxRespCountInput } from "./styled/FieldWrapper";
import Annotations from "../../components/Annotations/Annotations";
import Question from "../../components/Question";
import { StyledPaperWrapper } from "../../styled/Widget";

const EmptyWrapper = styled.div`
  overflow-x: auto;
  padding-bottom: 10px;
`;

class ClozeImageDragDrop extends Component {
  static contextType = AnswerContext;

  state = {
    duplicatedResponses: false,
    shuffleOptions: false,
    showDraghandle: false,
    transparentResponses: false
  };

  static contextType = AnswerContext;

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

  handleOptionsChange = (name, value) => {
    const { setQuestionData, item } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft[name] = value;
        updateVariables(draft);
      })
    );

    switch (name) {
      case "duplicatedResponses": {
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
      theme,
      advancedAreOpen,
      fillSections,
      cleanSections,
      advancedLink,
      setQuestionData,
      ...restProps
    } = this.props;
    const { previewStimulus, previewDisplayOptions, itemForEdit, itemForPreview, uiStyle } = this.getRenderData();
    const duplicatedResponses = item.duplicatedResponses || false;
    const showDraghandle = item.show_draghandle || false;
    const shuffleOptions = item.shuffleOptions || false;
    const transparentResponses = item.transparent_responses || false;

    const Wrapper = testItem ? EmptyWrapper : StyledPaperWrapper;

    const { expressGrader, isAnswerModifiable } = answerContextConfig;

    const isCheckAnswer = previewTab === "check" || (expressGrader && !isAnswerModifiable);
    const isClearAnswer = previewTab === "clear" || (isAnswerModifiable && expressGrader);
    const isShowAnswer = previewTab === "show" && !expressGrader;

    return (
      <div>
        {view === "edit" && (
          <ContentArea>
            <React.Fragment>
              <div className="authoring">
                <Authoring
                  item={itemForEdit}
                  theme={theme}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                  setQuestionData={setQuestionData}
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
                    options={previewDisplayOptions}
                    imageAlterText={item.imageAlterText}
                    responses={item.responses}
                    imageUrl={item.imageUrl}
                    imageWidth={item.imageWidth}
                    imageHeight={item.imageHeight}
                    question={previewStimulus}
                    showDashedBorder={item.responseLayout && item.responseLayout.showdashedborder}
                    uiStyle={uiStyle}
                    backgroundColor={item.background}
                    maxRespCount={item.maxRespCount}
                    onAddAltResponses={this.handleAddAltResponses}
                    fillSections={fillSections}
                    cleanSections={cleanSections}
                    questionId={item.id}
                    imageOptions={item.imageOptions}
                    item={item}
                  >
                    <CorrectAnswerOptions>
                      <Checkbox
                        data-cy="multi-check"
                        className="additional-options"
                        onChange={() => this.handleOptionsChange("duplicatedResponses", !duplicatedResponses)}
                        defaultChecked={duplicatedResponses}
                      >
                        {t("component.cloze.imageDragDrop.duplicatedresponses")}
                      </Checkbox>
                      <Checkbox
                        data-cy="drag-check"
                        className="additional-options"
                        onChange={() => this.handleOptionsChange("show_draghandle", !showDraghandle)}
                        defaultChecked={showDraghandle}
                      >
                        {t("component.cloze.imageDragDrop.showdraghandle")}
                      </Checkbox>
                      <Checkbox
                        data-cy="shuffle-check"
                        className="additional-options"
                        onChange={() => this.handleOptionsChange("shuffleOptions", !shuffleOptions)}
                        defaultChecked={shuffleOptions}
                      >
                        {t("component.cloze.imageDragDrop.shuffleoptions")}
                      </Checkbox>
                      <Checkbox
                        data-cy="transparent-check"
                        className="additional-options"
                        onChange={() => this.handleOptionsChange("transparent_responses", !transparentResponses)}
                        defaultChecked={transparentResponses}
                      >
                        {t("component.cloze.imageDragDrop.transparentpossibleresponses")}
                      </Checkbox>
                    </CorrectAnswerOptions>
                    <MaxRespCountWrapper>
                      <MaxRespCountInput
                        data-cy="drag-drop-image-max-res"
                        min={1}
                        max={10}
                        defaultValue={item.maxRespCount}
                        onChange={val => this.handleOptionsChange("maxRespCount", val)}
                      />
                      <PaddingDiv>{t("component.cloze.imageDragDrop.maximumresponses")}</PaddingDiv>
                    </MaxRespCountWrapper>
                  </CorrectAnswers>
                </Question>

                <Question
                  section="main"
                  label={t("common.options.annotations")}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                >
                  <Annotations question={item} setQuestionData={setQuestionData} editable />
                </Question>
              </div>

              {advancedLink}

              <Options
                onChange={this.handleOptionsChange}
                uiStyle={uiStyle}
                responses={item.responses}
                outerStyle={{
                  padding: "30px 120px"
                }}
                advancedAreOpen={advancedAreOpen}
                fillSections={fillSections}
                cleanSections={cleanSections}
              />
            </React.Fragment>
          </ContentArea>
        )}
        {view === "preview" && (
          <Wrapper>
            <Display
              checkAnswer={isCheckAnswer}
              showAnswer={isShowAnswer}
              preview={isClearAnswer}
              item={itemForPreview}
              options={previewDisplayOptions}
              question={previewStimulus}
              uiStyle={uiStyle}
              templateMarkUp={itemForPreview.templateMarkUp}
              userAnswer={userAnswer}
              userSelections={userAnswer}
              onChange={this.handleAddAnswer}
              maxRespCount={item.maxRespCount}
              showDashedBorder={item.responseLayout && item.responseLayout.showdashedborder}
              configureOptions={{
                duplicatedResponses,
                showDraghandle,
                shuffleOptions,
                transparentResponses
              }}
              imageAlterText={item.imageAlterText}
              imageTitle={item.imageTitle}
              responseContainers={item.responses}
              imageUrl={item.imageUrl}
              imageWidth={item.imageWidth}
              imageHeight={item.imageHeight}
              evaluation={evaluation}
              imageOptions={item.imageOptions}
              showBorder={false}
              setQuestionData={setQuestionData}
              validation={itemForPreview.validation}
              responses={item.responses}
              backgroundColor={item.background}
              smallSize={smallSize}
              previewTab={previewTab}
              isExpressGrader={expressGrader && previewTab === "show"}
              getHeading={t}
              {...restProps}
            />
          </Wrapper>
        )}
      </div>
    );
  }
}

ClozeImageDragDrop.propTypes = {
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
  theme: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  changePreview: PropTypes.func.isRequired,
  snapItems: PropTypes.array,
  advancedLink: PropTypes.any
};

ClozeImageDragDrop.defaultProps = {
  previewTab: "clear",
  item: {
    options: []
  },
  smallSize: false,
  history: {},
  userAnswer: [],
  snapItems: [],
  testItem: false,
  advancedLink: null,
  advancedAreOpen: false,
  evaluation: [],
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  withTheme,
  connect(
    (state, { item }) => ({
      snapItems: getSnapItemsByIdSelector(state, item.id)
    }),
    { setQuestionData: setQuestionDataAction, changePreview: changePreviewAction }
  )
);

const ClozeImageDragDropContainer = enhance(ClozeImageDragDrop);

export { ClozeImageDragDropContainer as ClozeImageDragDrop };
