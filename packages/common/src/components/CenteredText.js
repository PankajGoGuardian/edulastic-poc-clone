import styled from "styled-components";
import { desktopWidth } from "@edulastic/colors";
import { previewFontSize, previewFontSizeMobile, previewFontWeight } from "@edulastic/fonts";

import { withMathFormula } from "../HOC/withMathFormula";

const CenteredText = withMathFormula(styled.div`
  text-align: center;
  font-weight: 600;
  margin-bottom: 15px;
  font-size: ${previewFontSize};
  font-weight: ${previewFontWeight};

  @media (max-width: ${desktopWidth}) {
    font-size: ${previewFontSizeMobile};
  }
`);

export default CenteredText;
