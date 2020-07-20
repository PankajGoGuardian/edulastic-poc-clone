import React, { Fragment, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";
import { withRouter } from "react-router-dom";
import { isEmpty } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import {
  CorrectAnswersContainer,
  MathFormulaDisplay,
  QuestionNumberLabel,
  QuestionSubLabel,
  FlexContainer,
  QuestionContentWrapper,
  QuestionLabelWrapper
} from "@edulastic/common";

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
import { PREVIEW, EDIT, SHOW, CLEAR } from "../../constants/constantsForQuestions";
import { changePreviewAction } from "../../../author/src/actions/view";
import { StyledPaperWrapper } from "../../styled/Widget";
import Instructions from "../../components/Instructions";

const EmptyWrapper = styled.div`
  max-width: 100%;
  width: auto;
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
  t,
  evaluation,
  isReviewTab,
  showQuestionNumber,
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

  if (isEmpty(userAnswer) && item && item.stems) {
    answer = {
      value: {}
    };
  }

  const _checkAnswer = () => {
    if (isEmpty(userAnswer)) {
      return;
    }

    setFeedbackAttempts(feedbackAttempts - 1);
    checkAnswer();
  };

  const itemForPreview = useMemo(() => replaceVariables(item), [item]);

  const validResponse = item.validation?.validResponse;
  const altResponses = item.validation?.altResponses;

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
              item={item}
            />
          </Fragment>
        </ContentArea>
      )}
      {view === PREVIEW && (
        <Wrapper>
          <FlexContainer alignItems="baseline" justifyContent="flex-start">
            <QuestionLabelWrapper>
              {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>}
              {item.qSubLabel && <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>}
            </QuestionLabelWrapper>

            <QuestionContentWrapper>
              <MathFormulaDisplay style={{ marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: item.stimulus }} />
              <div style={{ width: "100%" }}>
                {previewTab === CLEAR ? (
                  <Preview
                    smallSize={smallSize}
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
                ) : (
                  <Preview
                    saveAnswer={!disableResponse ? saveAnswer : () => {}}
                    userAnswer={answer}
                    item={itemForPreview}
                    feedbackAttempts={feedbackAttempts}
                    onCheckAnswer={_checkAnswer}
                    previewTab={previewTab}
                    disableResponse={disableResponse}
                    changeView={changeView}
                    evaluation={evaluation}
                    {...restProps}
                  />
                )}
              </div>
            </QuestionContentWrapper>
          </FlexContainer>

          {view !== EDIT && <Instructions item={item} />}

          {(previewTab === SHOW || isReviewTab) && (
            <Fragment>
              <CorrectAnswersContainer item={item} title={t("component.matrix.correctAnswer")}>
                <Preview
                  saveAnswer={() => {}}
                  userAnswer={validResponse}
                  item={itemForPreview}
                  feedbackAttempts={feedbackAttempts}
                  onCheckAnswer={() => {}}
                  previewTab={previewTab}
                  disableResponse
                  changeView={() => {}}
                  evaluation={validResponse.value}
                  pl="20px"
                  {...restProps}
                />
              </CorrectAnswersContainer>

              {altResponses &&
                altResponses.map((altAnswer, i) => (
                  <CorrectAnswersContainer title={`${t("component.matrix.alternateAnswer")} ${i + 1}`}>
                    <Preview
                      saveAnswer={() => {}}
                      userAnswer={altAnswer}
                      item={itemForPreview}
                      feedbackAttempts={feedbackAttempts}
                      onCheckAnswer={() => {}}
                      previewTab={previewTab}
                      disableResponse
                      changeView={() => {}}
                      pl="20px"
                      evaluation={altAnswer.value}
                      {...restProps}
                    />
                  </CorrectAnswersContainer>
                ))}
            </Fragment>
          )}
        </Wrapper>
      )}
    </Fragment>
  );
};

MatrixChoice.propTypes = {
  t: PropTypes.func.isRequired,
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
  changeView: PropTypes.func.isRequired,
  evaluation: PropTypes.object,
  isReviewTab: PropTypes.bool,
  showQuestionNumber: PropTypes.bool
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
  disableResponse: false,
  evaluation: null,
  isReviewTab: false,
  showQuestionNumber: false
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
