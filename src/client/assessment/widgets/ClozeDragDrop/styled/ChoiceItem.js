import styled from "styled-components";

export const ChoiceItem = styled.div.attrs(() => ({
  className: "draggable_box"
}))`
  padding: 6px;
  min-width: 100px;
  max-width: 400px;
  border: 1px solid;
  transform: translate3d(0px, 0px, 0px);
  background-color: ${props => props.theme.widgets.clozeDragDrop.responseBoxBgColor};
`;
