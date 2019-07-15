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
import { Paper, PaddingDiv } from "@edulastic/common";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { changePreviewAction } from "../../../author/src/actions/view";
import { EDIT } from "../../constants/constantsForQuestions";
import { replaceVariables, updateVariables } from "../../utils/variables";

import { CorrectAnswerOptions } from "../../styled/CorrectAnswerOptions";
import { Widget } from "../../styled/Widget";

import Options from "./components/Options";
import CorrectAnswers from "./CorrectAnswers";
import Display from "./Display";
import Authoring from "./Authoring";
import { ContentArea } from "../../styled/ContentArea";
import { MaxRespCountWrapper, MaxRespCountInput } from "./styled/FieldWrapper";
import Annotations from "../../components/Graph/Annotations/Annotations";

const EmptyWrapper = styled.div``;

class ClozeImageDragDrop extends Component {
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
      isSidebarCollapsed,
      setQuestionData,
      ...restProps
    } = this.props;
    const { previewStimulus, previewDisplayOptions, itemForEdit, itemForPreview, uiStyle } = this.getRenderData();
    const duplicatedResponses = item.duplicated_responses || false;
    const showDraghandle = item.show_draghandle || false;
    const shuffleOptions = item.shuffle_options || false;
    const transparentResponses = item.transparent_responses || false;

    const Wrapper = testItem ? EmptyWrapper : Paper;

    return (
      <div>
        {view === "edit" && (
          <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
            <React.Fragment>
              <div className="authoring">
                <Authoring
                  item={itemForEdit}
                  theme={theme}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                  setQuestionData={setQuestionData}
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
                  />
                  <CorrectAnswerOptions>
                    <Checkbox
                      data-cy="multi-check"
                      className="additional-options"
                      onChange={() => this.handleOptionsChange("duplicated_responses", !duplicatedResponses)}
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
                      onChange={() => this.handleOptionsChange("shuffle_options", !shuffleOptions)}
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
                  <Annotations editable />
                </Widget>
              </div>
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
            {previewTab === "check" && (
              <Display
                checkAnswer
                item={itemForPreview}
                options={previewDisplayOptions}
                instructorStimulus={itemForPreview.instructor_stimulus}
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
                {...restProps}
              />
            )}
            {previewTab === "show" && (
              <Display
                showAnswer
                item={itemForPreview}
                instructorStimulus={itemForPreview.instructor_stimulus}
                options={previewDisplayOptions}
                question={previewStimulus}
                uiStyle={uiStyle}
                templateMarkUp={itemForPreview.templateMarkUp}
                maxRespCount={item.maxRespCount}
                userAnswer={userAnswer}
                userSelections={userAnswer}
                validation={itemForPreview.validation}
                showDashedBorder={itemForPreview.responseLayout && itemForPreview.responseLayout.showdashedborder}
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
                {...restProps}
              />
            )}
            {previewTab === "clear" && (
              <Display
                preview
                item={itemForPreview}
                responses={item.responses}
                instructorStimulus={itemForPreview.instructor_stimulus}
                validation={itemForPreview.validation}
                configureOptions={{
                  duplicatedResponses,
                  showDraghandle,
                  shuffleOptions,
                  transparentResponses
                }}
                options={previewDisplayOptions}
                imageAlterText={item.imageAlterText}
                imageTitle={item.imageTitle}
                responseContainers={item.responses}
                imageUrl={item.imageUrl}
                imageWidth={item.imageWidth}
                imageHeight={item.imageHeight}
                question={previewStimulus}
                maxRespCount={item.maxRespCount}
                showDashedBorder={item.responseLayout && item.responseLayout.showdashedborder}
                uiStyle={uiStyle}
                backgroundColor={item.background}
                smallSize={smallSize}
                templateMarkUp={itemForPreview.templateMarkUp}
                userSelections={userAnswer}
                userAnswer={userAnswer}
                onChange={this.handleAddAnswer}
                imageOptions={item.imageOptions}
                showBorder={false}
                {...restProps}
              />
            )}
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
  isSidebarCollapsed: PropTypes.bool.isRequired,
  advancedAreOpen: PropTypes.bool,
  changePreview: PropTypes.func.isRequired
};

ClozeImageDragDrop.defaultProps = {
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
  withTheme,
  connect(
    ({ authorUi }) => ({ isSidebarCollapsed: authorUi.isSidebarCollapsed }),
    { setQuestionData: setQuestionDataAction, changePreview: changePreviewAction }
  )
);

const ClozeImageDragDropContainer = enhance(ClozeImageDragDrop);

export { ClozeImageDragDropContainer as ClozeImageDragDrop };
