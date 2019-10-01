import styled from "styled-components";

export const IconWrapper = styled.div`
  position: absolute;
  right: ${({ rightPosition }) => `${rightPosition}px`};
  display: ${({ display }) => display};
  height: 100%;
  align-items: center;
`;
