import styled from "styled-components";

export const StyledPreviewContainer = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  width: ${({ width }) => (width ? `${width}px` : "fit-content")};
  height: 100%;
  max-width: 100%;
  margin: auto;
`;
