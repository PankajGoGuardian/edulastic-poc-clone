import styled from 'styled-components';
import { IconTrashAlt as Icon } from '@edulastic/icons';

export const IconTrash = styled(Icon)`
  fill: ${props => props.theme.dropArea.iconTrashColor};
  :hover {
    fill: ${props => props.theme.dropArea.iconTrashHoverColor};
  }
`;
