/* eslint-disable react/prop-types */
import React from "react";
import produce from "immer";
import PropTypes from "prop-types";

import { CLEAR, EDIT } from "../../constants/constantsForQuestions";
import { ContentArea } from "../../styled/ContentArea";
import ComposeQuestion from "./components/ComposeQuestion";
import CorrectAnswers from "./components/CorrectAnswers";
import Options from "./components/Options";
import Display from "./components/Display";
import Annotations from "../../components/Annotations/Annotations";
import Question from "../../components/Question";
import ExtraSection from "./components/Extras";

const FractionEditor = props => {
  const {
    view,
    item,
    setQuestionData,
    fillSections,
    cleanSections,
    t,
    saveAnswer,
    evaluation,
    previewTab,
    showQuestionNumber,
    userAnswer,
    advancedLink,
    disableResponse,
    changePreviewTab,
    isReviewTab,
    advancedAreOpen
  } = props;
  return (
    <>
      {view === EDIT ? (
        <ContentArea>
          <ComposeQuestion
            fillSections={fillSections}
            cleanSections={cleanSections}
            t={t}
            stimulus={item.stimulus}
            setQuestionData={setQuestionData}
            produce={produce}
            item={item}
          />
          <Options
            setQuestionData={setQuestionData}
            t={t}
            fillSections={fillSections}
            cleanSections={cleanSections}
            produce={produce}
            item={item}
          />
          <CorrectAnswers
            setQuestionData={setQuestionData}
            t={t}
            fillSections={fillSections}
            cleanSections={cleanSections}
            item={item}
          />
          <Question
            section="main"
            label={t("common.options.annotations")}
            fillSections={fillSections}
            cleanSections={cleanSections}
          >
            <Annotations question={item} setQuestionData={setQuestionData} editable />
          </Question>
          {advancedLink}
          <ExtraSection fillSections={fillSections} cleanSections={cleanSections} advancedAreOpen={advancedAreOpen} />
        </ContentArea>
      ) : (
        <Display
          saveAnswer={saveAnswer}
          item={item}
          t={t}
          stimulus={item.stimulus}
          evaluation={evaluation}
          previewTab={previewTab}
          showQuestionNumber={showQuestionNumber}
          userAnswer={userAnswer}
          disableResponse={disableResponse}
          changePreviewTab={changePreviewTab}
          isReviewTab={isReviewTab}
          view={view}
        />
      )}
    </>
  );
};

FractionEditor.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  item: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.array,
  t: PropTypes.func.isRequired,
  evaluation: PropTypes.any,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedLink: PropTypes.any,
  showQuestionNumber: PropTypes.bool
};

FractionEditor.defaultProps = {
  previewTab: CLEAR,
  item: {},
  userAnswer: [],
  evaluation: [],
  advancedLink: null,
  fillSections: () => {},
  cleanSections: () => {},
  showQuestionNumber: false
};

export default FractionEditor;
