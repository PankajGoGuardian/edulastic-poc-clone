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
  position: fixed;
  margin-left: ${props => (props.isToolBarVisible ? "-60px" : "0px")};
  background: ${props => props.theme.default.sideToolbarBgColor};
  z-index: 500;
  border-radius: 4px;
  padding: 0;
  display: ${props => (props.review && !props.testMode ? "none" : "")};
  top: ${props => (props.testMode ? "100" : props.theme.HeaderHeight.xs + 30)}px;

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

export const StyledButton = styled(Button)`
  margin-bottom: 4px;
  box-shadow: none !important;
  background: transparent;
  height: 30px;
  width: 30px;
  position: relative;
  border: none !important;

  &:active,
  &:focus,
  &:hover {
    background: ${({ enable, theme }) =>
      enable ? theme.default.headerButtonActiveBgColor : theme.default.headerButtonBgColor};
  }

  &:last-child {
    margin-bottom: 0px;
  }

  & svg {
    fill: ${({ enable }) => (enable ? greenDark5 : null)};
    &:hover {
      fill: ${({ enable }) => (enable ? greenDark5 : null)};
    }
  }

  ${({ separate }) =>
    separate &&
    `&:after {
    display: block;
    content: " ";
    width: 90%;
    opacity: 0.4;
    border-bottom: 1px solid ${secondaryTextColor};
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
  }`}
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
  padding: 5px 0px;
  width: ${toolBoxDimension.width};
  min-height: ${toolBoxDimension.height};
`;

export const Block = styled.div`
  margin-bottom: 4px;
`;
