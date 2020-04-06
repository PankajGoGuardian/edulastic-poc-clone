import styled from "styled-components";
import { themeColor } from "@edulastic/colors";

const SVG = styled("svg")`
  width: ${({ width = 15 }) => width}px;
  min-width: ${({ width = 15 }) => width}px;
  height: ${({ height = 15 }) => height}px;
  fill: ${({ color = "#000" }) => (color === themeColor ? `${color} !important` : color)};
  left: ${({ left }) => left}px;
  stroke: ${({ stroke }) => (stroke === themeColor ? `${stroke} !important` : stroke)};
  background: ${({ backgroundColor }) => backgroundColor};
  margin: ${({ margin }) => margin};

  :hover {
    fill: ${({ hoverColor }) => hoverColor};
  }
`;

export default SVG;
