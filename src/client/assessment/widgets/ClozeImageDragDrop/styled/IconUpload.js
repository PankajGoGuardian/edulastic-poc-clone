import styled from 'styled-components';
import { IconUpload as Icon } from '@edulastic/icons';

export const IconUpload = styled(Icon)`
  width: 100px !important;
  height: 100px !important;
  fill: ${props => props.theme.widgets.clozeImageDragDrop.iconUploadColor}
  :hover {
    fill: ${props => props.theme.widgets.clozeImageDragDrop.iconUploadColor}
  }
`;
