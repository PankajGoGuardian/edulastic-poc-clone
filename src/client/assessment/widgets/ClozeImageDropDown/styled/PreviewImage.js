import styled from "styled-components";

export const PreviewImage = styled.img`
  height: ${({ height }) => (!height ? "100%" : `${height}px`)};
  width: ${({ width }) => (!width ? "100%" : `${width}px`)};
  max-width: ${({ maxWidth }) => (!maxWidth ? null : `${maxWidth}px`)};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : `${maxHeight}px`)};
  user-select: none;
  pointer-events: none;
`;
