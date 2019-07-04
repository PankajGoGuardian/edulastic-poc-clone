import styled from "styled-components";

export const TableWrapper = styled.div`
  overflow: auto;
  height: 600px;
  width: 700px;
  margin: auto;
  background: ${({ imageUrl }) => (imageUrl ? `url('${imageUrl}')` : "inherit")};
  background-repeat: no-repeat;
  background-size: ${({ isBgImageMaximized, imageOptions = { width: 0, height: 0 } }) =>
    false ? "100% 100%" : `${imageOptions.width}px ${imageOptions.height}px`};
  background-position: ${({ imageOptions }) => (imageOptions ? `${imageOptions.x}px ${imageOptions.y}px` : "inherit")};
  padding-bottom: 20px;
`;
