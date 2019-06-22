import React from "react";
import styled from "styled-components";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";

const CorrectAnswerBoxLayout = ({ fontSize, userAnswers, altAnswers, responseIds, t }) => {
  const getLabel = id => {
    if (isEmpty(altAnswers)) {
      const correctAnswer = userAnswers.find(answer => (answer ? answer.id : "") === id);
      return correctAnswer ? correctAnswer.value : "";
    }
    const altLabels = [];
    altAnswers.forEach(altAnswer => {
      const answer = altAnswer.value.find(alt => (alt ? alt.id : "") === id);
      if (answer && answer.value) {
        altLabels.push(answer.value);
      }
    });
    return altLabels.toString();
  };
  responseIds.sort((a, b) => a.index - b.index);

  return (
    <div className="correctanswer-box" style={{ padding: 16, fontSize }}>
      <CorrectAnswerTitle>
        {!isEmpty(altAnswers) ? t("component.cloze.altAnswers") : t("component.cloze.correctAnswer")}
      </CorrectAnswerTitle>
      <div>
        {responseIds.map(response => (
          <div key={response.index} className="response-btn check-answer showanswer">
            <span className="index">{response.index + 1}</span>
            <span className="text">{getLabel(response.id)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

CorrectAnswerBoxLayout.propTypes = {
  fontSize: PropTypes.string,
  userAnswers: PropTypes.array,
  altAnswers: PropTypes.array,
  responseIds: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired
};

CorrectAnswerBoxLayout.defaultProps = {
  fontSize: "13px",
  userAnswers: [],
  altAnswers: []
};

export default React.memo(withNamespaces("assessment")(CorrectAnswerBoxLayout));

const CorrectAnswerTitle = styled.h2`
  font-size: ${props => props.theme.correctAnswerBoxLayout.titleFontSize};
`;
