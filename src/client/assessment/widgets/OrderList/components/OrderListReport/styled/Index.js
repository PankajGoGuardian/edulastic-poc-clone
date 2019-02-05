import styled from 'styled-components';
import { mainTextColor } from '@edulastic/colors';

export const Index = styled.span`
  font-size: 26px;
  margin-right: 50px;
  font-weight: 600;
  color: ${({ color }) => color || mainTextColor};
`;
