import styled from "styled-components";

export const IconWrapper = styled.div`
  position: absolute;
  right: ${({ rightPosition }) => rightPosition || "5"}px;
  top: 50%;
  transform: translate(-50%, -50%);
`;
