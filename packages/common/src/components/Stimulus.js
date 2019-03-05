import styled from "styled-components";
import { withMathFormula } from "../HOC/withMathFormula";

const Stimulus = withMathFormula(styled.div`
  font-size: 16px;
  margin-bottom: 30px;
`);

export default Stimulus;
