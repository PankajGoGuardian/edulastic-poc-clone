import styled from "styled-components";

export const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: ${({ rightPosition }) => `${rightPosition}px`};
  display: flex;
`;
