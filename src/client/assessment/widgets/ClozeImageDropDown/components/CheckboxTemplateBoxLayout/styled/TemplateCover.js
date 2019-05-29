import styled from "styled-components";

export const TemplateCover = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  min-height: 350px;
  margin: auto;
  max-width: 100%;
`;
