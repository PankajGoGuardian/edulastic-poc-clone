import React, { Fragment, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";
import { withRouter } from "react-router-dom";

import { Paper } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { desktopWidth } from "@edulastic/colors";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { replaceVariables, updateVariables } from "../../utils/variables";

import Options from "./components/Options";
import Preview from "./components/Preview";
import { checkAnswerAction } from "../../../author/src/actions/testItem";

import ComposeQuestion from "./ComposeQuestion";
import MultipleChoiceOptions from "./MultipleChoiceOptions";
import Steams from "./Steams";
import Answers from "./Answers";

const EmptyWrapper = styled.div``;

const ContentArea = styled.div`
  max-width: 76.7%;
  margin-left: auto;

  @media (max-width: ${desktopWidth}) {
    max-width: 100%;
  }
`;

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
  cleanSections
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

  if (!userAnswer) {
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
      {view === "edit" && (
        <ContentArea>
          <Fragment>
            <Paper style={{ marginBottom: 25, padding: 0, boxShadow: "none" }}>
              <ComposeQuestion
                setQuestionData={setQuestionData}
                fillSections={fillSections}
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
            </Paper>
            <Options
              onChange={handleItemChangeChange}
              uiStyle={item.ui_style}
              fillSections={fillSections}
              cleanSections={cleanSections}
            />
          </Fragment>
        </ContentArea>
      )}
      {view === "preview" && (
        <Wrapper>
          {previewTab === "check" && (
            <Preview
              type="check"
              saveAnswer={saveAnswer}
              userAnswer={answer}
              item={itemForPreview}
              feedbackAttempts={feedbackAttempts}
              onCheckAnswer={_checkAnswer}
            />
          )}

          {previewTab === "show" && (
            <Preview
              type="show"
              saveAnswer={saveAnswer}
              userAnswer={answer}
              item={itemForPreview}
              feedbackAttempts={feedbackAttempts}
              onCheckAnswer={_checkAnswer}
            />
          )}

          {previewTab === "clear" && (
            <Preview
              smallSize={smallSize}
              type="clear"
              saveAnswer={saveAnswer}
              userAnswer={answer}
              item={itemForPreview}
              feedbackAttempts={feedbackAttempts}
              onCheckAnswer={_checkAnswer}
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
  cleanSections: PropTypes.func
};

MatrixChoice.defaultProps = {
  previewTab: "clear",
  testItem: false,
  item: {},
  userAnswer: null,
  smallSize: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction
    }
  )
);

const MatrixChoiceContainer = enhance(MatrixChoice);

export { MatrixChoiceContainer as MatrixChoice };
