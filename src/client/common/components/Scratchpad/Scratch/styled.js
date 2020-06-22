import styled from "styled-components";
import { darkRed } from "@edulastic/colors";

export const ScratchpadContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 500;
`;

export const ZwibblerMain = styled.div`
  width: 100%;
  border: 1px solid;
  height: ${({ hideToolBar }) => (hideToolBar ? "100%" : "calc(100% - 90px)")};
  border-color: ${({ deleteMode }) => (deleteMode ? darkRed : "#cfcfcf")};
  border: ${({ readOnly }) => readOnly && "0px"};

  &:focus {
    outline: none;
  }

  & .zwibbler-canvas-holder {
    &:focus {
      outline: none;
    }
  }
`;
