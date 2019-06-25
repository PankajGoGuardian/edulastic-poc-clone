import styled from "styled-components";

export const TemplateCover = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  width: ${({ width }) => (!width ? `${width}px` : "auto")};
  min-height: 350px;
  min-width: 100px;
  height: ${({ height }) => (!height ? null : `${height}px`)};
`;
