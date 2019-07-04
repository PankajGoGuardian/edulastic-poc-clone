import styled from "styled-components";

export const RowTitleCol = styled.span`
  padding: 0 16px 0 16px;
  word-break: break-word;
  display: flex;
  align-items: center;
  margin-top: 20px;
  min-width: 90px;
  width: ${({ colCount }) => 100 / colCount / 5}%;
`;
