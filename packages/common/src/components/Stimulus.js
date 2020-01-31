import styled, { withTheme } from "styled-components";
import { desktopWidth } from "@edulastic/colors";
import { fonts } from "@edulastic/constants";

import { withMathFormula } from "../HOC/withMathFormula";

const Stimulus = withTheme(
  withMathFormula(styled.div`
    margin-bottom: 15px;
    img {
      max-height: unset !important;
    }
    word-break: break-word;
    font-size: ${props => props.fontSize};
    font-weight: ${fonts.previewFontWeight};
    user-select: ${props => (props.userSelect ? "text !important" : "none")};

    & * {
      user-select: ${props => (props.userSelect ? "text !important" : "none")};
      -webkit-touch-callout: none;
    }

    & .input__math,
    & .input__math * {
      user-select: none !important;
      -webkit-touch-callout: none !important;
    }

    @media (max-width: ${desktopWidth}) {
      font-size: ${fonts.previewFontSizeMobile};
    }
  `)
);

export default Stimulus;
