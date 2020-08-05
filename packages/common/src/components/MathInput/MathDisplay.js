import { greyThemeLight, greyThemeLighter } from "@edulastic/colors";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { withMathFormula } from "../../HOC/withMathFormula";
import MathSpan from "../MathSpan";

const MathDisplayWrapper = styled.span`
  .input__math {
    padding: 4px;
    border-radius: 2px;
    border: 1px solid ${greyThemeLight};
    background: ${greyThemeLighter};
    margin-top: 2px;
    margin-bottom: 2px;
    display: inline-flex;
    min-width: ${({ styles }) => (styles.width ? styles.width : "auto")};
    min-height: ${({ styles }) => styles.height || "auto"};
    vertical-align: middle;
    align-items: ${({ styles }) => styles.alignItems};
  }
`;

const MathDisplay = ({ template, innerValues, styles }) => {
  let workTemplate = `${template}`;
  for (let i = 0; i < innerValues.length; i++) {
    workTemplate = workTemplate.replace(
      "\\MathQuillMathField{}",
      // `<span class="input__math" data-latex="${innerValues[i]}"></span>`
      innerValues[i]
    );
  }
  workTemplate = workTemplate.replace(/\\MathQuillMathField{}/g, "");
  return (
    <MathDisplayWrapper styles={styles}>
      <MathSpan
        dangerouslySetInnerHTML={{
          __html: `<span class="input__math" data-latex="${workTemplate}"></span>`
        }}
      />
    </MathDisplayWrapper>
  );
};

MathDisplay.propTypes = {
  template: PropTypes.string.isRequired,
  innerValues: PropTypes.object,
  styles: PropTypes.object
};

MathDisplay.defaultProps = {
  innerValues: [],
  styles: {}
};

export default withMathFormula(MathDisplay);
