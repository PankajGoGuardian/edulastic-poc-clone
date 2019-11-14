import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { WithResources } from "@edulastic/common";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";

import { Wrapper } from "./styled/Wrapper";
import { Answer } from "./styled/Answer";
import AppConfig from "../../../../../../../app-config";

const CorrectAnswerBox = ({ children, t, altAnswers }) => {
  const answerRef = useRef();

  useEffect(() => {
    if (window.MathQuill) {
      const MQ = window.MathQuill.getInterface(2);
      MQ.StaticMath(answerRef.current).latex(children);
    }
  }, []);

  return (
    <Wrapper>
      <h2 style={{ fontSize: 20 }}>
        {!altAnswers ? t("component.math.correctAnswers") : t("component.math.alternateAnswers")}
      </h2>
      <Answer>
        <div ref={answerRef} data-cy="correct-answer-box" />
      </Answer>
    </Wrapper>
  );
};

CorrectAnswerBox.propTypes = {
  children: PropTypes.any.isRequired,
  t: PropTypes.func.isRequired,
  altAnswers: PropTypes.bool.isRequired
};

const enhance = compose(withNamespaces("assessment"));

const CorrectAnswerBoxComponent = enhance(CorrectAnswerBox);

const CorrectAnswerBoxWithResources = ({ ...props }) => (
  <WithResources
    resources={[
      `${AppConfig.jqueryPath}/jquery.min.js`,
      `${AppConfig.mathquillPath}/mathquill.css`,
      `${AppConfig.mathquillPath}/mathquill.min.js`
    ]}
    fallBack={<span />}
  >
    <CorrectAnswerBoxComponent {...props} />
  </WithResources>
);

export default CorrectAnswerBoxWithResources;
