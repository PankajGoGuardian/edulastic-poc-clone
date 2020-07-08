import styled from "styled-components";
import { desktopWidth } from "@edulastic/colors";
import { fonts } from "@edulastic/constants";

import { withMathFormula } from "../HOC/withMathFormula";

const MathSpan = withMathFormula(styled.span`
  display: inline;
  user-select: ${({ selectableText }) => (selectableText ? "text" : "none")};
  word-break: break-word;
  font-weight: ${fonts.previewFontWeight};
  ${props =>
    props.isPrintPreview && {
      "max-width": "100%",
      "text-overflow": "ellipsis",
      overflow: "hidden",
      "white-space": "nowrap"
    }} 

  @media (max-width: ${desktopWidth}) {
    font-size: ${fonts.previewFontSizeMobile};
  }
  img.fr-dii {
    vertical-align: top;
  }
`);

export default MathSpan;
