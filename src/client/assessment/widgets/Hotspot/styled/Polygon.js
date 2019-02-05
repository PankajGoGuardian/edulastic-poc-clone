import styled from 'styled-components';
import Color from 'color';

import { red, svgMapFillColor, svgMapStrokeColor, lightRed } from '@edulastic/colors';

const getStroke = ({ stroke, selected, showAnswer, correct }) =>
  (showAnswer
    ? correct
      ? svgMapStrokeColor
      : red
    : selected
      ? Color(stroke)
        .darken(0.3)
        .string()
      : stroke);

const getFill = ({ fill, selected, showAnswer, correct }) =>
  (showAnswer
    ? correct
      ? svgMapFillColor
      : `${lightRed}50`
    : selected
      ? Color(fill)
        .darken(0.3)
        .string()
      : fill);

export const Polygon = styled.polygon`
  fill: ${getFill};
  stroke: ${getStroke};
  stroke-width: ${({ selected }) => (selected ? 4 : 2)}px;
  stroke-opacity: 1;
  stroke-dasharray: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  z-index: ${({ active }) => (active ? 11 : 0)};
  cursor: ${({ intersect }) => (intersect ? 'not-allowed' : 'pointer')};
`;
