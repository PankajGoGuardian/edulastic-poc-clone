import styled from "styled-components";

export const TemplateCover = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  width: ${({ width, maxWidth }) => (!maxWidth ? (width ? `${width}px` : "auto") : maxWidth)};
  min-height: 350px;
  margin: auto;
  min-width: 600px;
  max-width: ${({ maxWidth }) => (!maxWidth ? "100%" : maxWidth)};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : maxHeight)};
  height: ${({ maxHeight }) => (!maxHeight ? null : maxHeight)};
`;
