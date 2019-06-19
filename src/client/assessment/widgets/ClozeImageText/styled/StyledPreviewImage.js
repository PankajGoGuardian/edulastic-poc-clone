import styled from "styled-components";

export const StyledPreviewImage = styled.div`
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  height: ${({ height }) => (!height ? "auto" : `${height}px`)};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : `${maxHeight}px`)};
  max-width: ${({ maxWidth }) => (!maxWidth ? null : `${maxWidth}px`)};
  user-select: none;
  pointer-events: none;
  background-size: ${({ height, width, maxWidth, maxHeight }) => `${width || maxWidth}px ${height || maxHeight}px`};
  background-repeat: no-repeat;
  background-image: url(${({ imageSrc }) => imageSrc || ""});
`;
