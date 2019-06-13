import styled from "styled-components";

const SVG = styled("svg")`
  width: ${({ width = 15 }) => width}px;
  height: ${({ height = 15 }) => height}px;
  fill: ${({ color = "#000" }) => (color === "#1774F0" ? color + " !important" : color)};
  left: ${({ left }) => left}px;
  stroke: ${({ stroke }) => (stroke === "#1774F0" ? stroke + " !important" : stroke)};
  background: ${({ backgroundColor }) => backgroundColor};

  :hover {
    fill: ${({ hoverColor }) => hoverColor};
  }
`;

export default SVG;
