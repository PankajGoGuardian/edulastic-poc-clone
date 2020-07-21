import styled from "styled-components";

const BlockContainer = styled.div`
  width: ${({ width }) => (width ? `${width}px` : "auto")};
  height: ${({ height }) => (height ? `${height}px` : "auto")};
  display: block;
  overflow: auto;
  position: relative;
  zoom: ${props => props.theme.widgets.hotspot.imageZoom};
  & > * {
    margin-right: ${({ childMarginRight }) => (childMarginRight !== undefined ? childMarginRight : 10)}px;
  }
  & > *:last-child {
    margin-right: 0;
  }
  margin-left: ${({ ml }) => ml};
`;

export default BlockContainer;
