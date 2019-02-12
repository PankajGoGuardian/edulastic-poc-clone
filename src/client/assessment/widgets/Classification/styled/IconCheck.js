import styled from 'styled-components';
import { IconCheck as Icon } from '@edulastic/icons';

export const IconCheck = styled(Icon)`
  width: 12px !important;
  height: 10px !important;
  fill: ${props => props.theme.widgets.classification.iconCheckColor}
  :hover {
    fill: ${props => props.theme.widgets.classification.iconCheckColor}
  }
`;
