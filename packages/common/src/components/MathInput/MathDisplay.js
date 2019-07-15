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
  }
`;

const MathDisplay = ({ template, innerValues }) => {
  let workTemplate = `${template}`;
  for (let i = 0; i < innerValues.length; i++) {
    workTemplate = workTemplate.replace(
      "\\MathQuillMathField{}",
      `<span class="input__math" data-latex="${innerValues[i]}"></span>`
    );
  }
  workTemplate = workTemplate.replace(/\\MathQuillMathField{}/g, "");
  return (
    <MathDisplayWrapper>
      <MathSpan dangerouslySetInnerHTML={{ __html: workTemplate }} />
    </MathDisplayWrapper>
  );
};

MathDisplay.propTypes = {
  template: PropTypes.string.isRequired,
  innerValues: PropTypes.object
};

MathDisplay.defaultProps = {
  innerValues: []
};

export default withMathFormula(MathDisplay);
