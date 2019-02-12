import styled from 'styled-components';
import { IconClose as Icon } from '@edulastic/icons';

export const IconClose = styled(Icon)`
  width: 10px !important;
  height: 10px !important;
  fill: ${props => props.theme.widgets.classification.iconCloseColor}
  :hover {
    fill: ${props => props.theme.widgets.classification.iconCloseColor}
  }
`;
