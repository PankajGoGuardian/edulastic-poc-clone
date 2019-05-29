import styled from "styled-components";
import { IconClose } from "@edulastic/icons";

export const WrongIcon = styled(IconClose)`
  width: 12px;
  height: 12px;
  fill: ${props => props.theme.widgets.clozeDropDown.wrongIconColor};
  &:hover {
    fill: ${props => props.theme.widgets.clozeDropDown.wrongIconColor};
  }
`;
