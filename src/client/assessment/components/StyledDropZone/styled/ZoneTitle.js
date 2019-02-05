import styled from 'styled-components';
import { dashBorderColor } from '@edulastic/colors';

export const ZoneTitle = styled.div`
  font-size: ${({ fontSize }) => fontSize || 16}px;
  font-weight: 900;
  text-transform: uppercase;
  color: ${({ color }) => color || dashBorderColor};
`;
