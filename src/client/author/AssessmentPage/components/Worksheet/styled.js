import styled from "styled-components";
import { white, green, mediumDesktopExactWidth, extraDesktopWidthMax, largeDesktopWidth } from "@edulastic/colors";

export const WorksheetWrapper = styled.div`
  position: relative;
  display: flex;
  height: ${props => `calc(100vh - ${props.testMode ? "70" : props.theme.HeaderHeight.xs}px)`};
  justify-content: space-between;
  overflow: auto;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => `calc(100vh - ${props.testMode ? "70" : props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => `calc(100vh - ${props.testMode ? "70" : props.theme.HeaderHeight.xl}px)`};
  }
`;

export const MinimizeButton = styled.div`
  position: absolute;
  z-index: 1;
  left: ${({ minimized }) => (minimized ? "15px" : "auto")};
  right: ${({ minimized }) => (minimized ? "auto" : "0px")};
  top: 31px;
  width: 27px;
  height: 27px;
  background: ${white};
  border-radius: 4px 0px 0px 4px;
  cursor: pointer;
  transition: left 300ms ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${largeDesktopWidth}) {
    left: ${({ minimized }) => (minimized ? "15px" : "256px")};
  }

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
