import styled from 'styled-components';
import { IconTrash as Icon } from '@edulastic/icons';

export const IconTrash = styled(Icon)`
  width: 20px !important;
  height: 20px !important;
  cursor: pointer;
  fill: ${props => props.theme.widgets.classification.iconTrashColor}
  :hover {
    fill: ${props => props.theme.widgets.classification.iconTrashHoverColor}
  }
`;
