import styled from "styled-components";
import { IconMoveArrows as Icon } from "@edulastic/icons";

export const IconMoveResize = styled(Icon)`
  width: 20px;
  height: 20px;
  fill: ${props => props.theme.widgets.clozeImageDragDrop.iconDrawResizeColor};
  &:hover {
    fill: ${props => props.theme.widgets.clozeImageDragDrop.iconDrawResizeColor};
  }
`;
