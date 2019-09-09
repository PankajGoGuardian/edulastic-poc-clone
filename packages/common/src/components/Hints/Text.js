import styled from "styled-components";

import { white } from "@edulastic/colors";
import { WithMathFormula } from "@edulastic/common";

const Text = styled.div`
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${white};
  min-width: 80px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
`;

export default WithMathFormula(Text);
