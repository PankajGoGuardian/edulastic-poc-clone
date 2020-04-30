import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { white } from "@edulastic/colors";
import { MathFormulaDisplay } from "@edulastic/common";
import MathSpanWrapper from "../../../components/MathSpanWrapper";

const AnswerBoxText = ({ children, isMath }) => (
  <Text data-cy="correct-answer-box">
    {isMath ? (
      <MathSpanWrapper latex={children} />
    ) : (
      <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: children }} />
    )}
  </Text>
);

AnswerBoxText.propTypes = {
  children: PropTypes.string.isRequired
};

export default AnswerBoxText;

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
