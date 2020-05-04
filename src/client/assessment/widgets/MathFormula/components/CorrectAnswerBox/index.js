import React from "react";
import PropTypes from "prop-types";
import { MathFormulaDisplay } from "@edulastic/common";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";

import { Wrapper } from "./styled/Wrapper";
import { Answer } from "./styled/Answer";

export const formatToMathAnswer = answer =>
  answer.search("input__math") !== -1 ? answer : `<span class="input__math" data-latex="${answer}"></span>`;

const CorrectAnswerBox = ({ answer = "", t, altAnswers }) => {
  const displayAnswer = formatToMathAnswer(answer);

  return (
    <Wrapper>
      <h2 style={{ fontSize: 20 }}>
        {!altAnswers ? t("component.math.correctAnswers") : t("component.math.alternateAnswers")}
      </h2>
      <Answer>
        <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: displayAnswer }} />
      </Answer>
    </Wrapper>
  );
};

CorrectAnswerBox.propTypes = {
  answer: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  altAnswers: PropTypes.bool.isRequired
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(CorrectAnswerBox);
