import styled from "styled-components";
import { withMathFormula } from "../HOC/withMathFormula";

const Stimulus = withMathFormula(styled.div`
  margin-bottom: 15px;
  line-height: 0.7;
`);

export default Stimulus;
