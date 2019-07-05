import styled from "styled-components";

export const TableWrapper = styled.div`
  overflow: auto;
  height: 600px;
  width: 700px;
  margin: auto;
  margin-top: 0;
  background: ${({ imageUrl }) => (imageUrl ? `url('${imageUrl}')` : "inherit")};
  background-size: ${({ isBgImageMaximized }) => (isBgImageMaximized ? "100% 100%" : "auto")};
  background-repeat: no-repeat;
  background-position: ${({ imageOptions }) => (imageOptions ? `${imageOptions.x}px ${imageOptions.y}px` : "inherit")};
  background-size: ${({ imageOptions }) =>
    imageOptions ? `${imageOptions.width}px ${imageOptions.height}px` : "inherit"};
  padding-bottom: 20px;
`;
