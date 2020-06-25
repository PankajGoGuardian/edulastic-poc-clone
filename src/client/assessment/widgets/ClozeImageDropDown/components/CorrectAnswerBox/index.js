import React from "react";
import PropTypes from "prop-types";
import { keys } from "lodash";

import { MathSpan } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { getStemNumeration } from "../../../../utils/helpers";
import { CorrectAnswerBox } from "./styled/CorrectAnswerBox";
import { CorrectAnswerTitle } from "./styled/CorrectAnswerTitle";
import { AnswerBox } from "./styled/AnswerBox";
import { IndexBox } from "./styled/IndexBox";
import { AnswerContent } from "./styled/AnswerContent";

const CorrectAnswerBoxLayout = ({ fontSize, userAnswers, altAnsIndex, stemNumeration, t }) => (
  <CorrectAnswerBox fontSize={fontSize}>
    <CorrectAnswerTitle>
      {altAnsIndex ? `${t("component.cloze.altAnswers")} ${altAnsIndex}` : t("component.cloze.correctAnswer")}
    </CorrectAnswerTitle>
    <div>
      {keys(userAnswers).map((id, index) => (
        <AnswerBox key={`correct-answer-${index}`}>
          <IndexBox>{getStemNumeration(stemNumeration, index)}</IndexBox>
          <AnswerContent>
            <MathSpan dangerouslySetInnerHTML={{ __html: userAnswers[id] || "" }} />
          </AnswerContent>
        </AnswerBox>
      ))}
    </div>
  </CorrectAnswerBox>
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
