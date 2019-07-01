import styled from "styled-components";
import { previewFontSize, previewFontWeight } from "@edulastic/fonts";

import { withMathFormula } from "../HOC/withMathFormula";

const Stimulus = withMathFormula(styled.div`
  margin-bottom: 15px;
  font-size: ${previewFontSize};
  font-weight: ${previewFontWeight};
`);

export default Stimulus;
