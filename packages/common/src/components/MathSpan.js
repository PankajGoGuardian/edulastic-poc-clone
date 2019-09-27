import styled from "styled-components";
import { desktopWidth } from "@edulastic/colors";
import { fonts } from "@edulastic/constants";

import { withMathFormula } from "../HOC/withMathFormula";

const MathSpan = withMathFormula(styled.span`
  display: inline;
  user-select: ${({ selectableText }) => (selectableText ? "text" : "none")};
  max-width: 400px;
  word-break: break-word;
  font-weight: ${fonts.previewFontWeight};

  @media (max-width: ${desktopWidth}) {
    font-size: ${fonts.previewFontSizeMobile};
  }
`);

export default MathSpan;
