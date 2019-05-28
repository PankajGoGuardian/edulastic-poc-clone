import styled from "styled-components";

export const TemplateCover = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  width: ${props => (props.width ? `${props.width}px` : "auto")};
  min-height: 350px;
  margin: auto;
  min-width: 100px;
  max-width: 100%;
`;
