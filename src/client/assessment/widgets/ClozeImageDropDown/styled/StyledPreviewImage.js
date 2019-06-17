import styled from "styled-components";

export const StyledPreviewImage = styled.img`
  width: ${({ width }) => `${width}px` || "auto"};
  height: ${({ smallSize, height }) => (!height ? (smallSize ? "100%" : "auto") : height + "px")};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : `${maxHeight}px`)};
  max-width: ${({ maxWidth }) => (!maxWidth ? null : `${maxWidth}px`)};
  user-select: none;
  pointer-events: none;
`;
