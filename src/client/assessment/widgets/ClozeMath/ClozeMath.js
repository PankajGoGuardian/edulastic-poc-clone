/* eslint-disable func-names */
/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
import { Paper, WithResources } from "@edulastic/common";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";

import { withTutorial } from "../../../tutorials/withTutorial";
import { CLEAR, PREVIEW, EDIT } from "../../constants/constantsForQuestions";
import ClozeMathAnswers from "./ClozeMathAnswers";
import ClozeMathPreview from "./ClozeMathPreview";
import MathFormulaOptions from "../MathFormula/components/MathFormulaOptions";
import { checkAnswerAction } from "../../../author/src/actions/testItem";
import { setQuestionDataAction } from "../../../author/src/actions/question";
import { ContentArea } from "../../styled/ContentArea";

import { replaceVariables, updateVariables } from "../../utils/variables";

import ComposeQuestion from "./ComposeQuestion";
import Template from "./Template";
import ChoicesForDropDown from "./ChoicesForDropDown";

const ClozeMath = ({
  view,
  previewTab,
  item,
  setQuestionData,
  saveAnswer,
  checkAnswer,
  evaluation,
  userAnswer,
  fillSections,
  cleanSections,
  isSidebarCollapsed,
  advancedAreOpen,
  ...restProps
}) => {
  const _itemChange = (prop, uiStyle) => {
    const newItem = produce(item, draft => {
      draft[prop] = uiStyle;
      updateVariables(draft);
    });

    setQuestionData(newItem);
  };

  const _setQuestionData = newItem => {
    setQuestionData(
      produce(newItem, draft => {
        updateVariables(draft);
      })
    );
  };

  const itemForPreview = replaceVariables(item);

  return (
    <WithResources
      resources={[
        "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js",
        "https://cdnedupoc.snapwiz.net/mathquill/mathquill.css",
        "https://cdnedupoc.snapwiz.net/mathquill/mathquill.min.js"
      ]}
      fallBack={<span />}
      onLoaded={() => {}}
    >
      {view === EDIT && (
        <ContentArea data-cy="question-area" isSidebarCollapsed={isSidebarCollapsed}>
          <ComposeQuestion
            item={item}
            setQuestionData={_setQuestionData}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
          <Template
            item={item}
            setQuestionData={_setQuestionData}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
          <ClozeMathAnswers
            id="answers"
            item={item}
            setQuestionData={_setQuestionData}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
          <ChoicesForDropDown item={item} fillSections={fillSections} cleanSections={cleanSections} />

          <MathFormulaOptions
            onChange={_itemChange}
            uiStyle={item.ui_style}
            item={item}
            responseContainers={item.response_containers}
            textBlocks={item.text_blocks}
            stimulusReview={item.stimulus_review}
            instructorStimulus={item.instructor_stimulus}
            metadata={item.metadata}
            advancedAreOpen={advancedAreOpen}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
        </ContentArea>
      )}
      {view === PREVIEW && (
        <Paper style={{ height: "100%", overflow: "visible" }}>
          <ClozeMathPreview
            type={previewTab}
            item={itemForPreview}
            template={item.template}
            options={item.options || {}}
            responseIds={item.response_ids}
            saveAnswer={saveAnswer}
            check={checkAnswer}
            userAnswer={userAnswer}
            evaluation={evaluation}
            {...restProps}
          />
        </Paper>
      )}
    </WithResources>
  );
};

ClozeMath.propTypes = {
  view: PropTypes.string.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  evaluation: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  previewTab: PropTypes.string,
  item: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  isSidebarCollapsed: PropTypes.bool.isRequired
};

ClozeMath.defaultProps = {
  previewTab: CLEAR,
  userAnswer: [],
  item: {},
  evaluation: [],
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withTutorial("clozeMath"),
  connect(
    (state, { item }) => ({
      evaluation: state.evaluation[item.id],
      isSidebarCollapsed: state.authorUi.isSidebarCollapsed
    }),
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction
    }
  )
);

export default enhance(ClozeMath);
