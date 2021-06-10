import styled from 'styled-components'
import { greyThemeLight, themeColorHoverBlue } from '@edulastic/colors'

export const ChoiceItem = styled.div.attrs(({ className }) => ({
  className: className || 'draggable_box',
}))`
  min-width: 100px;
  max-width: 400px;
  border: ${(props) =>
    props.transparentResponses ? 'none' : `1px solid ${greyThemeLight}`};
  border-radius: 4px;
  transform: translate3d(0px, 0px, 0px);
  background-color: ${(props) =>
    props.transparentResponses
      ? 'transparent'
      : props.theme.widgets.clozeDragDrop.responseBoxBgColor};
  &:hover {
    border: 1px solid ${themeColorHoverBlue};
    background: ${themeColorHoverBlue};
    & * {
      color: white !important;
    }
  }
  min-height: 32px;
`

export const DragHandler = styled.i.attrs(() => ({
  className: 'fa fa-arrows-alt',
}))`
  font-size: ${({ theme }) =>
    theme.widgets.clozeDragDrop.draggableIconFontSize};
`
