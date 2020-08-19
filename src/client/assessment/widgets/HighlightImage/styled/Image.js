import styled from "styled-components";

export const Image = styled.img`
  position: absolute;
  top: ${({ y }) => `${y || 0}px`};
  left: ${({ x }) => `${x || 0}px`};
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
`;
