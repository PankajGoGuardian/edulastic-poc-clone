import styled from 'styled-components';
import { FlexContainer } from '@edulastic/common';
import { greenDark } from '@edulastic/colors';
import { IconLeft } from './IconLeft';
import { IconRight } from './IconRight';
import { IconUp } from './IconUp';
import { IconDown } from './IconDown';

export const FlexWithMargins = styled(FlexContainer)`
  margin-top: ${({ smallSize }) => (smallSize ? -10 : 10)}px;
  margin-right: ${({ smallSize }) => (smallSize ? 5 : 30)}px;
  margin-left: ${({ smallSize }) => (smallSize ? 5 : 30)}px;
  align-self: center;
  & ${IconLeft}:hover, ${IconRight}:hover, ${IconUp}:hover, ${IconDown}:hover {
    color: ${greenDark};
    cursor: pointer;
  }
`;
