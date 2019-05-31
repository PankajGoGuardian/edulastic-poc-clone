import styled from "styled-components";

export const StyledPreviewContainer = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  width: ${({ width }) => (width ? width : "100%")};
  min-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}` : "100%")};
  min-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}` : "100%")};
  max-width: ${({ maxWidth }) => (!maxWidth ? "100%" : maxWidth)};
  margin: auto;
  height: auto;
`;
