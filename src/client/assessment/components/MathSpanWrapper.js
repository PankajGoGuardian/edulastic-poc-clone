import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { WithMathFormula } from "@edulastic/common";
const mathRegex = /<span class="input__math" data-latex="([^"]+)"><\/span>/g;

const MathSpanWrapper = ({ lineheight, latex }) => {
  const template = !latex.match(mathRegex)
    ? `<span><span class="input__math" data-latex="${latex}"></span></span>`
    : latex;
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
