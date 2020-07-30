import React from "react";
import PropTypes from "prop-types";

import { MathSpan, CorrectAnswersContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { convertToMathTemplate } from "@edulastic/common/src/utils/mathUtils";

import { getStemNumeration } from "../../../../utils/helpers";
import { CorrectAnswerBox } from "./styled/CorrectAnswerBox";
import { AnswerBox } from "./styled/AnswerBox";
import { IndexBox } from "./styled/IndexBox";
import { AnswerContent } from "./styled/AnswerContent";

const CorrectAnswerBoxLayout = ({ fontSize, userAnswers, altAnsIndex, stemNumeration, t }) => (
  <CorrectAnswersContainer
    title={altAnsIndex ? `${t("component.cloze.altAnswers")} ${altAnsIndex}` : t("component.cloze.correctAnswer")}
    fontSize={fontSize}
    minHeight="auto"
  >
    <CorrectAnswerBox>
      {userAnswers.map(userAnswer => (
        <AnswerBox key={`correct-answer-${userAnswer.id}`}>
          <IndexBox>{getStemNumeration(stemNumeration, userAnswer.index)}</IndexBox>
          <AnswerContent>
            <MathSpan dangerouslySetInnerHTML={{ __html: convertToMathTemplate(userAnswer.value) || "" }} />
          </AnswerContent>
        </AnswerBox>
      ))}
    </CorrectAnswerBox>
  </CorrectAnswersContainer>
);

CorrectAnswerBoxLayout.propTypes = {
  fontSize: PropTypes.string,
  userAnswers: PropTypes.object,
  t: PropTypes.func.isRequired,
  altAnsIndex: PropTypes.number,
  stemNumeration: PropTypes.string
};

CorrectAnswerBoxLayout.defaultProps = {
  fontSize: "13px",
  userAnswers: [],
  altAnsIndex: 0,
  stemNumeration: "numerical"
};

export default React.memo(withNamespaces("assessment")(CorrectAnswerBoxLayout));
