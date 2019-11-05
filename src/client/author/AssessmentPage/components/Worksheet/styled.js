import styled from "styled-components";
import { white, green, mediumDesktopExactWidth, extraDesktopWidthMax } from "@edulastic/colors";

export const WorksheetWrapper = styled.div`
  position: relative;
  display: flex;
  height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};
  overflow: auto;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }
`;

export const MinimizeButton = styled.div`
  position: absolute;
  z-index: 1;
  left: ${({ minimized }) => (minimized ? "40px" : "190px")};
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
