import styled from 'styled-components';
import { green } from '@edulastic/colors';
import { IconCarets } from '@edulastic/icons';

const { IconCaretUp } = IconCarets;

export const IconUp = styled(IconCaretUp)`
  color: ${green};
  margin: 0;
  font-size: ${({ smallSize }) => (smallSize ? 10 : 20)}px;
`;
