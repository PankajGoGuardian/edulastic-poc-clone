import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { Button } from "antd";
import {
  white,
  greenDark5,
  secondaryTextColor,
  mediumDesktopExactWidth,
  extraDesktopWidthMax
} from "@edulastic/colors";

const toolBoxDimension = {
  width: "40px",
  height: "511px"
};

export const ToolBox = styled(FlexContainer)`
  width: ${toolBoxDimension.width};
  min-height: ${toolBoxDimension.height};
  position: ${props => (props.isWorksheet ? "absolute" : "fixed")};
  background: transparent;
  z-index: 1000;
  border-radius: 4px;
  padding: 0;
  display: ${props => (props.review && !props.testMode ? "none" : "")};
  top: ${props => (props.testMode ? "100" : props.theme.HeaderHeight.xs + 30)}px;
  left: ${props => (props.isWorksheet ? 12 : 0)}px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    top: ${props => (props.testMode ? "100" : props.theme.HeaderHeight.md + 30)}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    top: ${props => (props.testMode ? "100" : props.theme.HeaderHeight.xl + 30)}px;
  }
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 11px;
  color: ${white};
  margin-bottom: 4px;
  text-align: center;
  white-space: nowrap;
`;

export const StyledButton = styled(Button).attrs({ className: "drawing-tool-button" })`
  margin-bottom: 8px;
  box-shadow: none !important;
  background: ${props => props.theme.default.sideToolbarBgColor};
  height: 40px;
  width: 40px;
  position: relative;
  border: none !important;

  &:active,
  &:focus,
  &:hover {
    background: ${props => props.theme.default.sideToolbarBgColor};
    & svg {
      fill: ${greenDark5};
    }
  }

  &:last-child {
    margin-bottom: 0px;
  }

  & svg {
    fill: ${({ active }) => (active ? greenDark5 : null)};
    &:hover {
      fill: ${({ active }) => (active ? greenDark5 : null)};
    }
  }
`;

export const Separate = styled.div`
  width: 90%;
  opacity: 0.4;
  border-bottom: 1px solid ${secondaryTextColor};
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
`;

export const customizeIcon = icon => styled(icon)`
  fill: ${white};
  width: 19px;
  height: 19px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &:hover {
    fill: ${white};
  }
`;

export const ActiveToolBoxContainer = styled(FlexContainer)`
  border-radius: 4px;
  width: ${toolBoxDimension.width};
  min-height: ${toolBoxDimension.height};
  background: ${props => props.theme.default.sideToolbarBgColor};
  ${({ style }) => style};
  & .drawing-tool-button {
    margin: 0px;
  }
`;

export const Block = styled.div`
  margin-bottom: 4px;
`;

export const ExpandWrapper = styled.div`
  display: flex;
  min-height: auto !important;
  position: absolute;
  left: 0;
  bottom: -48px;
  ${({ style }) => style};
  button {
    margin-right: 8px;
  }
  .scratchpad-action-tools {
    flex-direction: row;
  }
`;
