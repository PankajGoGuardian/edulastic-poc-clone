import styled from "styled-components";
import { white } from "@edulastic/colors";

export const ToolBtn = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-left: 5px;
  border-radius: 4px;
  width: 60px;
  height: 50px;
  text-transform: capitalize;
  background-color: ${white};
  color: ${props => props.theme.widgets.graphPlacement.buttonActiveLabelStroke};
  border: 1px solid #878a91;
  font-size: ${({ theme }) => theme.size4}px;
  cursor: pointer;
  user-select: none;
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
  margin-bottom: 4px;
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
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
`;

export const ToolbarContainer = styled.ul`
  display: flex;
  align-items: center;
  min-width: 93px;
  margin: 0;
  margin-left: auto;
  padding: 16px 0px;
  justify-content: ${({ justifyContent }) => justifyContent || "flex-starts"};
`;
