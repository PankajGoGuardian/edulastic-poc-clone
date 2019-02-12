import styled from 'styled-components';
import { IconPlus as Icon } from '@edulastic/icons';

export const IconPlus = styled(Icon)`
  width: 10px !important;
  height: 10px !important;
  fill: ${props => props.theme.widgets.clozeImageDragDrop.iconPlusColor}
  :hover {
    fill: ${props => props.theme.widgets.clozeImageDragDrop.iconPlusColor}
  }
`;
