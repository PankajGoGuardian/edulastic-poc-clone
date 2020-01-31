import styled from "styled-components";

export const StyledPreviewImage = styled.div`
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  height: ${({ height }) => (!height ? "auto" : `${height}px`)};
  user-select: none;
  pointer-events: none;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url(${({ imageSrc }) => imageSrc || ""});
`;
