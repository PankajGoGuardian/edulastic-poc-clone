import styled from "styled-components";
import { ChoiceDimensions as dimensions } from "@edulastic/constants";

export const RowTitleCol = styled.span`
  padding: 2px 16px;
  word-break: break-word;
  display: flex;
  align-items: center;
  min-width: 90px;
  /* width: ${({ width, colCount }) => width || `${100 / colCount / 5}%`}; */
  justify-content: ${({ justifyContent }) => justifyContent || "auto"};
  max-width: ${dimensions.maxWidth}px;
`;
