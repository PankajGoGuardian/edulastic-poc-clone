import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";

import { getStemNumeration } from "../../../utils/helpers";
import { Answer } from "./CorrectAnswer";

const CorrectAnswerBoxLayout = ({ fontSize, userAnswers, altIndex, stemNumeration, t }) => (
  <div
    className="correctanswer-box"
    style={{
      padding: 16,
      fontSize,
      width: "100%"
    }}
  >
    <CorrectAnswerTitle>
      {altIndex ? `${t("component.cloze.altAnswers")} ${altIndex}` : t("component.cloze.correctAnswer")}
    </CorrectAnswerTitle>
    <Answers>
      {userAnswers
        .sort((a, b) => a.index - b.index)
        .map(answer => (
          <Answer answer={answer} getStemNumeration={getStemNumeration} stemNumeration={stemNumeration} />
        ))}
    </Answers>
  </div>
);

CorrectAnswerBoxLayout.propTypes = {
  fontSize: PropTypes.string,
  userAnswers: PropTypes.array,
  altIndex: PropTypes.array,
  stemNumeration: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

CorrectAnswerBoxLayout.defaultProps = {
  fontSize: "13px",
  userAnswers: [],
  altIndex: 0
};

export default React.memo(withNamespaces("assessment")(CorrectAnswerBoxLayout));

const CorrectAnswerTitle = styled.h2`
  font-size: ${({ theme }) => theme.correctAnswerBoxLayout.titleFontSize};
`;

const Answers = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
