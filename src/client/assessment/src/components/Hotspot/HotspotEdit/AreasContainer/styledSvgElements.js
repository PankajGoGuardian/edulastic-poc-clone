import styled from 'styled-components';
import Color from 'color';

import { red, white, svgMapFillColor, svgMapStrokeColor, lightRed } from '@edulastic/colors';

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

export const Polyline = styled.polyline`
  fill: none;
  stroke: ${({ stroke }) => stroke};
  stroke-width: 2px;
  stroke-opacity: 1;
  stroke-dasharray: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  z-index: -1;
  pointer-events: none;
`;

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

export const Svg = styled.svg`
  cursor: ${({ intersect }) => (intersect ? 'not-allowed' : 'normal')};
`;

export const Rect = styled.rect`
  z-index: 5;
  cursor: inherit;
  fill: ${({ fill }) => fill};
  stroke: ${({ stroke }) => stroke};
  stroke-width: 2px;
  stroke-opacity: 1;
  stroke-dasharray: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill-opacity: 1;
`;

export const G = styled.g`
  z-index: 2;
  pointer-events: none;
`;

export const Text = styled.text`
  z-index: 6;
  cursor: inherit;
  font-family: sans-serif;
  fill: ${white};
  font-weight: 600 !important;
  font-size: 14px;
  opacity: 1;
  text-anchor: start;
  user-select: none;
`;
