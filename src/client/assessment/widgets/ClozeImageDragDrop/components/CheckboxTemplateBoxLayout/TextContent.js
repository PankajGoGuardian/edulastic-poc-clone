import React from "react";
import PropTypes from "prop-types";
import { MathSpan } from "@edulastic/common";

const AnswerContent = ({ userAnswer, isPrintPreview }) => (
  <MathSpan isPrintPreview={isPrintPreview} dangerouslySetInnerHTML={{ __html: userAnswer }} />
);

AnswerContent.propTypes = {
  userAnswer: PropTypes.string.isRequired
};

export default AnswerContent;
