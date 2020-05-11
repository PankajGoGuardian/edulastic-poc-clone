import styled from "styled-components";
import { math } from "@edulastic/constants";

const {
  KeyboardSize: { width: keyWidth }
} = math;

export const NumberPadWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: ${({ width }) => (width ? `${width}px` : `calc(${keyWidth}px * 6)`)};
  margin-right: 0px;
`;
