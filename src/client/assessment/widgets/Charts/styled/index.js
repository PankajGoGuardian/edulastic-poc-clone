import styled from "styled-components";
import { Text as vxText } from "@vx/text";

import { themeColor, darkBlue, red, greyThemeDark2 } from "@edulastic/colors";
import { IconTrash as Icon } from "@edulastic/icons";

export const Line = styled.line`
  shape-rendering: crispEdges;
  stroke: ${props => props.theme.widgets.chart.gridColor};
  stroke-width: ${({ strokeWidth }) => strokeWidth};
  fill: none;
`;

export const Axis = styled(Line)`
  stroke: ${themeColor};
  stroke-width: 3px;
`;

export const Tick = styled(Line)`
  stroke: ${props => props.theme.widgets.chart.tickColor};
`;

export const Circle = styled.circle`
  pointer-events: ${({ interactive }) => (interactive ? "auto" : "none")};
  cursor: pointer;
  position: relative;
  z-index: 10;
  stroke: ${props => props.theme.widgets.chart.stockColor};
  fill: ${props => props.theme.widgets.chart.stockColor};
`;

export const Bar = styled.rect`
  cursor: pointer;
  z-index: 0;
  stroke: ${({ color }) => color || greyThemeDark2};
  fill: ${({ color }) => color || greyThemeDark2};
  transition: fill 0.25s linear;
`;

const getRightColor = (hoverState, color, deleteMode = false) =>
  hoverState ? (deleteMode ? red : darkBlue) : color || greyThemeDark2;

export const ActiveBar = styled.rect`
  cursor: pointer;
  z-index: 10;
  stroke: ${({ hoverState, color, deleteMode }) => getRightColor(hoverState, color, deleteMode)};
  fill: ${({ hoverState, color, deleteMode }) => getRightColor(hoverState, color, deleteMode)};
  transition: fill 0.25s linear;
`;

export const StrokedRect = styled.rect`
  pointer-events: none;
  z-index: 1;
  stroke: ${({ hoverState }) => (hoverState ? "black" : "none")};
  stroke-width: 2;
  stroke-dasharray: 10 5;
  fill: none;
`;

export const Text = styled.text`
  user-select: none;
  font-size: ${({ theme }) => theme.widgets.chart.axisLabelFontSize};
  font-weight: ${props => props.theme.bold};
  text-transform: uppercase;
  fill: ${props => props.theme.widgets.chart.axisLabel};
`;

export const VxText = styled(vxText)`
  user-select: none;
  font-size: ${({ theme }) => theme.widgets.chart.axisLabelFontSize};
  font-weight: ${props => props.theme.bold};
  fill: ${props => props.theme.widgets.chart.axisLabel};
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
  stroke: ${props => props.theme.widgets.chart.stockColor};
  fill: ${props => props.theme.widgets.chart.stockColor};
  stroke-width: 4;
`;

export const ValueBg = styled.rect`
  fill: ${props => props.theme.widgets.chart.bgColor};
  stroke: ${props => props.theme.widgets.chart.labelStrokeColor};
  height: 24px;
  rx: 4px;
  ry: 4px;
`;
