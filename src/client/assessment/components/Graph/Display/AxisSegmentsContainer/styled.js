import styled from "styled-components";
import { svgDisabledColor, extraDesktopWidth } from "@edulastic/colors";

export const GraphToolbar = styled.div`
  box-sizing: border-box;
  position: relative;
  width: ${({ vertical }) => (vertical ? "93px" : "100%")};
  display: flex;
  flex-direction: ${({ vertical }) => (vertical ? "column" : "row")};
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 65px;
  padding: 0;
  border-radius: 4px;
  background-color: ${props => props.theme.widgets.graphPlacement.toolbarBgColor};
  font-size: ${props => (props.fontSize ? props.fontSize : 14)}px;
  margin-right: ${({ vertical }) => (vertical ? "8px" : "")};
  margin: ${({ vertical }) => (vertical ? "" : "16px 0px")};

  .toolbar-compact & {
    max-width: 700px;
    flex-flow: row wrap;
  }

  ul {
    list-style: none;
  }

  ul li {
    margin: 2px 1px 0 0;
  }
`;

export const SegmentsToolbarItem = styled.div`
  width: 100%;
  height: 65px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ToolbarItemIcon = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  width: auto;
  height: auto;
  min-width: 23px;
  min-height: 24px;
  margin-bottom: 5px;
`;

export const SegmentsToolBtn = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 89px;
  height: 65px;
  background-color: transparent;
  color: ${props => props.theme.widgets.graphPlacement.buttonLabelStroke};
  cursor: pointer;
  display: inline-block;
  line-height: 1.5em;
  transition: background-color 0.1s ease-in;
  user-select: none;
  margin-right: ${({ zoomLevel }) => (zoomLevel > "1" ? `1rem` : "0.2rem")};

  @media screen and (min-width: ${extraDesktopWidth}) {
    margin-right: ${({ zoomLevel }) => zoomLevel > "1" && `0.5rem`};
  }

  &.disabled {
    .dd-header-title svg {
      color: ${svgDisabledColor};
      stroke: ${svgDisabledColor};
      fill: ${svgDisabledColor};
    }

    .tool-btn-icon svg {
      color: ${svgDisabledColor};
      stroke: ${svgDisabledColor};
      fill: ${svgDisabledColor};
    }

    svg {
      color: ${svgDisabledColor};
      stroke: ${svgDisabledColor};
      fill: ${svgDisabledColor};
    }
  }

  &.disabled {
    .dd-header-title svg {
      color: ${svgDisabledColor};
      stroke: ${svgDisabledColor};
      fill: ${svgDisabledColor};
    }

    .tool-btn-icon svg {
      color: ${svgDisabledColor};
      stroke: ${svgDisabledColor};
      fill: ${svgDisabledColor};
    }

    svg {
      color: ${svgDisabledColor};
      stroke: ${svgDisabledColor};
      fill: ${svgDisabledColor};
    }
  }

  svg {
    stroke: ${props => props.theme.widgets.graphPlacement.buttonIconColor};
    fill: ${props => props.theme.widgets.graphPlacement.buttonIconColor};
  }

  &.active {
    .dd-header-title svg {
      color: ${props => props.theme.widgets.graphPlacement.buttonActiveLabelStroke};
      stroke: ${props => props.theme.widgets.graphPlacement.buttonActiveLabelStroke};
      fill: ${props => props.theme.widgets.graphPlacement.buttonActiveLabelStroke};
    }

    .tool-btn-icon svg {
      stroke: ${props => props.theme.widgets.graphPlacement.buttonActiveIconColor};
      fill: ${props => props.theme.widgets.graphPlacement.buttonActiveIconColor};
    }
  }
`;

export const GraphWrapper = styled.div`
  width: ${props => (props.width ? `${props.width}px` : "100%")};
  border-radius: 4px;
  border: ${props => (props.border ? 1 : 0)}px solid ${props => props.borderColor};
  zoom: ${props => props.theme.widgets.chart.chartZoom};

  ${({ vertical }) =>
    vertical &&
    `display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;`}
`;

export const JSXBox = styled.div`
  background-color: ${props => props.theme.widgets.chart.bgColor} !important;
  position: relative;
  overflow: hidden;

  border: 0px solid #e8e8e8;
  border-radius: 0;
  border-color: ${props => props.theme.widgets.chart.axisBorderColor} !important;
  margin: ${props => (props.margin ? props.margin : 0)}px;

  div {
    color: ${props => props.theme.widgets.chart.labelStrokeColor} !important;
    background-color: ${props => props.theme.widgets.chart.bgColor} !important;
  }
`;
