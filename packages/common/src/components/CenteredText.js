import styled from "styled-components";
import { desktopWidth } from "@edulastic/colors";
import { fonts } from "@edulastic/constants";

import { withMathFormula } from "../HOC/withMathFormula";

const CenteredText = withMathFormula(styled.div`
  text-align: center;
  font-weight: 600;
  margin-bottom: 15px;
  font-weight: ${fonts.previewFontWeight};
  word-wrap: ${({ wordWrap }) => wordWrap};

  @media (max-width: ${desktopWidth}) {
    font-size: ${fonts.previewFontSizeMobile};
  }
`);

export default CenteredText;
