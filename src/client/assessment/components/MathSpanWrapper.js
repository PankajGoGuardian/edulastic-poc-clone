import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { WithMathFormula } from "@edulastic/common";

const MathSpanWrapper = ({ lineheight, latex }) => {
  const template = `<span><span class="input__math" data-latex="${latex}"></span></span>`;
  return <MathSpan lineHeight={lineheight} dangerouslySetInnerHTML={{ __html: template }} />;
};

MathSpanWrapper.propTypes = {
  latex: PropTypes.string.isRequired,
  lineheight: PropTypes.string.isRequired
};

export default MathSpanWrapper;

const MathSpan = WithMathFormula(styled.span`
  user-select: none;
  line-height: ${props => props.lineHeight};
`);
