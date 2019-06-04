import styled from "styled-components";

export const PreviewImage = styled.img`
  height: ${({ height }) => (!height ? "100%" : `${height}px`)};
  width: ${({ width, maxWidth }) => (!maxWidth ? "100%" : width < 700 ? `${width}px` : maxWidth)};
  max-width: ${({ maxWidth }) => (!maxWidth ? null : maxWidth)};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : maxHeight)};
  user-select: none;
  pointer-events: none;
`;
