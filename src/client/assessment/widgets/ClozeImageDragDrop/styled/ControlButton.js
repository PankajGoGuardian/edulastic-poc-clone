import styled from "styled-components";

export const ControlButton = styled.button`
  height: 32px;
  padding-top: 5px;
  margin-right: 8px;
  white-space: normal;
  border-radius: 4px;
  border: none;
  outline: none;
  display: flex;
  background: ${props => props.theme.widgets.clozeImageDropDown.controlButtonBgColor};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: '${props => props.theme.widgets.clozeImageDropDown.controlButtonFontFamily}';
  font-size: ${props => props.theme.widgets.clozeImageDropDown.controlButtonFontSize};
  font-weight: ${props => props.theme.widgets.clozeImageDropDown.controlButtonFontWeight};
  line-height: 1.36;
  color: ${props => props.theme.widgets.clozeImageDropDown.controlButtonColor};
  cursor: pointer;

  &:not([disabled]) {
    background: ${props => props.theme.widgets.clozeImageDropDown.controlButtonNotDisabledBgColor};
    box-shadow: 0 3px 6px 0 ${props => props.theme.widgets.clozeImageDropDown.controlButtonNotDisabledShadowColor};
  }
`;

export const MoveControlButton = styled(ControlButton)`
  width: 36px;
  height: 36px;
  position: absolute;
  top: ${({ top }) => (top ? `${top - 36}px` : "unset")};
  left: ${({ left }) => (left ? `${left - 36}px` : "unset")};
  bottom: ${({ top }) => (top ? "unset" : "10px")};
  right: ${({ left }) => (left ? "unset" : "10px")};
  cursor: move;
  z-index: 9000;
  margin-right: 0px;

  :after {
    content: "";
    width: 10px;
    height: 10px;
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 2px;
    border-bottom: solid 2px #333;
    border-right: solid 2px #333;
  }
`;
