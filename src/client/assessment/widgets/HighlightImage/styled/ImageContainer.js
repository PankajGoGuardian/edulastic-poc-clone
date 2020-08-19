import styled from "styled-components";

export const ImageContainer = styled.div`
  position: relative;
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  height: ${({ height }) => (height ? `${height}px` : "100%")};
  zoom: ${({ theme }) => theme?.widgets?.highlightImage?.imageZoom};
`;
