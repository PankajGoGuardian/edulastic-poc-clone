import styled from "styled-components";
import { IconTrashAlt as Icon } from "@edulastic/icons";

export const IconTrash = styled(Icon)`
  fill: ${props => props.theme.sortableList.iconTrashColor};
  :hover {
    fill: ${props => props.theme.sortableList.iconTrashHoverColor};
  }
  width: 10px;
  height: 14px;
  cursor: pointer;
  margin: 0px -16px 0px 16px;
`;
