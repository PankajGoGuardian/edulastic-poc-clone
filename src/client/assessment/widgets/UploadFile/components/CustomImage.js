import styled from "styled-components";

const CustomImage = styled.img.attrs({ draggable: false })`
  width: ${({ width }) => (width ? `${width}px` : "23px")};
  height: ${({ height }) => (height ? `${height}px` : "30px")};
  object-fit: contain;
`;

export default CustomImage;
