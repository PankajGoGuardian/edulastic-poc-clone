import styled from "styled-components";
import { desktopWidth } from "@edulastic/colors";
import { fonts } from "@edulastic/constants";

import { withMathFormula } from "../HOC/withMathFormula";

const MathSpan = withMathFormula(styled.span.attrs({
  className: ({ clas }) => (!clas ? null : clas)
})`
  display: inline;
  user-select: none;
  max-width: 400px;
  font-size: ${fonts.previewFontSize};
  font-weight: ${fonts.previewFontWeight};

  @media (max-width: ${desktopWidth}) {
    font-size: ${fonts.previewFontSizeMobile};
  }
`);

export default MathSpan;
