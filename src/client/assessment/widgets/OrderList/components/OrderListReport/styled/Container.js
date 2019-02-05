import styled from 'styled-components';
import {
  red,
  green,
  lightGreen,
  lightRed
} from '@edulastic/colors';

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  margin-bottom: 10px;
  background: ${({ correct }) => (correct ? lightGreen : lightRed)};
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-left: 2px solid ${({ correct }) => (correct ? green : red)};
`;
