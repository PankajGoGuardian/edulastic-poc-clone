import styled from "styled-components";
import { white } from "@edulastic/colors";

export const ColorPickerContainer = styled.div`
  position: absolute;
  z-index: 900;
  padding: 8px 16px;
  background: ${white};
  box-shadow: 0 2px 8px #00000090;
  border-radius: 4px;

  &::before {
    position: absolute;
    content: "";
    border: 7px solid;
    top: -14px;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: white;
    border-left-color: transparent;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 0;
`;
