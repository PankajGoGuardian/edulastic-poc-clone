import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { WithResources } from "@edulastic/common";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";

import { Wrapper } from "./styled/Wrapper";
import { Answer } from "./styled/Answer";

const CorrectAnswerBox = ({ children, t }) => {
  const answerRef = useRef();

  useEffect(() => {
    window.MathQuill.StaticMath(answerRef.current).latex(children);
  }, []);

  return (
    <Wrapper>
      <div>{t("component.math.correctAnswers")}:</div>
      <Answer>
        <div ref={answerRef} data-cy="correct-answer-box" />
      </Answer>
    </Wrapper>
  );
};

CorrectAnswerBox.propTypes = {
  children: PropTypes.any.isRequired,
  t: PropTypes.func.isRequired
};

const enhance = compose(withNamespaces("assessment"));

const CorrectAnswerBoxComponent = enhance(CorrectAnswerBox);

const CorrectAnswerBoxWithResources = ({ ...props }) => (
  <WithResources
    resources={[
      "https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.css",
      "https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.js",
      "https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.js",
      "https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/contrib/auto-render.min.js",
      "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js",
      "https://cdnedupoc.snapwiz.net/mathquill/mathquill.css",
      "https://cdnedupoc.snapwiz.net/mathquill/mathquill.min.js"
    ]}
    fallBack={<span />}
  >
    <CorrectAnswerBoxComponent {...props} />
  </WithResources>
);

export default CorrectAnswerBoxWithResources;
