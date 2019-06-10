import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";

import { MathInput, StaticMath, MathFormulaDisplay } from "@edulastic/common";

import { SHOW, CHECK, CLEAR } from "../../constants/constantsForQuestions";

import CorrectAnswerBox from "./components/CorrectAnswerBox/index";
import MathInputStatus from "./components/MathInputStatus/index";
import MathInputWrapper from "./styled/MathInputWrapper";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QustionNumber";

import { getStylesFromUiStyleToCssStyle } from "../../utils/helpers";

const MathFormulaPreview = ({
  item,
  studentTemplate,
  type: previewType,
  evaluation,
  saveAnswer,
  userAnswer,
  theme,
  showQuestionNumber,
  qIndex
}) => {
  const studentRef = useRef();
  const isStatic = studentTemplate.search(/\\MathQuillMathField\{(.*)\}/g) !== -1;

  const [latex, setLatex] = useState(studentTemplate);
  const [innerValues, setInnerValues] = useState([]);

  const hasAltAnswers = item.validation.alt_responses && item.validation.alt_responses.length > 0;

  const onUserResponse = latexv => {
    if (isStatic) {
      saveAnswer(latexv);
      return;
    }
    setLatex(latexv);
    saveAnswer(latexv);
  };

  const onBlur = latexv => {
    if (isStatic) {
      saveAnswer(latexv);
    }
  };

  const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const updateStaticMathFromUserAnswer = () => {
    if (!userAnswer) {
      setLatex(studentTemplate);
      setInnerValues([]);
      return;
    }

    if (!isStatic) return;

    const regexTemplate = new RegExp(
      escapeRegExp(studentTemplate).replace(/\\\\MathQuillMathField\\\{\\\}/g, "(.*)"),
      "g"
    );
    if (userAnswer && userAnswer.length > 0) {
      const userInnerValues = regexTemplate.exec(userAnswer);
      if (userInnerValues && userInnerValues.length > 0) {
        setInnerValues(userInnerValues.slice(1));
      }
    } else {
      setInnerValues([]);
    }
  };

  useEffect(() => {
    if (previewType === CLEAR) {
      if (!isStatic) {
        setLatex(userAnswer || studentTemplate);
        return;
      }
      updateStaticMathFromUserAnswer();
    }
  }, [studentTemplate, previewType, userAnswer]);

  useEffect(() => {
    setTimeout(() => {
      if (!isStatic) {
        setLatex(userAnswer || studentTemplate);
        return;
      }
      updateStaticMathFromUserAnswer();
    }, 0);
  }, [studentTemplate, userAnswer]);

  let statusColor = theme.widgets.mathFormula.inputColor;
  if (previewType === SHOW || previewType === CHECK) {
    statusColor = evaluation
      ? evaluation.some(ie => ie)
        ? theme.widgets.mathFormula.inputCorrectColor
        : theme.widgets.mathFormula.inputIncorrectColor
      : theme.widgets.mathFormula.inputIncorrectColor;
  }

  const cssStyles = getStylesFromUiStyleToCssStyle(item.ui_style);

  return (
    <div>
      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumber>{`Q${qIndex + 1}`}</QuestionNumber>}
        <MathFormulaDisplay
          data-cy="preview-header"
          style={{ marginBottom: 15 }}
          dangerouslySetInnerHTML={{ __html: item.stimulus }}
        />
      </QuestionTitleWrapper>

      <MathInputWrapper>
        {isStatic && (
          <StaticMath
            symbols={item.symbols}
            numberPad={item.numberPad}
            ref={studentRef}
            onInput={onUserResponse}
            onBlur={onBlur}
            style={{ background: statusColor, ...cssStyles }}
            latex={studentTemplate}
            innerValues={innerValues}
          />
        )}
        {!isStatic && (
          <MathInput
            symbols={item.symbols}
            numberPad={item.numberPad}
            value={latex}
            onInput={onUserResponse}
            onBlur={onBlur}
            disabled={evaluation && !evaluation.some(ie => ie)}
            style={{ background: statusColor, ...cssStyles }}
          />
        )}
        {(previewType === SHOW || previewType === CHECK) && (
          <MathInputStatus valid={!!evaluation && !!evaluation.some(ie => ie)} />
        )}
      </MathInputWrapper>

      {previewType === SHOW && item.validation.valid_response.value[0].value !== undefined && (
        <CorrectAnswerBox>{item.validation.valid_response.value[0].value}</CorrectAnswerBox>
      )}
      {hasAltAnswers && previewType === SHOW && (
        <CorrectAnswerBox altAnswers>
          {item.validation.alt_responses.map(ans => ans.value[0].value).join(", ")}
        </CorrectAnswerBox>
      )}
    </div>
  );
};
MathFormulaPreview.propTypes = {
  item: PropTypes.object.isRequired,
  studentTemplate: PropTypes.string,
  type: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  evaluation: PropTypes.object.isRequired,
  userAnswer: PropTypes.any,
  theme: PropTypes.object.isRequired
};
MathFormulaPreview.defaultProps = {
  studentTemplate: "",
  userAnswer: null
};

export default withTheme(MathFormulaPreview);
