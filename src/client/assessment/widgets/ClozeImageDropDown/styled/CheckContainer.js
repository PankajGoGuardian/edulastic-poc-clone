import styled from "styled-components";

export const CheckContainer = styled.div`
  position: ${({ position }) => (!position ? "absolute" : position)};
  left: 60px;
  bottom: 20px;
  align-self: ${({ alignSelf }) => (!alignSelf ? "flex-start" : alignSelf)};
`;
