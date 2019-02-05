import styled from 'styled-components';
import { red } from '@edulastic/colors';

export const Circle = styled.circle`
  stroke: ${({ stroke, intersect }) => (stroke && intersect ? red : stroke)};
  stroke-width: 1px;
  stroke-opacity: 1;
  stroke-dasharray: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: ${({ fill, intersect }) => (fill && intersect ? red : fill)};
  fill-opacity: 1;
  z-index: ${({ intersect }) => (intersect ? 12 : 10)};
  cursor: ${({ cursor }) => cursor || 'normal'};
`;
