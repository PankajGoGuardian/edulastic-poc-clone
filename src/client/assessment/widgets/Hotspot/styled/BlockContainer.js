import styled from "styled-components";

const BlockContainer = styled.div.attrs({
  style: ({ width, height }) => ({
    width: width ? `${width}px` : "auto",
    height: height ? `${height}px` : "auto"
  })
})`
  display: block;
  overflow: auto;
  position: relative;
  & > * {
    margin-right: ${({ childMarginRight }) => (childMarginRight !== undefined ? childMarginRight : 10)}px;
  }
  & > *:last-child {
    margin-right: 0;
  }
`;

export default BlockContainer;
