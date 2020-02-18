import styled from "styled-components";

export const StyledResponseDiv = styled.div`
  background-color: ${props => props.theme.widgets.clozeDragDrop.responseContainerBgColor};
  border: ${({ theme }) => `1px solid ${theme.widgets.clozeDragDrop.responseContainerBorderColor}`};
`;

export const StyledResponseOption = styled.div`
  background-color: ${props => props.theme.widgets.clozeDragDrop.responseBoxBgColor};
  border: 1px solid;
`;
