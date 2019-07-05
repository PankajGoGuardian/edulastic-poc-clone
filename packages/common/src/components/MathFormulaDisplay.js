import styled from "styled-components";
import { desktopWidth } from "@edulastic/colors";
import { fonts } from "@edulastic/constants";

import { withMathFormula } from "../HOC/withMathFormula";

const MathFormulaDisplay = withMathFormula(styled.div.attrs({
  className: "math-formula-display"
})`
  width: 100%;
  font-size: ${fonts.previewFontSize};
  font-weight: ${fonts.previewFontWeight};

  @media (max-width: ${desktopWidth}) {
    font-size: ${fonts.previewFontSizeMobile};
  }

  img {
    max-width: ${({ stem, choice }) => (!stem ? (!choice ? null : "165px !important") : "200px !important")};
    max-height: ${({ stem, choice }) => (!stem ? (!choice ? null : "110px !important") : "120px !important")};
    width: ${({ stem, choice }) => (stem || choice ? "auto !important" : null)};
  }
`);

export default MathFormulaDisplay;
