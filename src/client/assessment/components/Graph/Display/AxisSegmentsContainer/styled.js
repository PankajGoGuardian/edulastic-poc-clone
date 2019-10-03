import styled from "styled-components";
import { greenDark, secondaryTextColor, svgDisabledColor, white } from "@edulastic/colors";

export const GraphToolbar = styled.div`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 65px;
  padding: 0;
  background-color: #efefef;
  font-size: ${props => (props.fontSize ? props.fontSize : 14)}px;

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
  color: ${secondaryTextColor};
  cursor: pointer;
  display: inline-block;
  line-height: 1.5em;
  transition: background-color 0.1s ease-in;
  user-select: none;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0);

  &.disabled {
    background-color: rgba(0, 0, 0, 0.15);

    &:hover {
      background-color: rgba(0, 0, 0, 0.15);
    }

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
    background-color: rgba(0, 0, 0, 0.15);

    &:hover {
      background-color: rgba(0, 0, 0, 0.15);
    }

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
    color: ${secondaryTextColor};
    stroke: ${secondaryTextColor};
    fill: ${secondaryTextColor};
  }

  &:hover {
    background-color: ${white};
  }

  &:active {
    background-color: ${white};
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.06);
  }

  &.active {
    background-color: ${white};
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.06);

    .dd-header-title svg {
      color: ${greenDark};
      stroke: ${greenDark};
      fill: ${greenDark};
    }

    .tool-btn-icon svg {
      color: ${greenDark};
      stroke: ${greenDark};
      fill: ${greenDark};
    }
  }
`;

export const GraphWrapper = styled.div`
  width: ${props => (props.width ? `${props.width}px` : "100%")};
  border-radius: 4px;
  border: ${props => (props.border ? 1 : 0)}px solid ${props => props.borderColor};
`;

export const JSXBox = styled.div`
  background-color: ${white};
  position: relative;
  overflow: hidden;

  border: 1px solid #e8e8e8;
  border-radius: 0;
  margin: ${props => (props.margin ? props.margin : 0)}px;
`;
