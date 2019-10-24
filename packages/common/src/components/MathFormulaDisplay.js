import styled, { withTheme } from "styled-components";
import { desktopWidth } from "@edulastic/colors";
import { fonts } from "@edulastic/constants";

import { withMathFormula } from "../HOC/withMathFormula";

const MathFormulaDisplay = withTheme(
  withMathFormula(styled.div.attrs({
    className: "math-formula-display"
  })`
    width: ${props => !props.centerContent && "100%"};
    overflow-wrap: ${props => props.centerContent && "initial"};
    font-size: ${props => props.fontSize || props.theme.fontSize};
    font-weight: ${fonts.previewFontWeight};

    @media (max-width: ${desktopWidth}) {
      font-size: ${fonts.previewFontSizeMobile};
    }
  `)
);

export default MathFormulaDisplay;
