import styled from "styled-components";

export const StyledPreviewContainer = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  margin: auto;
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  height: ${({ height }) => (!height ? null : `${height}px`)};
  max-width: ${({ width }) => (width ? `${width}px` : "100%")};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : `${maxHeight}px`)};

  img {
    max-width: unset !important;
  }
`;
