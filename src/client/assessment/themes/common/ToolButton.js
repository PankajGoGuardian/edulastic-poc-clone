import styled from "styled-components";
import { Button } from "antd";

const ToolButton = styled(Button)`
  width: 40px;
  height: 40px;
  color: ${props => props.theme.default.headerButtonIconActiveColor};
  background-color: ${props => props.theme.default.headerButtonActiveBgColor};
  border: 1px solid ${props => props.theme.default.headerButtonActiveBgColor};
  &:hover {
    background-color: ${props => props.theme.default.headerButtonBgHoverColor};
    border: 1px solid ${props => props.theme.default.headerButtonBgHoverColor};
  }
`;

export default ToolButton;
