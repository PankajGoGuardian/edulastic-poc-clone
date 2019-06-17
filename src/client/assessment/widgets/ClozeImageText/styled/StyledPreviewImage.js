import styled from "styled-components";

export const StyledPreviewImage = styled.img`
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  height: ${({ height }) => (!height ? "auto" : `${height}px`)};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : `${maxHeight}px`)};
  max-width: ${({ maxWidth }) => (!maxWidth ? null : `${maxWidth}px`)};
  user-select: none;
  pointer-events: none;
`;
