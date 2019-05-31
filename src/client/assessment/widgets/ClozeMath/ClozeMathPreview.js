import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import styled from "styled-components";
import { cloneDeep } from "lodash";
import { WithResources, Stimulus } from "@edulastic/common";
import JsxParser from "react-jsx-parser";
import { SHOW, CHECK } from "../../constants/constantsForQuestions"; //
import AnswerBox from "./AnswerBox";
import { withCheckAnswerButton } from "../../components/HOC/withCheckAnswerButton";
import ClozeDropDown from "./ClozeMathBlock/ClozeDropDown";
import ClozeInput from "./ClozeMathBlock/ClozeInput";
import ClozeMathInput from "./ClozeMathBlock/ClozeMathInput";

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
    item.validation.valid_response.value.map(res => {
      const method = res[0];
      if (method) {
        return method.value;
      }
      return "";
    });

  const _getDropDownAnswers = () => item.validation.valid_dropdown.value.map(res => res || "");

  const _getTextInputAnswers = () => item.validation.valid_inputs.value.map(res => res || "");

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

  const getPreviewTemplate = tmpl => {
    let temp = ` ${tmpl}`.slice(1);
    temp = temp.replace(/<hr>/g, "<hr/>");
    temp = temp.replace(/<br>/g, "<br/>");
    temp = temp.replace(/"{{/g, "{");
    temp = temp.replace(/}}"/g, "}");

    return temp;
  };

  useEffect(() => {
    setNewHtml(getPreviewTemplate(template));
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
        setNewHtml(getPreviewTemplate(template));
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
