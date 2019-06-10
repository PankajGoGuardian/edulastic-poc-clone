import styled from "styled-components";
import { withMathFormula } from "../HOC/withMathFormula";

const MathFormulaDisplay = withMathFormula(styled.div`
  img {
    max-width: ${({ stem, choice }) => (!stem ? (!choice ? null : "165px !important") : "200px !important")};
    max-height: ${({ stem, choice }) => (!stem ? (!choice ? null : "110px !important") : "120px !important")};
    width: auto !important;
  }
`);

export default MathFormulaDisplay;
