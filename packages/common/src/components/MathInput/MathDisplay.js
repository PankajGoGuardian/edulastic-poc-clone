import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { withMathFormula } from "../../HOC/withMathFormula";
import MathSpan from "../MathSpan";

const MathDisplayWrapper = styled.span`
  .input__math {
    padding: 5px;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
    display: inline-block;
    width: ${({ style }) => (style.width ? style.width : "auto")};
  }
`;

const MathDisplay = ({ template, innerValues, style }) => {
  let workTemplate = `${template}`;
  for (let i = 0; i < innerValues.length; i++) {
    workTemplate = workTemplate.replace(
      "\\MathQuillMathField{}",
      `<span class="input__math" data-latex="${innerValues[i]}"></span>`
    );
  }
  workTemplate = workTemplate.replace(/\\MathQuillMathField{}/g, "");
  return (
    <MathDisplayWrapper style={style}>
      <MathSpan dangerouslySetInnerHTML={{ __html: workTemplate }} />
    </MathDisplayWrapper>
  );
};

MathDisplay.propTypes = {
  template: PropTypes.string.isRequired,
  innerValues: PropTypes.object,
  style: PropTypes.object
};

MathDisplay.defaultProps = {
  innerValues: [],
  style: {}
};

export default withMathFormula(MathDisplay);
