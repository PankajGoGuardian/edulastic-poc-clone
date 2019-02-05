import styled from 'styled-components';
import { green } from '@edulastic/colors';
import { IconCarets } from '@edulastic/icons';

const { IconCaretDown } = IconCarets;

export const IconDown = styled(IconCaretDown)`
  color: ${green};
  margin: 0;
  font-size: ${({ smallSize }) => (smallSize ? 10 : 20)}px;
`;
