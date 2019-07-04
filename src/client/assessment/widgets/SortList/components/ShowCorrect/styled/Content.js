import styled from "styled-components";
import { WithMathFormula } from "@edulastic/common";
import { FlexRow } from "./FlexRow";

export const Content = WithMathFormula(styled(FlexRow)`
  align-items: center;
  padding-right: 36px;
  padding-left: 16px;
  white-space: normal;
  display: flex !important;
  && img {
    width: 300px !important;
    height: auto;
  }
`);
