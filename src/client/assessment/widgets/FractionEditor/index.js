import React from "react";
import produce from "immer";

import { CLEAR, PREVIEW, EDIT } from "../../constants/constantsForQuestions";
import { ContentArea } from "../../styled/ContentArea";
import ComposeQuestion from "./components/ComposeQuestion";
import CorrectAnswers from "./components/CorrectAnswers";
import Options from "./components/Options";
import Display from "./components/Display";

const FractionEditor = props => {
  const {
    view,
    isSidebarCollapsed,
    item,
    setQuestionData,
    fillSections,
    cleanSections,
    t,
    saveAnswer,
    evaluation,
    previewTab,
    showQuestionNumber,
    userAnswer
  } = props;

  return (
    <>
      {view === EDIT ? (
        <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
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
            produce={produce}
            item={item}
          />
        </ContentArea>
      ) : (
        <Display
          saveAnswer={saveAnswer}
          item={item}
          t={t}
          stimulus={item.stimulus}
          produce={produce}
          evaluation={evaluation}
          previewTab={previewTab}
          showQuestionNumber={showQuestionNumber}
          userAnswer={userAnswer}
        />
      )}
    </>
  );
};
export default FractionEditor;
