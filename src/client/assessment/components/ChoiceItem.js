import styled from "styled-components";

export const ChoiceItem = styled.div.attrs(() => ({
  className: "draggable_box"
}))`
  padding: 6px;
  min-width: 100px;
  max-width: 400px;
  border: 1px solid #b6b6cc;
  border-radius: 4px;
  transform: translate3d(0px, 0px, 0px);
  background-color: ${props => props.theme.widgets.clozeDragDrop.responseBoxBgColor};
  margin-right: 5px;
  margin-bottom: 5px;
`;

export const DragHandler = styled.i.attrs(() => ({
  className: "fa fa-arrows-alt"
}))`
  font-size: ${({ theme }) => theme.widgets.clozeDragDrop.draggableIconFontSize};
`;
