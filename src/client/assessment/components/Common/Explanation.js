import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { MathFormulaDisplay } from "@edulastic/common";
import { mainTextColor, backgroundGrey, greenDark, lightGrey9 } from "@edulastic/colors";

const Explanation = ({ question }) => {
  const { sampleAnswer, barLabel } = question;
  return (
    <div data-cy="explanation-container">
      <QuestionLabel>
        <QuestionText>{barLabel}</QuestionText> - Solution
      </QuestionLabel>
      <SolutionText>
        <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: sampleAnswer }} />
      </SolutionText>
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
  padding-left: 11px;
  border-bottom: 0.05rem solid ${backgroundGrey};
`;

const QuestionText = styled.span`
  font-weight: 700;
  font-size: 16px;
  color: ${greenDark};
`;

const SolutionText = styled.div`
  text-align: left;
  padding-left: 28px;
  letter-spacing: 0;
  color: ${lightGrey9};
  opacity: 1;
`;
