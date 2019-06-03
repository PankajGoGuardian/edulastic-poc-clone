import styled from "styled-components";

export const StyledPreviewImage = styled.img`
  width: ${({ width }) => width || "auto"};
  height: ${({ smallSize, height }) => (!height ? (smallSize ? "100%" : "auto") : height + "px")};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : maxHeight)};
  max-width: ${({ maxWidth }) => (!maxWidth ? null : maxWidth)};
  user-select: none;
  pointer-events: none;
`;
