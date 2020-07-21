import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { MathSpan, CorrectAnswersContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { getStemNumeration } from "../../../../utils/helpers";
import { AnswersWrapper } from "./styled/AnswerWrapper";

const CorrectAnswerBoxLayout = ({ fontSize, userAnswers, altResponses, responseIds = [], t, stemNumeration }) => {
  const getLabel = id => {
    if (isEmpty(altResponses)) {
      return userAnswers[id];
    }
    const altLabels = [];
    altResponses.forEach(altAnswer => {
      altLabels.push(altAnswer.value[id] || "");
    });
    return altLabels.toString();
  };
  responseIds.sort((a, b) => a.index - b.index);

  return (
    <CorrectAnswersContainer
      fontSize={fontSize}
      padding="15px 25px 20px"
      titleMargin="0px 0px 12px"
      minHeight="auto"
      title={!isEmpty(altResponses) ? t("component.cloze.altAnswers") : t("component.cloze.correctAnswer")}
    >
      <AnswersWrapper>
        {responseIds.map(response => (
          <div key={response.index} className="correct-answer-item">
            <div className="index">{getStemNumeration(stemNumeration, response.index)}</div>
            <div className="text">
              <MathSpan dangerouslySetInnerHTML={{ __html: getLabel(response.id) }} />
            </div>
          </div>
        ))}
      </AnswersWrapper>
    </CorrectAnswersContainer>
  );
};

CorrectAnswerBoxLayout.propTypes = {
  fontSize: PropTypes.string,
  altResponses: PropTypes.array,
  userAnswers: PropTypes.object,
  stemNumeration: PropTypes.string.isRequired,
  responseIds: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired
};

CorrectAnswerBoxLayout.defaultProps = {
  fontSize: "13px",
  altResponses: [],
  userAnswers: {}
};

export default React.memo(withNamespaces("assessment")(CorrectAnswerBoxLayout));
