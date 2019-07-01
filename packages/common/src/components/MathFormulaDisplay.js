import styled from "styled-components";
import { previewFontSize, previewFontWeight } from "@edulastic/fonts";

import { withMathFormula } from "../HOC/withMathFormula";

const MathFormulaDisplay = withMathFormula(styled.div.attrs({
  className: "math-formula-display"
})`
  width: 100%;
  font-size: ${previewFontSize};
  font-weight: ${previewFontWeight};

  img {
    max-width: ${({ stem, choice }) => (!stem ? (!choice ? null : "165px !important") : "200px !important")};
    max-height: ${({ stem, choice }) => (!stem ? (!choice ? null : "110px !important") : "120px !important")};
    width: ${({ stem, choice }) => (stem || choice ? "auto !important" : null)};
  }
`);

export default MathFormulaDisplay;
