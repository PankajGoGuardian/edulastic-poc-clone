import styled from "styled-components";
import { IconCheck } from "@edulastic/icons";

export const RightIcon = styled(IconCheck)`
  width: 12px;
  height: 12px;
  fill: ${props => props.theme.widgets.clozeDropDown.rightIconColor};
  &:hover {
    fill: ${props => props.theme.widgets.clozeDropDown.rightIconColor};
  }
`;
