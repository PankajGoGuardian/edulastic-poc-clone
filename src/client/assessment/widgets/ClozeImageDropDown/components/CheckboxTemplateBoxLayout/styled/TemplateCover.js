import styled from "styled-components";

export const TemplateCover = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  margin: auto;
  height: ${({ height }) => (!height ? null : `${height}px`)};
  width: ${({ width }) => (!width ? null : `${width}px`)};
  max-width: ${({ width }) => (width ? `${width}px` : "100%")};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : `${maxHeight}px`)};
  overflow: hidden;

  img {
    max-width: unset !important;
  }
`;
