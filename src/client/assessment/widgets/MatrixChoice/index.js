import React, { Fragment, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";
import { withRouter } from "react-router-dom";

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
import { changePreviewAction } from "../../../author/src/actions/view";
import { StyledPaperWrapper } from "../../styled/Widget";

const EmptyWrapper = styled.div`
  width: fit-content;
  max-width: 100%;
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
  cleanSections,
  advancedAreOpen,
  disableResponse,
  changeView,
  advancedLink,
  ...restProps
}) => {
  const [feedbackAttempts, setFeedbackAttempts] = useState(item.feedback_attempts);
  const Wrapper = testItem ? EmptyWrapper : StyledPaperWrapper;

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
        <ContentArea>
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

            {advancedLink}

            <Options
              onChange={handleItemChangeChange}
              uiStyle={item.uiStyle}
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
              previewTab={previewTab}
              disableResponse={disableResponse}
              changeView={changeView}
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
              previewTab={previewTab}
              disableResponse={disableResponse}
              changeView={changeView}
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
              previewTab={previewTab}
              disableResponse={disableResponse}
              changeView={changeView}
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
  advancedLink: PropTypes.any,
  previewTab: PropTypes.string,
  testItem: PropTypes.bool,
  item: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  disableResponse: PropTypes.bool,
  changeView: PropTypes.func.isRequired
};

MatrixChoice.defaultProps = {
  previewTab: "clear",
  testItem: false,
  item: {},
  userAnswer: null,
  smallSize: false,
  advancedLink: null,
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
  disableResponse: false
};

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction,
      changeView: changePreviewAction
    }
  )
);

const MatrixChoiceContainer = enhance(MatrixChoice);

export { MatrixChoiceContainer as MatrixChoice };
