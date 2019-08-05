import styled from "styled-components";

export const CanvasContainer = styled.div`
  position: relative;
  height: ${({ height }) => (!height ? null : `${height}px`)};
  width: ${({ width }) => (!width ? null : `${width}px`)};
  min-height: ${({ minHeight }) => (!minHeight ? null : `${minHeight}px`)};
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  img {
    user-select: none;
  }
  canvas {
    position: absolute;
    left: 0;
    top: 0;
  }
`;
