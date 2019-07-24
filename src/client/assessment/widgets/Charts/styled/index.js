import styled from "styled-components";

import { dashBorderColor, themeColorLight, darkBlue } from "@edulastic/colors";
import { IconTrash as Icon } from "@edulastic/icons";

export const Line = styled.line`
  shape-rendering: crispEdges;
  stroke: ${dashBorderColor};
  stroke-width: ${({ strokeWidth }) => strokeWidth};
`;

export const Circle = styled.circle`
  cursor: pointer;
  position: relative;
  z-index: 10;
  stroke: ${themeColorLight};
  fill: ${themeColorLight};
`;

export const Bar = styled.rect`
  cursor: pointer;
  z-index: 0;
  stroke: ${({ color }) => color || themeColorLight};
  fill: ${({ color }) => color || themeColorLight};
  transition: fill 0.25s linear;
`;

const getRightColor = (hoverState, color) => (hoverState ? darkBlue : color || themeColorLight);

export const ActiveBar = styled.rect`
  cursor: pointer;
  z-index: 10;
  stroke: ${({ hoverState, color }) => getRightColor(hoverState, color)};
  fill: ${({ hoverState, color }) => getRightColor(hoverState, color)};
  transition: fill 0.25s linear;
`;

export const StrokedRect = styled.rect`
  z-index: 1;
  stroke: ${({ hoverState }) => (hoverState ? "black" : "none")};
  stroke-width: 2;
  stroke-dasharray: 10 5;
  fill: none;
`;

export const Text = styled.text`
  user-select: none;
`;

export const Sub = styled.tspan`
  font-size: 80%;
`;

export const Sup = styled.tspan`
  font-size: 80%;
`;

export const Group = styled.g`
  background: ${({ active }) => (active === null ? "transparent" : "black")};
  z-index: 1;
`;

export const IconTrash = styled(Icon)`
  fill: ${props => props.theme.sortableList.iconTrashColor};
  :hover {
    fill: ${props => props.theme.sortableList.iconTrashHoverColor};
  }
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export const Cross = styled.path`
  stroke: ${themeColorLight};
  fill: ${themeColorLight};
  stroke-width: 4;
`;

export const ValueBg = styled.rect`
  fill: ${props => props.theme.widgets.chart.bgColor};
  stroke: ${props => props.theme.widgets.chart.labelStrokeColor};
  height: 24px;
  rx: 4px;
  ry: 4px;
`;
