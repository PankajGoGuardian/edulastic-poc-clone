import styled from "styled-components";
import { withMathFormula } from "../HOC/withMathFormula";

const MathSpan = withMathFormula(styled.span.attrs({
  className: ({ clas }) => (!clas ? null : clas)
})`
  display: inline;
  user-select: none;
  max-width: 400px;
`);

export default MathSpan;
