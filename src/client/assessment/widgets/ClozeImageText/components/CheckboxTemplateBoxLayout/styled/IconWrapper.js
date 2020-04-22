import styled from "styled-components";

export const IconWrapper = styled.div`
  position: absolute;
  right: ${({ rightPosition }) => rightPosition || "3"}px;
  top: 50%;
  transform: translate(0%, -50%); /* only center horizontally */
`;
