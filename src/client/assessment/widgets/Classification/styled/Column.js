import styled from "styled-components";
import {} from "@edulastic/colors";
import { withMathFormula } from "@edulastic/common/src/HOC/withMathFormula";

export const Column = styled.div`
  word-break: break-word;
  min-width: 90px;
  height: auto;
  img {
    max-height: 120px;
  }
  position: absolute;
  width: ${({ rowTitles, colCount }) =>
    rowTitles.length > 0 ? 100 / colCount - 100 / colCount / 5 / colCount : 100 / colCount}%;
`;

export const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 39px;
`;

export const ColumnLabel = withMathFormula(styled.div`
  font-weight: 600;
  text-align: center;
  padding: 8px;
`);
