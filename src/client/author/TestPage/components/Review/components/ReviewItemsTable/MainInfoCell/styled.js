import styled from "styled-components";
import { WithMathFormula } from "@edulastic/common";

export const Stimulus = WithMathFormula(styled.div`
  font-size: 13px;
  color: #444444;
  margin-top: 3px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
`);
