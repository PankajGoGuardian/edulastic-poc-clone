import styled from "styled-components";

export const StyledPreviewContainer = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  width: ${({ width }) => (width ? width : "100%")};
  min-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}px` : "100%")};
  min-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "100%")};
  max-width: ${({ maxWidth }) => (!maxWidth ? "100%" : `${maxWidth}px`)};
  height: auto;
`;
