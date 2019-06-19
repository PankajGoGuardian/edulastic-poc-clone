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
  background: ${props => props.theme.widgets.clozeImageText.controlButtonBgColor};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: '${props => props.theme.widgets.clozeImageText.controlButtonFontFamily}';
  font-size: ${props => props.theme.widgets.clozeImageText.controlButtonFontSize};
  font-weight: ${props => props.theme.widgets.clozeImageText.controlButtonFontWeight};
  line-height: 1.36;
  color: ${props => props.theme.widgets.clozeImageText.controlButtonColor};
  cursor: pointer;

  &:not([disabled]) {
    background: ${props => props.theme.widgets.clozeImageText.controlButtonNotDisabledBgColor};
    box-shadow: 0 3px 6px 0 ${props => props.theme.widgets.clozeImageText.controlButtonNotDisabledShadowColor};
  }
`;

export const MoveControlButton = styled(ControlButton)`
  width: 36px;
  height: 36px;
  position: absolute;
  top: ${({ top }) => (top ? `${top - 36}px` : "unset")};
  left: ${({ left }) => (left ? `${left - 36}px` : "unset")};
  bottom: ${({ top }) => (top ? "unset" : "0px")};
  right: ${({ left }) => (left ? "unset" : "-7px")};
  cursor: move;
  z-index: 9000;
`;
