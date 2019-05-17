import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper } from "@edulastic/common";
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
import { Widget } from "../../styled/Widget";

import { replaceVariables, updateVariables } from "../../utils/variables";

import ComposeQuestion from "./ComposeQuestion";
import Template from "./Template";

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
  isSidebarCollapsed
}) => {
  const [template, setTemplate] = useState("");

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

  const getPreviewTemplate = tmpl => {
    let temp = ` ${tmpl}`.slice(1);
    temp = temp.replace(/<p class="response-btn.*?<\/p>/g, '<span class="mathField">\\MathQuillMathField{}</span>');
    temp = temp.replace(
      /<span class="response-btn.*?<\/span>/g,
      '<span class="mathField">\\MathQuillMathField{}</span>'
    );
    return temp;
  };

  useEffect(() => {
    setTemplate(replaceVariables(getPreviewTemplate(item.template)));
  }, [item.template]);

  const itemForPreview = replaceVariables(item);

  return (
    <Fragment>
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
          <Widget>
            <ClozeMathAnswers
              id="answers"
              item={item}
              setQuestionData={_setQuestionData}
              fillSections={fillSections}
              cleanSections={cleanSections}
            />
          </Widget>
          <MathFormulaOptions
            onChange={_itemChange}
            uiStyle={item.ui_style}
            item={item}
            responseContainers={item.response_containers}
            textBlocks={item.text_blocks}
            stimulusReview={item.stimulus_review}
            instructorStimulus={item.instructor_stimulus}
            metadata={item.metadata}
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
            template={template}
            saveAnswer={saveAnswer}
            check={checkAnswer}
            userAnswer={userAnswer}
            evaluation={evaluation}
          />
        </Paper>
      )}
    </Fragment>
  );
};

ClozeMath.propTypes = {
  view: PropTypes.string.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.array,
  evaluation: PropTypes.array,
  previewTab: PropTypes.string,
  item: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  isSidebarCollapsed: PropTypes.bool.isRequired
};

ClozeMath.defaultProps = {
  previewTab: CLEAR,
  userAnswer: [],
  item: {},
  evaluation: [],
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
