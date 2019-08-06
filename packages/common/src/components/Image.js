import styled from "styled-components";

const Image = styled.img`
  width: ${({ width }) => (width ? `${width}px` : "auto")};
  height: ${({ height, width }) => (width ? "auto" : height ? `${height}px` : "auto")};
  max-height: 600px;
  max-width: 700px;
`;

export default Image;
