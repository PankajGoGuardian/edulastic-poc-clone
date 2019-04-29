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
import { desktopWidth } from "@edulastic/colors";
import { Paper } from "@edulastic/common";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { EDIT } from "../../constants/constantsForQuestions";
import { replaceVariables, updateVariables } from "../../utils/variables";

import { CorrectAnswerOptions } from "../../styled/CorrectAnswerOptions";
import { Widget } from "../../styled/Widget";

import Options from "./components/Options";
import CorrectAnswers from "./CorrectAnswers";
import Display from "./Display";
import Authoring from "./Authoring";

const EmptyWrapper = styled.div``;

const ContentArea = styled.div`
  max-width: 76.7%;
  margin-left: auto;

  @media (max-width: ${desktopWidth}) {
    max-width: 100%;
  }
`;

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
      fillSections,
      cleanSections
    } = this.props;
    const { previewStimulus, previewDisplayOptions, itemForEdit, itemForPreview, uiStyle } = this.getRenderData();
    const { duplicatedResponses, showDraghandle, shuffleOptions, transparentResponses } = this.state;

    const Wrapper = testItem ? EmptyWrapper : Paper;

    return (
      <div>
        {view === "edit" && (
          <ContentArea>
            <React.Fragment>
              <div className="authoring">
                <Authoring item={itemForEdit} theme={theme} fillSections={fillSections} cleanSections={cleanSections} />
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
                    fillSections={fillSections}
                    cleanSections={cleanSections}
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
                </Widget>
              </div>
              <Options
                onChange={this.handleOptionsChange}
                uiStyle={uiStyle}
                outerStyle={{
                  padding: "30px 120px"
                }}
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
                evaluation={evaluation}
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
                evaluation={evaluation}
              />
            )}
            {previewTab === "clear" && (
              <Display
                preview
                item={itemForPreview}
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
  cleanSections: PropTypes.func
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
  evaluation: [],
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  withTheme,
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

const ClozeImageDragDropContainer = enhance(ClozeImageDragDrop);

export { ClozeImageDragDropContainer as ClozeImageDragDrop };
