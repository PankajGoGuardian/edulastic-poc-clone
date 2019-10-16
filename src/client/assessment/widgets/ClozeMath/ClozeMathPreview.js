/* eslint-disable func-names */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import styled from "styled-components";
import { cloneDeep, get } from "lodash";
import { helpers } from "@edulastic/common";
import JsxParser from "react-jsx-parser";
import { SHOW, CHECK, CLEAR } from "../../constants/constantsForQuestions";
import AnswerBox from "./AnswerBox";
import { withCheckAnswerButton } from "../../components/HOC/withCheckAnswerButton";
import ClozeDropDown from "./ClozeMathBlock/ClozeDropDown";
import ClozeInput from "./ClozeMathBlock/ClozeInput";
import ClozeMathInput from "./ClozeMathBlock/ClozeMathInput";
import ClozeMathWithUnit from "./ClozeMathBlock/ClozeMathWithUnit";
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
  options,
  responseIds,
  isExpressGrader,
  changePreviewTab, // Question level
  changePreview // Item level
}) => {
  const [newHtml, setNewHtml] = useState("");

  const _getMathAnswers = () => get(item, "validation.validResponse.value", []);

  const _getAltMathAnswers = () =>
    get(item, "validation.altResponses", []).map(alt => get(alt, "value", []).map(res => res));

  const _getDropDownAnswers = () => get(item, "validation.validResponse.dropdown.value", []);
  const _getAltDropDownAnswers = () =>
    get(item, "validation.altResponses", []).map(alt => get(alt, "dropdown.value", []));

  const _getTextInputAnswers = () => get(item, "validation.validResponse.textinput.value", []);
  const _getAltInputsAnswers = () =>
    get(item, "validation.altResponses", []).map(alt => get(alt, "textinput.value", []));

  const _getMathUintAnswers = () => get(item, "validation.validResponse.mathUnits.value", []);
  const _getAltMathUintAnswers = () =>
    get(item, "validation.altResponses", []).map(alt => get(alt, "mathUnits.value", []));

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
      if (changePreview) {
        changePreview(CLEAR);
      }
    }
  };

  const getStyles = () => {
    const uiStyles = {};
    const { uiStyle = {} } = item;

    uiStyles.fontSize = getFontSize(uiStyle.fontsize);

    if (uiStyle.heightpx) {
      uiStyles.height = `${uiStyle.heightpx}px`;
    }

    if (uiStyle.responseFontScale) {
      uiStyles.responseFontScale = uiStyle.responseFontScale;
    }

    if (uiStyle.minWidth) {
      uiStyles.minWidth = `${uiStyle.minWidth}px`;
    }

    if (parseInt(uiStyle.minWidth, 10) < 25) {
      uiStyles.padding = "4px 2px";
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
      textinput: "inputs",
      dropdown: "dropDowns",
      value: "maths",
      mathUnits: "mathUnits"
    };

    if (item.validation.validResponse) {
      Object.keys(item.validation.validResponse).forEach(keyName => {
        if (keynameMap[keyName]) {
          testUserAnswer[keynameMap[keyName]] = {};
          if (keyName !== "value") {
            item.validation.validResponse[keyName].value.forEach(answerItem => {
              testUserAnswer[keynameMap[keyName]][answerItem.id] = { ...answerItem };
            });
          } else {
            item.validation.validResponse.value.forEach(answerItem => {
              testUserAnswer[keynameMap[keyName]][answerItem[0].id] = { ...answerItem[0] };
            });
          }
        }
      });
    }
  }

  return (
    <QuestionWrapper uiStyles={uiStyles}>
      <JsxParser
        bindings={{
          resProps: {
            options,
            evaluation,
            save: handleAddAnswer,
            answers: testItem ? testUserAnswer : userAnswer,
            item,
            checked: type === CHECK || type === SHOW,
            showIndex: type === SHOW,
            onInnerClick,
            uiStyles,
            responseContainers: item.responseContainers
          }
        }}
        showWarnings
        components={{
          mathspan: MathSpanWrapper,
          textdropdown: testItem ? ClozeDropDownAnswerDisplay : ClozeDropDown,
          textinput: testItem ? ClozeInputAnswerDisplay : ClozeInput,
          mathinput: testItem ? ClozeMathAnswerDisplay : ClozeMathInput,
          mathunit: testItem ? ClozeMathAnswerDisplay : ClozeMathWithUnit
        }}
        jsx={newHtml}
      />

      {(isExpressGrader || type === SHOW) && (
        <AnswerBox
          mathAnswers={_getMathAnswers()}
          dropdownAnswers={_getDropDownAnswers()}
          textInputAnswers={_getTextInputAnswers()}
          mathUnitAnswers={_getMathUintAnswers()}
          responseIds={responseIds}
          altMathAnswers={_getAltMathAnswers()}
          altDropDowns={_getAltDropDownAnswers()}
          altInputs={_getAltInputsAnswers()}
          altMathUnitAnswers={_getAltMathUintAnswers()}
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
  testItem: PropTypes.bool,
  isExpressGrader: PropTypes.bool
};

ClozeMathPreview.defaultProps = {
  changePreview: () => {},
  testItem: false,
  isExpressGrader: false
};

export default withCheckAnswerButton(ClozeMathPreview);

const QuestionWrapper = styled.div`
  font-size: ${props => props.uiStyles.fontSize || "16px"};
  font-weight: ${props => (props.responseFontScale === "boosted" ? 600 : "normal")};
  position: relative;
  p {
    display: flex;
    align-items: flex-start;
    flex-flow: row wrap;

    > div {
      margin: -6px 2px 10px 2px !important;
    }

    > input {
      margin: -8px 2px 10px 2px;
    }
  }
  li {
    margin: 4px 0;
  }
`;
