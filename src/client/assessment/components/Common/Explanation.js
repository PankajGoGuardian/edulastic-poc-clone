import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { MathFormulaDisplay, EduButton } from "@edulastic/common";
import { mainTextColor, backgroundGrey, lightGrey9 } from "@edulastic/colors";

const Explanation = ({ question, isGrade }) => {
  const { sampleAnswer } = question;
  if (
    !sampleAnswer ||
    question.type === "passage" ||
    question.type === "passageWithQuestions" ||
    question.type === "video" ||
    question.type === "resource" ||
    question.type === "text"
  ) {
    return null;
  }

  const [show, updateShow] = useState(isGrade);

  const onClickHandler = () => updateShow(true);

  return (
    <div data-cy="explanation-container">
      {show && (
        <>
          <QuestionLabel>Explanation</QuestionLabel>
          <SolutionText>
            <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: sampleAnswer }} />
          </SolutionText>
        </>
      )}
      {!show && (
        <ShowExplanation width="110px" height="30px" isGhost onClick={onClickHandler}>
          Show solution
        </ShowExplanation>
      )}
    </div>
  );
};

Explanation.propTypes = {
  question: PropTypes.object.isRequired
};

export default Explanation;

const QuestionLabel = styled.div`
  color: ${mainTextColor};
  font-weight: 700;
  font-size: 16px;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 0px 11px;
  border-bottom: 0.05rem solid ${backgroundGrey};
`;

const SolutionText = styled.div`
  text-align: left;
  padding-left: 28px;
  letter-spacing: 0;
  color: ${lightGrey9};
  opacity: 1;
`;

const ShowExplanation = styled(EduButton)`
  margin-left: ${({ isStudent }) => `${isStudent ? 50 : 0}px`};
`;
