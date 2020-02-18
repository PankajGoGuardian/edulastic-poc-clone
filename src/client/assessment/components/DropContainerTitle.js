import styled from "styled-components";

export const DropContainerTitle = styled.div`
  margin: 0 auto 1rem 8px;
  color: ${({ theme }) => theme.textColor};
  font-weight: ${({ theme }) => theme.bold};
  font-size: ${({ theme }) => theme.smallFontSize};
  line-height: ${({ theme }) => theme.headerLineHeigh};
`;
