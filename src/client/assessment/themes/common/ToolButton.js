import styled from "styled-components";
import { Button } from "antd";

const ToolButton = styled(Button)`
  width: 40px;
  height: 40px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  background-color: ${props =>
    props.skin
      ? props.theme.default.headerButtonActiveBgColor
      : props.theme.widgets.assessmentPlayers.controlBtnSecondaryColor};
  border: 1px solid ${props => props.theme.default.headerButtonActiveBgColor};
  &:hover {
    background: ${props => props.theme.default.headerButtonBgHoverColor};
  }
  &:focus,
  &:active {
    color: ${props => props.theme.default.headerButtonIconActiveColor};
    background-color: ${props =>
      props.skin
        ? props.theme.default.headerButtonActiveBgColor
        : props.theme.widgets.assessmentPlayers.controlBtnSecondaryColor};
    border: none;
  }
`;

export default ToolButton;
