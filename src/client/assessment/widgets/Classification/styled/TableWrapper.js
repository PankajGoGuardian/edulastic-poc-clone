import styled from "styled-components";

export const TableWrapper = styled.div`
  overflow: auto;
  width: 100%;
  height: 100%;
  max-width: 100%;
  margin: auto;
  margin-top: 0;
  background: ${({ imageUrl }) => (imageUrl ? `url('${imageUrl}')` : "inherit")};
  background-repeat: no-repeat;
  background-size: ${({ imageOptions = { width: 0, height: 0 } }) =>
    `${imageOptions.width}px ${imageOptions.height}px`};
  background-position: ${({ imageOptions }) => (imageOptions ? `${imageOptions.x}px ${imageOptions.y}px` : "inherit")};
  padding: 10px;
  position: relative;
  display: block;
  zoom: ${props => props.theme.widgets.classification.imageZoom};
`;
