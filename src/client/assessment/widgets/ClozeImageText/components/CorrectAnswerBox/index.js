import React from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { getStemNumeration } from "../../../../utils/helpers";
import { CorrectAnswerBox } from "./styled/CorrectAnswerBox";
import { CorrectAnswerTitle } from "./styled/CorrectAnswerTitle";
import { AnswerBox } from "./styled/AnswerBox";
import { IndexBox } from "./styled/IndexBox";
import { AnswerContent } from "./styled/AnswerContent";

const CorrectAnswerBoxLayout = ({
  fontSize,
  userAnswers,
  altAnsIndex,
  stemNumeration,
  t,
  width
}) => (
  <CorrectAnswerBox width={width} fontSize={fontSize}>
    <CorrectAnswerTitle>
      {altAnsIndex
        ? `${t("component.cloze.altAnswers")} ${altAnsIndex}`
        : t("component.cloze.correctAnswer")}
    </CorrectAnswerTitle>
    <div>
      {userAnswers.map((answer, index) => (
        <AnswerBox key={`correct-answer-${index}`}>
          <IndexBox>{getStemNumeration(stemNumeration, index)}</IndexBox>
          <AnswerContent>{answer}</AnswerContent>
        </AnswerBox>
      ))}
    </div>
  </CorrectAnswerBox>
);

CorrectAnswerBoxLayout.propTypes = {
  fontSize: PropTypes.string,
  userAnswers: PropTypes.array,
  t: PropTypes.func.isRequired,
  altAnsIndex: PropTypes.number,
  stemNumeration: PropTypes.string,
  width: PropTypes.string
};

CorrectAnswerBoxLayout.defaultProps = {
  fontSize: "13px",
  userAnswers: [],
  altAnsIndex: 0,
  stemNumeration: "numerical",
  width: "100%"
};

export default React.memo(withNamespaces("assessment")(CorrectAnswerBoxLayout));
