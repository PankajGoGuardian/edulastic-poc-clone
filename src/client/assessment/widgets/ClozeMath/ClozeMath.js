import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper, CustomQuillComponent, Subtitle } from "@edulastic/common";
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
import QuestionTextArea from "../../components/QuestionTextArea";

const ClozeMath = ({ view, previewTab, item, setQuestionData, saveAnswer, checkAnswer, evaluation, userAnswer }) => {
  const [template, setTemplate] = useState("");

  const _itemChange = (prop, uiStyle) => {
    const newItem = produce(item, draft => {
      draft[prop] = uiStyle;
    });

    setQuestionData(newItem);
  };

  const _reduceResponseButtons = (responseIndexes = [], value) =>
    responseIndexes.map(nextIndex => {
      const response = value.find((_, i) => nextIndex === i + 1);
      return response || [];
    });

  const _updateTemplate = (val, responseIndexes) => {
    const newItem = produce(item, draft => {
      draft.template = val;

      draft.validation.valid_response.value = _reduceResponseButtons(
        responseIndexes,
        draft.validation.valid_response.value
      );

      if (Array.isArray(draft.validation.alt_responses)) {
        draft.validation.alt_responses = draft.validation.alt_responses.map(res => {
          res.value = _reduceResponseButtons(responseIndexes, res.value);
          return res;
        });
      }
    });

    setQuestionData(newItem);
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
    setTemplate(getPreviewTemplate(item.template));
  }, [item.template]);

  return (
    <Fragment>
      {view === EDIT && (
        <Fragment>
          <Paper style={{ marginBottom: 30 }} data-cy="question-area">
            <Subtitle>Compose question</Subtitle>
            <QuestionTextArea
              inputId="stimulusInput"
              placeholder="Enter question"
              onChange={stimulus => _itemChange("stimulus", stimulus)}
              value={item.stimulus}
            />
            <Subtitle data-cy="template">Template</Subtitle>
            <CustomQuillComponent
              inputId="templateInput"
              toolbarId="template"
              onChange={_updateTemplate}
              showResponseBtn
              value={item.template}
              data-cy="templateBox"
            />
            <ClozeMathAnswers id="answers" item={item} setQuestionData={setQuestionData} />
          </Paper>
          <MathFormulaOptions
            onChange={_itemChange}
            uiStyle={item.ui_style}
            item={item}
            responseContainers={item.response_containers}
            textBlocks={item.text_blocks}
            stimulusReview={item.stimulus_review}
            instructorStimulus={item.instructor_stimulus}
            metadata={item.metadata}
          />
        </Fragment>
      )}
      {view === PREVIEW && (
        <Paper style={{ height: "100%", overflow: "visible" }}>
          <ClozeMathPreview
            type={previewTab}
            item={item}
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
  item: PropTypes.object
};

ClozeMath.defaultProps = {
  previewTab: CLEAR,
  userAnswer: [],
  item: {},
  evaluation: []
};

const enhance = compose(
  withTutorial("clozeMath"),
  connect(
    (state, { item }) => ({
      evaluation: state.evaluation[item.id]
    }),
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction
    }
  )
);

export default enhance(ClozeMath);
