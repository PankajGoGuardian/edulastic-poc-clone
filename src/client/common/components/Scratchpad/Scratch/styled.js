import styled from "styled-components";
import { darkRed } from "@edulastic/colors";

export const ScratchpadContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  /* froalar z-index is 998 */
  /* @see https://snapwiz.atlassian.net/browse/EV-19269 */
  z-index: 1000;
  display: ${({ hideData }) => (hideData ? "none" : "block")};
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
    touch-action: ${({ readOnly }) => readOnly && `unset !important`};
  }

  & .zwibbler-overlay {
    outline: none !important;
  }
`;
