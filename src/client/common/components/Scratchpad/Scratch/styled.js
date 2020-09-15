import styled from "styled-components";
import { darkRed } from "@edulastic/colors";

export const ScratchpadContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 500;
`;

export const ZwibblerMain = styled.div`
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  height: ${({ height, hideToolBar }) => (height ? `${height}px` : hideToolBar ? "100%" : "calc(100% - 90px)")};
  border-color: ${({ deleteMode }) => (deleteMode ? darkRed : "#cfcfcf")};
  border: ${({ readOnly }) => (readOnly ? "0px" : "1px solid")};

  &:focus {
    outline: none;
  }

  & .zwibbler-canvas-holder {
    &:focus {
      outline: none;
    }
  }

  & .zwibbler-overlay {
    outline: none !important;
  }
`;
