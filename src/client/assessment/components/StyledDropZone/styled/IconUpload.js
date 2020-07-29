import styled from "styled-components";
import { IconUpload as Icon } from "@edulastic/icons";

export const IconUpload = styled(Icon)`
  margin-bottom: 12px;
  width: 35px;
  height: 30px;
  fill: ${({ theme, isDragActive }) =>
    isDragActive ? theme.styledDropZone.iconUploadDragActiveColor : theme.styledDropZone.iconUploadColor};
  :hover {
    fill: ${({ theme, isDragActive }) =>
      isDragActive ? theme.styledDropZone.iconUploadDragActiveColor : theme.styledDropZone.iconUploadColor};
  }
`;
