import styled from "styled-components";
import { IconCheck as Icon } from "@edulastic/icons";

export const IconCheck = styled(Icon)`
  width: 13px;
  height: 10px;
  fill: ${props => props.theme.widgets.multipleChoice.iconCheckColor};
  :hover {
    fill: ${props => props.theme.widgets.multipleChoice.iconCheckColor};
  }
`;
