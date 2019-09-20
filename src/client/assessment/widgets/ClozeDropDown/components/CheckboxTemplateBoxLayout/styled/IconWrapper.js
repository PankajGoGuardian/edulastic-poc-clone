import styled from "styled-components";

export const IconWrapper = styled.div`
  position: absolute;
  right: ${({ rightPosition }) => `${rightPosition}px`};
  display: flex;
`;
