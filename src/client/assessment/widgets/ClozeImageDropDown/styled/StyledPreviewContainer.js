import styled from "styled-components";

export const StyledPreviewContainer = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  width: ${({ width, maxWidth }) => (!maxWidth ? (width ? `${width}px` : "100%") : maxWidth)};
  min-height: 350px;
  max-width: 100%;
  margin: auto;
  height: ${({ height }) => (!height ? null : height)};
`;
