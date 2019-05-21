import styled from "styled-components";

export const TableWrapper = styled.div`
  overflow: auto;
  background: ${({ imageUrl }) => (imageUrl ? `url('${imageUrl}')` : "inherit")};
  background-size: cover;
  padding-bottom: 20px;
`;
