import styled from 'styled-components';
import { IconUpload as Icon } from '@edulastic/icons';

export const IconUpload = styled(Icon)`
  marginBottom: 20px;
  width: 90px !important;
  height: 75px !important;
  fill: ${({ theme, isDragActive }) => (isDragActive
    ? theme.styledDropZone.iconUploadDragActiveColor
    : theme.styledDropZone.iconUploadColor)}
  :hover {
    fill: ${({ theme, isDragActive }) => (isDragActive
    ? theme.styledDropZone.iconUploadDragActiveColor
    : theme.styledDropZone.iconUploadColor)}
  }
`;
