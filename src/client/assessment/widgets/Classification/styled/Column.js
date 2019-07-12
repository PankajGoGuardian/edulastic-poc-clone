import styled from "styled-components";
import {} from "@edulastic/colors";

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

export const ColumnLabel = styled.div`
  background-color: #ececec;
  font-weight: 600;
  text-align: center;
  border: 1px solid #ddd;
  padding: 8px;
  min-height: 39px;
`;
