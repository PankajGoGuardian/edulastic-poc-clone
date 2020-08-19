import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import styled from "styled-components";
import { withNamespaces } from "@edulastic/localization";
import { white } from "@edulastic/colors";
import { CorrectAnswersContainer } from "@edulastic/common";
import { convertToMathTemplate } from "@edulastic/common/src/utils/mathUtils";

import { getStemNumeration } from "../../../../utils/helpers";
import Response from "./Response";

const CorrectAnswerBoxLayout = ({ userAnswers, altResponses, responseIds = [], t, stemNumeration }) => {
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
    <CorrectAnswersContainer
      minHeight="auto"
      padding="15px 25px 20px"
      titleMargin="0px 0px 12px"
      title={!isEmpty(altResponses) ? t("component.cloze.altAnswers") : t("component.cloze.correctAnswer")}
    >
      {responseIds.map(response => (
        <Answer data-cy="correctAnswer">
          <Label>{getStemNumeration(stemNumeration, response.index)}</Label>
          <Text>
            <Response key={response.id} id={response.id} answer={convertToMathTemplate(getLabel(response.id))} />
          </Text>
        </Answer>
      ))}
    </CorrectAnswersContainer>
  );
};

CorrectAnswerBoxLayout.propTypes = {
  altResponses: PropTypes.array,
  userAnswers: PropTypes.array,
  stemNumeration: PropTypes.string.isRequired,
  responseIds: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired
};

CorrectAnswerBoxLayout.defaultProps = {
  altResponses: [],
  userAnswers: []
};

export default React.memo(withNamespaces("assessment")(CorrectAnswerBoxLayout));

const Answer = styled.div`
  display: inline-flex;
  margin-right: 15px;
  min-height: 32px;
  margin-bottom: 10px;
  border: ${({
    theme: {
      answerBox: { borderWidth, borderStyle, borderColor }
    }
  }) => `${borderWidth} ${borderStyle} ${borderColor}`};
  border-radius: ${({
    theme: {
      answerBox: { borderRadius }
    }
  }) => borderRadius};
`;

const Label = styled.div`
  width: 32px;
  color: ${({ theme }) => theme.answerBox.indexBoxColor};
  background: ${({ theme }) => theme.answerBox.indexBoxBgColor};
  border-top-left-radius: ${({ theme }) => theme.answerBox.borderRadius};
  border-bottom-left-radius: ${({ theme }) => theme.answerBox.borderRadius};
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  font-weight: 700;
`;

const Text = styled.div`
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: start;
  background: ${white};
  min-width: 80px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  font-weight: 600;
`;
