import styled from "styled-components";

export const TableWrapper = styled.div`
  overflow: auto;
  height: 600px;
  width: 700px;
  margin: auto;
  background: ${({ imageUrl }) => (imageUrl ? `url('${imageUrl}')` : "inherit")};
  background-repeat: no-repeat;
  background-position: ${({ imageOptions }) => (imageOptions ? `${imageOptions.x}px ${imageOptions.y}px` : "inherit")};
  background-size: ${({ imageOptions }) => (imageOptions ? `${imageOptions.width} ${imageOptions.height}` : "inherit")};
  padding-bottom: 20px;
`;
