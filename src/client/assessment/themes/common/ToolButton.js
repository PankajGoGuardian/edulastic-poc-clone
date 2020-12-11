import styled from 'styled-components'
import Button from "antd/es/Button";

const ToolButton = styled(Button)`
  height: ${(props) => props.theme.default.headerToolbarButtonWidth};
  width: ${(props) => props.theme.default.headerToolbarButtonHeight};
  background-color: ${(props) =>
    props.skin
      ? props.theme.default.headerButtonActiveBgColor
      : props.theme.widgets.assessmentPlayers.controlBtnSecondaryColor};
  border: 1px solid ${(props) => props.theme.default.headerButtonActiveBgColor};
  margin-left: 10px;

  &:hover,
  &:focus,
  &:active {
    color: ${(props) => props.theme.header.headerButtonHoverColor};
    background-color: ${(props) =>
      props.skin
        ? props.theme.default.headerButtonBgHoverColor
        : props.theme.widgets.assessmentPlayers.controlBtnSecondaryColor};
    border: none;

    i {
      color: ${(props) => props.theme.header.headerButtonHoverColor};
    }
  }
`

export default ToolButton
