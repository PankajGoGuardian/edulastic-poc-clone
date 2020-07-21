import styled from "styled-components";
import { greyThemeLight, themeColorHoverBlue } from "@edulastic/colors";

export const ChoiceItem = styled.div.attrs(() => ({
  className: "draggable_box"
}))`
  padding: 6px;
  min-width: 100px;
  max-width: 400px;
  border: 1px solid ${greyThemeLight};
  border-radius: 4px;
  transform: translate3d(0px, 0px, 0px);
  background-color: ${props => props.theme.widgets.clozeDragDrop.responseBoxBgColor};
  margin-right: 5px;
  margin-bottom: 5px;
  &:hover {
    border: 1px solid ${themeColorHoverBlue};
    background: ${themeColorHoverBlue};
    & * {
      color: white !important;
    }
  }
`;

export const DragHandler = styled.i.attrs(() => ({
  className: "fa fa-arrows-alt"
}))`
  font-size: ${({ theme }) => theme.widgets.clozeDragDrop.draggableIconFontSize};
`;
