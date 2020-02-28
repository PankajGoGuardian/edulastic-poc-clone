import styled from "styled-components";

export const CanvasContainer = styled.div`
  position: relative;
  height: ${({ height }) => (!height ? null : `${height}px`)};
  width: ${({ width }) => width};
  min-height: ${({ minHeight }) => (!minHeight ? null : `${minHeight}px`)};
  border-radius: 10px;
  margin-left: 40px;
  img {
    user-select: none;
  }
  canvas {
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    height: 100%;
    width: 100%;
  }
`;
