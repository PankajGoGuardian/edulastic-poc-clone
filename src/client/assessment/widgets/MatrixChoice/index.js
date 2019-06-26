import React, { Fragment, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";
import { withRouter } from "react-router-dom";

import { Paper } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { replaceVariables, updateVariables } from "../../utils/variables";

import Options from "./components/Options";
import Preview from "./components/Preview";
import { checkAnswerAction } from "../../../author/src/actions/testItem";

import ComposeQuestion from "./ComposeQuestion";
import MultipleChoiceOptions from "./MultipleChoiceOptions";
import Steams from "./Steams";
import Answers from "./Answers";
import { ContentArea } from "../../styled/ContentArea";
import { PREVIEW, EDIT, CLEAR, CHECK, SHOW } from "../../constants/constantsForQuestions";

const EmptyWrapper = styled.div``;

const MatrixChoice = ({
  view,
  testItem,
  previewTab,
  item,
  setQuestionData,
  saveAnswer,
  userAnswer,
  smallSize,
  checkAnswer,
  fillSections,
  cleanSections,
  isSidebarCollapsed,
  advancedAreOpen,
  disableResponse,
  ...restProps
}) => {
  const [feedbackAttempts, setFeedbackAttempts] = useState(item.feedback_attempts);
  const Wrapper = testItem ? EmptyWrapper : Paper;

  const handleItemChangeChange = (prop, uiStyle) => {
    setQuestionData(
      produce(item, draft => {
        draft[prop] = uiStyle;
        updateVariables(draft);
      })
    );
  };

  let answer = userAnswer;

  if (!userAnswer && item && item.stems) {
    answer = {
      value: item.stems.map(() => null)
    };
  } else if (Array.isArray(userAnswer)) {
    answer = {
      value: userAnswer
    };
  }

  const _checkAnswer = () => {
    if (!userAnswer || (Array.isArray(userAnswer) && !userAnswer.length)) {
      return;
    }

    setFeedbackAttempts(feedbackAttempts - 1);
    checkAnswer();
  };

  const itemForPreview = useMemo(() => replaceVariables(item), [item]);

  return (
    <Fragment>
      {view === EDIT && (
        <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
          <Fragment>
            <ComposeQuestion
              setQuestionData={setQuestionData}
              fillSections={fillSections}
              item={item}
              cleanSections={cleanSections}
            />
            <MultipleChoiceOptions
              item={item}
              setQuestionData={setQuestionData}
              fillSections={fillSections}
              cleanSections={cleanSections}
            />
            <Steams
              item={item}
              setQuestionData={setQuestionData}
              fillSections={fillSections}
              cleanSections={cleanSections}
            />
            <Answers
              item={item}
              setQuestionData={setQuestionData}
              fillSections={fillSections}
              cleanSections={cleanSections}
            />
            <Options
              onChange={handleItemChangeChange}
              uiStyle={item.ui_style}
              fillSections={fillSections}
              cleanSections={cleanSections}
              advancedAreOpen={advancedAreOpen}
            />
          </Fragment>
        </ContentArea>
      )}
      {view === PREVIEW && (
        <Wrapper>
          {previewTab === CHECK && (
            <Preview
              type="check"
              saveAnswer={saveAnswer}
              userAnswer={answer}
              item={itemForPreview}
              feedbackAttempts={feedbackAttempts}
              onCheckAnswer={_checkAnswer}
              {...restProps}
            />
          )}

          {previewTab === SHOW && (
            <Preview
              type="show"
              saveAnswer={saveAnswer}
              userAnswer={answer}
              item={itemForPreview}
              feedbackAttempts={feedbackAttempts}
              onCheckAnswer={_checkAnswer}
              {...restProps}
            />
          )}

          {previewTab === CLEAR && (
            <Preview
              smallSize={smallSize}
              type="clear"
              saveAnswer={!disableResponse ? saveAnswer : () => {}}
              userAnswer={answer}
              item={itemForPreview}
              feedbackAttempts={feedbackAttempts}
              onCheckAnswer={_checkAnswer}
              {...restProps}
            />
          )}
        </Wrapper>
      )}
    </Fragment>
  );
};

MatrixChoice.propTypes = {
  view: PropTypes.string.isRequired,
  userAnswer: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  previewTab: PropTypes.string,
  testItem: PropTypes.bool,
  item: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  disableResponse: PropTypes.bool,
  isSidebarCollapsed: PropTypes.bool.isRequired
};

MatrixChoice.defaultProps = {
  previewTab: "clear",
  testItem: false,
  item: {},
  userAnswer: null,
  smallSize: false,
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
  disableResponse: false
};

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  connect(
    ({ authorUi }) => ({ isSidebarCollapsed: authorUi.isSidebarCollapsed }),
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction
    }
  )
);

const MatrixChoiceContainer = enhance(MatrixChoice);

export { MatrixChoiceContainer as MatrixChoice };
