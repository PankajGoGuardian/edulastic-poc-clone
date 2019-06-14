/* eslint-disable func-names */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import styled from "styled-components";
import { cloneDeep, get } from "lodash";
import { Stimulus, helpers } from "@edulastic/common";
import JsxParser from "react-jsx-parser";
import { SHOW, CHECK } from "../../constants/constantsForQuestions"; //
import AnswerBox from "./AnswerBox";
import { withCheckAnswerButton } from "../../components/HOC/withCheckAnswerButton";
import ClozeDropDown from "./ClozeMathBlock/ClozeDropDown";
import ClozeInput from "./ClozeMathBlock/ClozeInput";
import ClozeMathInput from "./ClozeMathBlock/ClozeMathInput";
import MathSpanWrapper from "../../components/MathSpanWrapper";

const ClozeMathPreview = ({
  type,
  item,
  template,
  userAnswer,
  saveAnswer,
  evaluation,
  showQuestionNumber,
  qIndex,
  options,
  responseIds
}) => {
  const [newHtml, setNewHtml] = useState("");

  const _getMathAnswers = () => get(item, "validation.valid_response.value", []);

  const _getAltMathAnswers = () =>
    get(item, "validation.alt_responses", []).map(alt => get(alt, "value", []).map(res => res));

  const _getDropDownAnswers = () => get(item, "validation.valid_dropdown.value", []);
  const _getAltDropDownAnswers = () => get(item, "validation.alt_dropdowns", []).map(alt => get(alt, "value", []));

  const _getTextInputAnswers = () => get(item, "validation.valid_inputs.value", []);
  const _getAltInputsAnswers = () => get(item, "validation.alt_inputs", []).map(alt => get(alt, "value", []));

  const handleAddAnswer = (answer, answerType, id) => {
    let newAnswers = cloneDeep(userAnswer);
    const answers = newAnswers[answerType] || {};
    answers[id] = answer;

    newAnswers = {
      ...newAnswers,
      [answerType]: answers
    };
    saveAnswer(newAnswers);
  };

  useEffect(() => {
    if (window.$) {
      setNewHtml(helpers.parseTemplate(template));
    }
  }, [template]);

  return (
    <div>
      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
        <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
      </QuestionTitleWrapper>

      <JsxParser
        bindings={{
          resProps: {
            options,
            evaluation,
            save: handleAddAnswer,
            answers: userAnswer,
            item,
            checked: type === CHECK || type === SHOW
          }
        }}
        showWarnings
        components={{
          mathspan: MathSpanWrapper,
          textdropdown: ClozeDropDown,
          textinput: ClozeInput,
          mathinput: ClozeMathInput
        }}
        jsx={newHtml}
      />

      {type === SHOW && (
        <AnswerBox
          mathAnswers={_getMathAnswers()}
          dropdownAnswers={_getDropDownAnswers()}
          textInputAnswers={_getTextInputAnswers()}
          responseIds={responseIds}
          altMathAnswers={_getAltMathAnswers()}
          altDropDowns={_getAltDropDownAnswers()}
          altInputs={_getAltInputsAnswers()}
        />
      )}
    </div>
  );
};

ClozeMathPreview.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  template: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  evaluation: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  options: PropTypes.object.isRequired,
  responseIds: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number
};

ClozeMathPreview.defaultProps = {
  showQuestionNumber: false,
  qIndex: null
};

export default withCheckAnswerButton(ClozeMathPreview);

const QuestionTitleWrapper = styled.div`
  display: flex;
`;

const QuestionNumber = styled.div`
  font-weight: 700;
  margin-right: 4px;
`;
