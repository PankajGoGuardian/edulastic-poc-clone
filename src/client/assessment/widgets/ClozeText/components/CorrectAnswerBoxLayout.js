import React from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { CorrectAnswersContainer } from "@edulastic/common";
import { getStemNumeration } from "../../../utils/helpers";
import { Answer } from "./CorrectAnswer";

const CorrectAnswerBoxLayout = ({ userAnswers, altIndex, stemNumeration, t }) => (
  <CorrectAnswersContainer
    minHeight="auto"
    title={altIndex ? `${t("component.cloze.altAnswers")} ${altIndex}` : t("component.cloze.correctAnswer")}
    padding="15px 25px 20px"
    titleMargin="0px 0px 12px"
  >
    {userAnswers
      .sort((a, b) => a.index - b.index)
      .map(answer => (
        <Answer answer={answer} getStemNumeration={getStemNumeration} stemNumeration={stemNumeration} />
      ))}
  </CorrectAnswersContainer>
);

CorrectAnswerBoxLayout.propTypes = {
  userAnswers: PropTypes.array,
  altIndex: PropTypes.array,
  stemNumeration: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

CorrectAnswerBoxLayout.defaultProps = {
  userAnswers: [],
  altIndex: 0
};

export default React.memo(withNamespaces("assessment")(CorrectAnswerBoxLayout));
