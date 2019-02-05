import styled from 'styled-components';
import { secondaryTextColor } from '@edulastic/colors';

export const Title = styled.p`
  text-align: center;
  width: 100%;
  font-weight: 600;
  margin-bottom: ${({ smallSize }) => (smallSize ? 5 : 15)}px;
  font-size: 13px;
  color: ${secondaryTextColor};
  text-transform: uppercase;
`;
