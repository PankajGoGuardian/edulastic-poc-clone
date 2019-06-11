import styled from "styled-components";

export const Column = styled.td`
  padding: 0 16px 0 16px;
  word-break: break-word;
  min-width: 90px;
  img {
    max-height: 120px;
  }
  width: ${({ rowTitles, colCount }) =>
    rowTitles.length > 0 ? 100 / colCount - 100 / colCount / 5 / colCount : 100 / colCount}%;
`;
