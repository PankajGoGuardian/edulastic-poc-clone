import styled from "styled-components";
import { WithMathFormula } from "@edulastic/common";
import { FlexRow } from "./FlexRow";

export const Content = WithMathFormula(styled(FlexRow)`
  align-items: center;
  padding: 4px 36px 4px 16px;
  white-space: normal;
  display: flex !important;
  && img {
    max-width: 400px !important;
    height: auto;
  }
`);
