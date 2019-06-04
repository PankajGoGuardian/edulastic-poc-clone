import styled from "styled-components";

export const PreviewImage = styled.img`
  height: ${({ maxHeight }) => (!maxHeight ? "100%" : "auto")};
  width: ${({ width, maxWidth }) => (!maxWidth ? "100%" : width < 700 ? `${width}px` : maxWidth)};
  max-width: ${({ maxWidth }) => (!maxWidth ? null : maxWidth)};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : maxHeight)};
  user-select: none;
  pointer-events: none;
`;
