import styled from "styled-components";

const Image = styled.img`
  width: ${({ width }) => (width ? `${width}px` : "auto")};
  height: ${({ height }) => (height ? `${height}px` : "auto")};
  max-height: 100%;
  max-width: 100%;
`;

export default Image;
