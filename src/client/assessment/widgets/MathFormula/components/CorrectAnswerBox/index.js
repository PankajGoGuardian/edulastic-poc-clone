import React from "react";
import PropTypes from "prop-types";
import { MathFormulaDisplay, CorrectAnswersContainer } from "@edulastic/common";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Answer } from "./styled/Answer";

export const formatToMathAnswer = answer =>
  answer.search("input__math") !== -1 ? answer : `<span class="input__math" data-latex="${answer}"></span>`;

const CorrectAnswerBox = ({ answer = "", t, altAnswers, theme, index }) => {
  const displayAnswer = formatToMathAnswer(answer);

  return (
    <CorrectAnswersContainer
      title={!altAnswers ? t("component.math.correctAnswers") : `${t("component.math.alternateAnswers")} ${index}`}
      minHeight="auto"
    >
      <Answer>
        <MathFormulaDisplay color={theme.answerBox.textColor} dangerouslySetInnerHTML={{ __html: displayAnswer }} />
      </Answer>
    </CorrectAnswersContainer>
  );
};

CorrectAnswerBox.propTypes = {
  answer: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  altAnswers: PropTypes.bool.isRequired,
  index: PropTypes.number
};

CorrectAnswerBox.defaultProps = {
  index: 1
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(CorrectAnswerBox);
