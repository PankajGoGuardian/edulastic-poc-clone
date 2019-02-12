import styled from 'styled-components';
import { IconCheck } from '@edulastic/icons';

export const RightIcon = styled(IconCheck)`
  width: 8px !important;
  height: 8px !important;
  
  fill: ${props => props.theme.widgets.clozeDragDrop.rightIconColor};
  &:hover {
    fill: ${props => props.theme.widgets.clozeDragDrop.rightIconColor};
  }
`;
