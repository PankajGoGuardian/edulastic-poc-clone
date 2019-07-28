import styled from "styled-components";
import { IconTrash as Icon } from "@edulastic/icons";

export const IconTrash = styled(Icon)`
  fill: ${props => props.theme.sortableList.iconTrashColor};
  :hover {
    fill: ${props => props.theme.sortableList.iconTrashHoverColor};
  }
  width: 14px;
  height: 16px;
  cursor: pointer;
`;
