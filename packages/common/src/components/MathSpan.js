import styled from "styled-components";
import { desktopWidth } from "@edulastic/colors";
import { previewFontSize, previewFontSizeMobile, previewFontWeight } from "@edulastic/fonts";

import { withMathFormula } from "../HOC/withMathFormula";

const MathSpan = withMathFormula(styled.span.attrs({
  className: ({ clas }) => (!clas ? null : clas)
})`
  display: inline;
  user-select: none;
  max-width: 400px;
  font-size: ${previewFontSize};
  font-weight: ${previewFontWeight};

  @media (max-width: ${desktopWidth}) {
    font-size: ${previewFontSizeMobile};
  }
`);

export default MathSpan;
