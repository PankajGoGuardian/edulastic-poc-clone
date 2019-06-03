import styled from "styled-components";

export const StyledPreviewImage = styled.img`
  width: ${({ width, maxWidth }) => (!maxWidth ? width || "auto" : width < 700 ? `${width}px` : "100%")};
  height: ${({ smallSize, height }) => (!height ? (smallSize ? "100%" : "auto") : height + "px")};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : maxHeight)};
  max-width: ${({ maxWidth }) => (!maxWidth ? null : maxWidth)};
  user-select: none;
  pointer-events: none;
`;
