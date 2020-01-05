import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { getStemNumeration } from "../../../../utils/helpers";
import { StyledCorrectAnswerbox } from "./styled/StyledCorrectAnswerbox";
import { CorrectAnswerTitle } from "./styled/CorrectAnswerTitle";
import { MathSpan } from "@edulastic/common";

const CorrectAnswerBoxLayout = ({ fontSize, userAnswers, altResponses, responseIds = [], t, stemNumeration }) => {
  const getLabel = id => {
    if (isEmpty(altResponses)) {
      const correctAnswer = userAnswers.find(answer => (answer ? answer.id : "") === id);
      return correctAnswer ? correctAnswer.value : "";
    }
    const altLabels = [];
    altResponses.forEach(altAnswer => {
      const answer = altAnswer.value.find(alt => (alt ? alt.id : "") === id);
      if (answer && answer.value) {
        altLabels.push(answer.value);
      }
    });
    return altLabels.toString();
  };
  responseIds.sort((a, b) => a.index - b.index);

  return (
    <StyledCorrectAnswerbox fontSize={fontSize}>
      <CorrectAnswerTitle>
        {!isEmpty(altResponses) ? t("component.cloze.altAnswers") : t("component.cloze.correctAnswer")}
      </CorrectAnswerTitle>
      <div>
        {responseIds.map(response => (
          <div key={response.index} className="response-btn check-answer showanswer">
            <span className="index">{getStemNumeration(stemNumeration, response.index)}</span>
            <span className="text">
              <MathSpan dangerouslySetInnerHTML={{ __html: getLabel(response.id) }} />
            </span>
          </div>
        ))}
      </div>
    </StyledCorrectAnswerbox>
  );
};

CorrectAnswerBoxLayout.propTypes = {
  fontSize: PropTypes.string,
  altResponses: PropTypes.array,
  userAnswers: PropTypes.array,
  stemNumeration: PropTypes.string.isRequired,
  responseIds: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired
};

CorrectAnswerBoxLayout.defaultProps = {
  fontSize: "13px",
  altResponses: [],
  userAnswers: []
};

export default React.memo(withNamespaces("assessment")(CorrectAnswerBoxLayout));
