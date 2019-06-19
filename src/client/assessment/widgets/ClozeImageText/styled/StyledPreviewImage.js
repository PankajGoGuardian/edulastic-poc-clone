import styled from "styled-components";

export const StyledPreviewImage = styled.div`
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  height: ${({ height }) => (!height ? "auto" : `${height}px`)};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : `${maxHeight}px`)};
  max-width: ${({ maxWidth }) => (!maxWidth ? null : `${maxWidth}px`)};
  user-select: none;
  pointer-events: none;
  background-size: ${({ width, maxWidth }) => (!maxWidth ? "100%" : width < 700 ? `${width}px` : maxWidth)}
    ${({ height, maxHeight }) => (!maxHeight ? "100%" : height ? `${height}px` : "auto")};
  background-repeat: no-repeat;
  background-image: url(${({ imageSrc }) => imageSrc || ""});
`;
