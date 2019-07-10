/* eslint-disable func-names */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import styled from "styled-components";
import { cloneDeep, get } from "lodash";
import { Stimulus, helpers } from "@edulastic/common";
import JsxParser from "react-jsx-parser";
import { SHOW, CHECK, CLEAR } from "../../constants/constantsForQuestions";
import AnswerBox from "./AnswerBox";
import { withCheckAnswerButton } from "../../components/HOC/withCheckAnswerButton";
import ClozeDropDown from "./ClozeMathBlock/ClozeDropDown";
import ClozeInput from "./ClozeMathBlock/ClozeInput";
import ClozeMathInput from "./ClozeMathBlock/ClozeMathInput";
import ClozeDropDownAnswerDisplay from "./ClozeMathDisplay/ClozeDropDownAnswerDisplay";
import ClozeInputAnswerDisplay from "./ClozeMathDisplay/ClozeInputAnswerDisplay";
import ClozeMathAnswerDisplay from "./ClozeMathDisplay/ClozeMathAnswerDisplay";
import MathSpanWrapper from "../../components/MathSpanWrapper";

const getFontSize = size => {
  switch (size) {
    case "small":
      return "11px";
    case "normal":
      return "14px";
    case "large":
      return "17px";
    case "xlarge":
      return "20px";
    case "xxlarge":
      return "24px";
    default:
      return "14px";
  }
};

const ClozeMathPreview = ({
  type,
  item,
  stimulus,
  userAnswer,
  saveAnswer,
  evaluation,
  testItem,
  showQuestionNumber,
  options,
  responseIds,
  changePreviewTab, // Question level
  changePreview // Item level
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

  const onInnerClick = () => {
    if (type === CHECK || type === SHOW) {
      changePreviewTab(CLEAR);
      changePreview(CLEAR);
    }
  };

  const getStyles = () => {
    const uiStyles = {};
    const { ui_style = {} } = item;
    if (ui_style.fontsize) {
      uiStyles.fontSize = getFontSize(ui_style.fontsize);
    }

    if (ui_style.min_width) {
      uiStyles.width = `${ui_style.min_width}px`;
      if (parseInt(ui_style.min_width, 10) < 25) {
        uiStyles.padding = "4px 2px";
      }
    } else {
      uiStyles.width = 80;
    }

    return uiStyles;
  };

  useEffect(() => {
    if (window.$) {
      setNewHtml(helpers.parseTemplate(stimulus));
    }
  }, [stimulus]);

  const uiStyles = getStyles();
  const testUserAnswer = {};
  if (testItem) {
    const keynameMap = {
      valid_inputs: "inputs",
      valid_dropdown: "dropDowns",
      valid_response: "maths"
    };

    ["valid_inputs", "valid_dropdown", "valid_response"].forEach(propName => {
      testUserAnswer[keynameMap[propName]] = {};
      item.validation[propName].value.forEach(answerItem => {
        if (propName === "valid_response") {
          testUserAnswer[keynameMap[propName]][answerItem[0].id] = {
            value: answerItem[0].value
          };
        } else {
          testUserAnswer[keynameMap[propName]][answerItem.id] = {
            value: answerItem.value
          };
        }
      });
    });
  }

  return (
    <QuestionWrapper>
      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
        <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
      </QuestionTitleWrapper>

      {testItem && (
        <JsxParser
          bindings={{
            resProps: {
              options,
              evaluation,
              save: handleAddAnswer,
              answers: testUserAnswer,
              item,
              uiStyles,
              response_containers: item.response_containers
            }
          }}
          showWarnings
          components={{
            mathspan: MathSpanWrapper,
            textdropdown: ClozeDropDownAnswerDisplay,
            textinput: ClozeInputAnswerDisplay,
            mathinput: ClozeMathAnswerDisplay
          }}
          jsx={newHtml}
        />
      )}

      {!testItem && (
        <JsxParser
          bindings={{
            resProps: {
              options,
              evaluation,
              save: handleAddAnswer,
              answers: userAnswer,
              item,
              checked: type === CHECK || type === SHOW,
              onInnerClick,
              uiStyles,
              response_containers: item.response_containers
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
      )}

      {!testItem && type === SHOW && (
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
    </QuestionWrapper>
  );
};

ClozeMathPreview.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  stimulus: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  userAnswer: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  evaluation: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  options: PropTypes.object.isRequired,
  responseIds: PropTypes.object.isRequired,
  changePreview: PropTypes.func,
  showQuestionNumber: PropTypes.bool,
  testItem: PropTypes.bool
};

ClozeMathPreview.defaultProps = {
  changePreview: () => {},
  showQuestionNumber: false,
  testItem: false
};

export default withCheckAnswerButton(ClozeMathPreview);

const QuestionWrapper = styled.div`
  li {
    margin: 4px 0;
  }
`;

const QuestionTitleWrapper = styled.div`
  display: flex;
`;

const QuestionNumber = styled.div`
  font-weight: 700;
  margin-right: 4px;
`;
