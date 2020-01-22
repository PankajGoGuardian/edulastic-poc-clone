import styled from "styled-components";

export const IconWrapper = styled.div`
  position: absolute;
  right: ${({ rightPosition }) => rightPosition || 10}px;
  display: flex;
  top: 50%;
  transform: translateY(-50%);
`;
