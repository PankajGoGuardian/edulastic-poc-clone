import styled from "styled-components";

export const StyledResponseDiv = styled.div`
  background-color: ${props => props.theme.widgets.clozeDragDrop.responseContainerBgColor};
  // border: 2px dashed ${props => props.theme.widgets.clozeDragDrop.responseContainerBorderColor};
`;

export const StyledResponseOption = styled.div`
  background-color: ${props => props.theme.widgets.clozeDragDrop.responseContainerBgColor};
  border: 1px solid;
  .katex {
    .base {
      white-space: unset;
      width: auto;
    }
  }
`;
