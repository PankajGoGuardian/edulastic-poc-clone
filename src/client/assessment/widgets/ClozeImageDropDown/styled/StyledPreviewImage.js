import styled from "styled-components";

export const StyledPreviewImage = styled.img`
  width: ${({ width, maxWidth }) => (!maxWidth ? width || "auto" : width < maxWidth ? `${width}px` : "min-content")};
  height: ${({ smallSize, height }) => (!height ? (smallSize ? "100%" : "auto") : "auto")};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : maxHeight)};
  max-width: ${({ maxWidth }) => (!maxWidth ? null : maxWidth)};
  user-select: none;
  pointer-events: none;
`;
