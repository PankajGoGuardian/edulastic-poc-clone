import styled from 'styled-components';
import { green } from '@edulastic/colors';
import { IconCarets } from '@edulastic/icons';

const { IconCaretLeft } = IconCarets;

export const IconLeft = styled(IconCaretLeft)`
  color: ${green};
  margin: 0;
  font-size: ${({ smallSize }) => (smallSize ? 10 : 20)}px;
`;
