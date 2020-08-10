import React from "react";
import PropTypes from "prop-types";

import { MathSpan, CorrectAnswersContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { getStemNumeration } from "../../../../utils/helpers";
import { AnswerBox } from "./styled/AnswerBox";
import { IndexBox } from "./styled/IndexBox";
import { AnswerContent } from "./styled/AnswerContent";
import { Answers } from "./styled/Answers";

const CorrectAnswerBoxLayout = ({ fontSize, userAnswers, answersIndex, stemNumeration, t, idValueMap }) => (
  <CorrectAnswersContainer
    fontSize={fontSize}
    minHeight="auto"
    title={answersIndex ? `${t("component.cloze.altAnswers")} ${answersIndex}` : t("component.cloze.correctAnswer")}
  >
    <Answers>
      {userAnswers.map(answer => {
        if (answer) {
          const values = answer.optionIds?.map(id => idValueMap[id]) || [];
          return (
            <AnswerBox key={answer.responseBoxID} data-cy="answerBox">
              <IndexBox>{getStemNumeration(stemNumeration, answer.containerIndex)}</IndexBox>
              <AnswerContent>
                <MathSpan dangerouslySetInnerHTML={{ __html: values.join(", ") }} />
              </AnswerContent>
            </AnswerBox>
          );
        }
        return null;
      })}
    </Answers>
  </CorrectAnswersContainer>
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
