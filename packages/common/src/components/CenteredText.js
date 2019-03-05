import styled from "styled-components";
import { withMathFormula } from "../HOC/withMathFormula";

const CenteredText = withMathFormula(styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 15px;
`);

export default CenteredText;
