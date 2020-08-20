import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { WithMathFormula } from "@edulastic/common";

const MathSpanWrapper = ({ latex }) => {
  const template = `<span><span class="input__math" data-latex="${latex}"></span></span>`;
  return <MathSpan dangerouslySetInnerHTML={{ __html: template }} />;
};

MathSpanWrapper.propTypes = {
  latex: PropTypes.string.isRequired
};

export default MathSpanWrapper;

const MathSpan = WithMathFormula(styled.span`
  position: relative;
`);
