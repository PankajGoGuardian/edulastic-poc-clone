import styled from 'styled-components';
import { IconClose } from '@edulastic/icons';

export const WrongIcon = styled(IconClose)`
  width: 8px !important;
  height: 8px !important;
  
  fill: ${props => props.theme.widgets.clozeImageDragDrop.wrongIconColor};
  &:hover {
    fill: ${props => props.theme.widgets.clozeImageDragDrop.wrongIconColor};
  }
`;
