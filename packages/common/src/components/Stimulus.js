import styled, { withTheme } from "styled-components";
import { desktopWidth } from "@edulastic/colors";
import { fonts } from "@edulastic/constants";

import { withMathFormula } from "../HOC/withMathFormula";

const Stimulus = withTheme(
  withMathFormula(styled.div`
    margin-bottom: 15px;
    font-size: ${props => props.fontSize};
    font-weight: ${fonts.previewFontWeight};

    @media (max-width: ${desktopWidth}) {
      font-size: ${fonts.previewFontSizeMobile};
    }
  `)
);

export default Stimulus;
