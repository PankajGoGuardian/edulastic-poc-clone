import styled from "styled-components";
import { IconClose as Icon } from "@edulastic/icons";

export const IconClose = styled(Icon)`
  width: 13px;
  height: 13px;
  fill: ${props => props.theme.widgets.multipleChoice.iconCloseColor};
  :hover {
    fill: ${props => props.theme.widgets.multipleChoice.iconCloseColor};
  }
`;
