import styled from 'styled-components';
import { white, green, red } from '@edulastic/colors';

export const Index = styled.div`
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  background: ${({ correct }) => (correct ? green : red)};
  color: ${white};
  font-weight: 600;
  font-size: 14px;
`;
