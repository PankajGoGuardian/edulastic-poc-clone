import styled from "styled-components";

export const TableWrapper = styled.div`
  overflow: auto;
  height: 600px;
  width: 100%;
  margin: auto;
  margin-top: 0;
  background: ${({ imageUrl }) => (imageUrl ? `url('${imageUrl}')` : "inherit")};
  background-repeat: no-repeat;
  background-size: ${({ imageOptions = { width: 0, height: 0 } }) =>
    `${imageOptions.width}px ${imageOptions.height}px`};
  background-position: ${({ imageOptions }) => (imageOptions ? `${imageOptions.x}px ${imageOptions.y}px` : "inherit")};
  padding-bottom: 20px;
  position: relative;
`;
