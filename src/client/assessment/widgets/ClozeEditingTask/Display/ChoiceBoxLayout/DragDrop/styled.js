import styled from "styled-components";

export const DragItemCont = styled.div`
  padding: 12px;
  background-color: ${props => props.theme.widgets.clozeDragDrop.responseContainerBgColor};
  border: ${({ theme }) => `2px solid ${theme.widgets.clozeDragDrop.responseContainerBorderColor}`};
`;

export const Choice = styled.div`
  padding: 6px 12px;
  margin-right: 4px;
  transform: translate3d(0px, 0px, 0px);
  border: ${({ theme }) => `1px solid ${theme.widgets.clozeDragDrop.responseContainerBorderColor}`};
  background-color: ${props => props.theme.widgets.clozeDragDrop.responseBoxBgColor};
`;
