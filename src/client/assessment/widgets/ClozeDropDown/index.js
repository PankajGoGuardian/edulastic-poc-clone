import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { cloneDeep } from "lodash";
import styled, { withTheme } from "styled-components";
import produce from "immer";

import { desktopWidth } from "@edulastic/colors";
import { Checkbox, Paper } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { EDIT } from "../../constants/constantsForQuestions";

import { CorrectAnswerOptions } from "../../styled/CorrectAnswerOptions";
import { Widget } from "../../styled/Widget";

import Authoring from "./Authoring";
import CorrectAnswers from "./CorrectAnswers";
import Display from "./Display";
import Options from "./components/Options";

import { replaceVariables, updateVariables } from "../../utils/variables";

const EmptyWrapper = styled.div``;

const ContentArea = styled.div`
  max-width: 76.7%;
  margin-left: auto;

  @media (max-width: ${desktopWidth}) {
    max-width: 100%;
  }
`;

class ClozeDropDown extends Component {
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
      fillSections,
      cleanSections,
      theme
    } = this.props;

    const {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      itemForPreview,
      uiStyle,
      instructorStimulus
    } = this.getRenderData();

    const { shuffleOptions } = item;

    const Wrapper = testItem ? EmptyWrapper : Paper;

    return (
      <div>
        {view === "edit" && (
          <ContentArea>
            <React.Fragment>
              <div className="authoring">
                <Authoring item={itemForEdit} fillSections={fillSections} cleanSections={cleanSections} />
                <Widget>
                  <CorrectAnswers
                    key={shuffleOptions}
                    validation={item.validation}
                    configureOptions={{
                      shuffleOptions
                    }}
                    options={previewDisplayOptions}
                    question={previewStimulus}
                    uiStyle={uiStyle}
                    templateMarkUp={itemForEdit.templateMarkUp}
                    onAddAltResponses={this.handleAddAltResponses}
                    fillSections={fillSections}
                    cleanSections={cleanSections}
                  />
                  <CorrectAnswerOptions>
                    <Checkbox
                      className="additional-options"
                      key={`shuffleOptions_${shuffleOptions}`}
                      onChange={() => this.handleOptionsChange("shuffleOptions", !shuffleOptions)}
                      label={t("component.cloze.dropDown.shuffleoptions")}
                      checked={shuffleOptions}
                    />
                  </CorrectAnswerOptions>
                </Widget>
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
                />
              </div>
            </React.Fragment>
          </ContentArea>
        )}
        {view === "preview" && (
          <Wrapper>
            <Display
              showAnswer={previewTab === "show"}
              preview={previewTab === "clear"}
              checkAnswer={previewTab === "check"}
              configureOptions={{
                shuffleOptions
              }}
              item={itemForPreview}
              smallSize={smallSize}
              options={previewDisplayOptions}
              question={previewStimulus}
              uiStyle={uiStyle}
              templateMarkUp={itemForPreview.templateMarkUp}
              userAnswer={userAnswer}
              userSelections={userAnswer}
              onChange={this.handleAddAnswer}
              evaluation={evaluation}
              instructorStimulus={instructorStimulus}
            />
          </Wrapper>
        )}
      </div>
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
  cleanSections: PropTypes.func
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

const ClozeDropDownContainer = enhance(ClozeDropDown);

export { ClozeDropDownContainer as ClozeDropDown };
