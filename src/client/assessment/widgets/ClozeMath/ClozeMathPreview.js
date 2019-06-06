import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import styled from "styled-components";
import { cloneDeep, get } from "lodash";
import { WithResources, Stimulus, helpers } from "@edulastic/common";
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
  options
}) => {
  const [newHtml, setNewHtml] = useState("");

  const _getMathAnswers = () =>
    get(item, "validation.valid_response.value", []).map(res => {
      const method = res[0];
      if (method) {
        return method.value;
      }
      return "";
    });

  const _getDropDownAnswers = () => get(item, "validation.valid_dropdown.value", []).map(res => res || "");

  const _getTextInputAnswers = () => get(item, "validation.valid_inputs.value", []).map(res => res || "");

  const handleAddAnswer = (answer, index, key) => {
    let newAnswers = cloneDeep(userAnswer);
    const answers = newAnswers[key] || [];
    answers[index] = answer;

    newAnswers = {
      ...newAnswers,
      [key]: answers
    };
    saveAnswer(newAnswers);
  };

  useEffect(() => {
    setNewHtml(helpers.parseTemplate(template));
  }, [template]);

  return (
    <WithResources
      resources={[
        "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js",
        "https://cdnedupoc.snapwiz.net/mathquill/mathquill.css",
        "https://cdnedupoc.snapwiz.net/mathquill/mathquill.min.js"
      ]}
      fallBack={<span />}
      onLoaded={() => {
        setNewHtml(helpers.parseTemplate(template));
      }}
    >
      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumber>{`Q${qIndex + 1}`}</QuestionNumber>}
        <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
      </QuestionTitleWrapper>

      <JsxParser
        bindings={{
          options,
          evaluation,
          save: handleAddAnswer,
          answers: userAnswer,
          item,
          checked: type === CHECK || type === SHOW
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
        />
      )}
    </WithResources>
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
