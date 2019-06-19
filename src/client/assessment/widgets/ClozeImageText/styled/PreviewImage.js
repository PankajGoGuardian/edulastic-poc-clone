import styled from "styled-components";

export const PreivewImageWrapper = styled.div`
  position: relative;
`;

export const PreviewImage = styled.img`
  height: ${({ height, maxHeight }) => (!maxHeight ? "100%" : height ? `${height}px` : "auto")};
  width: ${({ width, maxWidth }) => (!maxWidth ? "100%" : width < 700 ? `${width}px` : maxWidth)};
  user-select: none;
  pointer-events: none;
  max-width: unset !important;
`;
