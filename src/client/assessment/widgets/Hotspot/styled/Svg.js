import styled from "styled-components";

export const Svg = styled.svg`
  position: absolute;
  left: 0px;
  top: 0px;
  cursor: ${({ intersect }) => (intersect ? "not-allowed" : "normal")};
`;
