import styled from "styled-components";

export const IconWrapper = styled.div`
  position: absolute;
  right: 0px;
  height: 100%;
  width: 18px;
  background-color: inherit;
  border-radius: 4px;

  & svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
