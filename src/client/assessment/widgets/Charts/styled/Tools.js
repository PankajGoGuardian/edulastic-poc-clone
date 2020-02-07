import styled from "styled-components";
import { white } from "@edulastic/colors";

export const ToolBtn = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-left: 10px;
  border-radius: 4px;
  width: 60px;
  height: 60px;
  text-transform: capitalize;
  background-color: ${white};
  color: ${props => props.theme.widgets.graphPlacement.buttonActiveLabelStroke};
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.25);
  font-size: ${({ theme }) => theme.size4}px;
  cursor: pointer;
  user-select: none;
  box-shadow: ${({ active }) => (active ? "0 1px 3px 0 rgba(0, 0, 0, 0.25)" : "0 3px 6px 0 rgba(0, 0, 0, 0.25)")};
  &.active {
    background-color: ${props => props.theme.widgets.graphPlacement.buttonActiveLabelStroke};
    color: ${white};
    svg {
      fill: ${white};
      &:hover {
        fill: ${white};
      }
    }
  }
  svg {
    fill: ${props => props.theme.widgets.graphPlacement.buttonActiveLabelStroke};
    &:hover {
      fill: ${props => props.theme.widgets.graphPlacement.buttonActiveLabelStroke};
    }
  }
  &:first-child {
    margin-left: 0px;
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
  font-size: 14px;
  font-weight: 600;
  line-height: 19px;
`;

export const ToolbarContainer = styled.ul`
  display: flex;
  align-items: center;
  min-width: 93px;
  margin: 0;
  margin-left: auto;
  padding: 16px 8px;
  justify-content: ${({ justifyContent }) => justifyContent || "flex-starts"};
`;
