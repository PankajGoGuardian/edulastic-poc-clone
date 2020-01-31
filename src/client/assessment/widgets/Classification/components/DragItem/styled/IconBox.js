import styled from "styled-components";

export const IconBox = styled.div`
  margin-right: ${({ checked }) => (checked ? "8px" : "0px")};
  position: absolute;
  right: 0px;
`;
