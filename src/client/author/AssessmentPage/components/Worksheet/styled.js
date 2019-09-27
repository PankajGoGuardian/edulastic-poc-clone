import styled from "styled-components";
import { white, green } from "@edulastic/colors";

export const WorksheetWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 96px);
  overflow: auto;
`;

export const MinimizeButton = styled.div`
  position: absolute;
  z-index: 1;
  left: ${({ minimized }) => (minimized ? "40px" : "210px")};
  width: 32px;
  height: 32px;
  padding: 9px;
  background: ${white};
  border-radius: 5px;
  cursor: pointer;
  transition: left 300ms ease-in-out;

  svg {
    fill: ${green};
    transform: rotate(${({ minimized }) => (minimized ? 0 : "-180deg")});
    transition: transform 300ms ease-in-out;

    &:hover,
    &:active,
    &:focus {
      fill: ${green};
    }
  }
`;
