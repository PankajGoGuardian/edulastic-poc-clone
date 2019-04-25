import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";

import { MathInput, StaticMath, MathFormulaDisplay } from "@edulastic/common";

import { SHOW, CHECK, CLEAR } from "../../constants/constantsForQuestions";

import CorrectAnswerBox from "./components/CorrectAnswerBox/index";
import MathInputStatus from "./components/MathInputStatus/index";
import MathInputWrapper from "./styled/MathInputWrapper";

import { getStylesFromUiStyleToCssStyle } from "../../utils/helpers";

const MathFormulaPreview = ({
  item,
  studentTemplate,
  type: previewType,
  evaluation,
  saveAnswer,
  userAnswer,
  theme
}) => {
  const studentRef = useRef();
  const isStatic = studentTemplate.search(/\\MathQuillMathField\{(.*)\}/g) !== -1;

  const [latex, setLatex] = useState(studentTemplate);
  const [innerValues, setInnerValues] = useState([]);

  const onUserResponse = latexv => {
    if (isStatic) {
      saveAnswer(studentRef.current.getLatex());
      return;
    }
    setLatex(latexv);
    saveAnswer(latexv);
  };

  const onBlur = () => {
    if (studentRef.current) {
      saveAnswer(studentRef.current.getLatex());
    }
  };

  const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const updateStaticMathFromUserAnswer = clear => {
    if (!userAnswer) {
      setLatex(studentTemplate);
      setInnerValues([]);
      return;
    }

    if (clear) {
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
      updateStaticMathFromUserAnswer(true);
    }
  }, [studentTemplate, previewType, userAnswer]);

  useEffect(() => {
    setTimeout(() => {
      if (!isStatic) {
        setLatex(userAnswer || studentTemplate);
        return;
      }
      updateStaticMathFromUserAnswer(false);
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
      <MathFormulaDisplay
        data-cy="preview-header"
        style={{ marginBottom: 15 }}
        dangerouslySetInnerHTML={{ __html: item.stimulus }}
      />

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
