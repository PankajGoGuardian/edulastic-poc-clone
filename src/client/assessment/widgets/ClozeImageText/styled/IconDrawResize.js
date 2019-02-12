import styled from 'styled-components';
import { IconDrawResize as Icon } from '@edulastic/icons';

export const IconDrawResize = styled(Icon)`
  width: 20px !important;
  height: 20px !important;
  fill: ${props => props.theme.widgets.clozeImageText.iconDrawResizeColor}
  :hover {
    fill: ${props => props.theme.widgets.clozeImageText.iconDrawResizeColor}
  }
`;
