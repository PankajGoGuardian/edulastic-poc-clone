import React from "react";
import PropTypes from "prop-types";

import { MathSpan } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { getStemNumeration } from "../../../../utils/helpers";
import { CorrectAnswerBox } from "./styled/CorrectAnswerBox";
import { CorrectAnswerTitle } from "./styled/CorrectAnswerTitle";
import { AnswerBox } from "./styled/AnswerBox";
import { IndexBox } from "./styled/IndexBox";
import { AnswerContent } from "./styled/AnswerContent";
import { Answers } from "./styled/Answers";

const CorrectAnswerBoxLayout = ({ fontSize, userAnswers, answersIndex, stemNumeration, t }) => (
  <CorrectAnswerBox fontSize={fontSize}>
    <CorrectAnswerTitle>
      {answersIndex ? `${t("component.cloze.altAnswers")} ${answersIndex}` : t("component.cloze.correctAnswer")}
    </CorrectAnswerTitle>
    <Answers>
      {userAnswers.map(
        answer =>
          answer && (
            <AnswerBox key={answer.responseBoxID}>
              <IndexBox>{getStemNumeration(stemNumeration, answer.containerIndex)}</IndexBox>
              <AnswerContent>
                <MathSpan dangerouslySetInnerHTML={{ __html: answer.value.join(", ") }} />
              </AnswerContent>
            </AnswerBox>
          )
      )}
    </Answers>
  </CorrectAnswerBox>
);

CorrectAnswerBoxLayout.propTypes = {
  fontSize: PropTypes.string,
  userAnswers: PropTypes.array,
  t: PropTypes.func.isRequired,
  answersIndex: PropTypes.number,
  stemNumeration: PropTypes.string
};

CorrectAnswerBoxLayout.defaultProps = {
  fontSize: "13px",
  userAnswers: [],
  answersIndex: 0,
  stemNumeration: "numerical"
};

export default React.memo(withNamespaces("assessment")(CorrectAnswerBoxLayout));
