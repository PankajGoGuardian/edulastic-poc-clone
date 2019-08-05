import styled from "styled-components";

export const ImageContainer = styled.img.attrs({
  style: ({ width, height, top, left }) => ({
    width: width ? `${width}px` : "auto",
    height: width ? "auto" : height ? `${height}px` : "auto",
    top: `${top || 0}px`,
    left: `${left || 0}px`
  })
})`
  position: absolute;
  max-height: 600px;
  max-width: 700px;
  margin-right: 0px;
`;
