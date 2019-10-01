import styled from "styled-components";
import { greenDark, secondaryTextColor, white } from "@edulastic/colors";

export const ToolBtn = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 93px;
  height: 84px;
  background-color: transparent;
  color: ${secondaryTextColor};
  cursor: pointer;
  display: inline-block;
  line-height: 1.5em;
  transition: background-color 0.1s ease-in;
  user-select: none;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0);

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
  & > svg {
    color: ${props => props.theme.widgets.chart.labelStrokeColor};
    fill: ${props => props.theme.widgets.chart.labelStrokeColor};
    stroke: ${props => props.theme.widgets.chart.labelStrokeColor};
  }
`;

export const ToolbarItem = styled.div`
  width: 100%;
  height: 84px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ToolbarItemLabel = styled.span`
  color: ${props =>
    props.theme.widgets.chart.labelStrokeColor || (props.color ? props.color : `${secondaryTextColor}`)};
  font-size: 14px;
  font-weight: 600;
  line-height: 19px;
`;

export const ToolbarRight = styled.ul`
  display: flex;
  align-items: center;
  min-width: 93px;
  margin: 0;
  margin-left: auto;
  padding: 0;
`;
