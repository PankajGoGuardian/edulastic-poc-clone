import styled from "styled-components";
import { withMathFormula } from "../HOC/withMathFormula";

const MathSpan = withMathFormula(styled.span`
  user-select: none;
`);

export default MathSpan;
