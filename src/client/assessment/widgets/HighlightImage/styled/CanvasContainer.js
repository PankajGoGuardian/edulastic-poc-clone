import styled from 'styled-components';

export const CanvasContainer = styled.div`
  position: relative;
  img {
    user-select: none;
  }
  canvas {
    position: absolute;
    left: 0;
    top: 0;
  }
`;
