import styled from 'styled-components';
import { red } from '@edulastic/colors';

export const Line = styled.line`
  stroke: ${({ stroke, intersect }) => (stroke ? (intersect ? red : stroke) : stroke)};
  stroke-width: 2px;
  stroke-opacity: 1;
  stroke-dasharray: 6, 8;
  stroke-linecap: round;
  stroke-linejoin: round;
  z-index: 0;
  pointer-events: none;
`;
