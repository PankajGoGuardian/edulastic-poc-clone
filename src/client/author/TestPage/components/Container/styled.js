import styled from "styled-components";
import { desktopWidth, mediumDesktopExactWidth, extraDesktopWidthMax } from "@edulastic/colors";

export const Content = styled.div`
  width: 100%;
  left: 0;
  right: 0;
  height: ${props =>
    `calc(100vh - ${props.theme.HeaderHeight.xs + 23}px)`}; // HeaderHeight(62)+23 is the top offset for container
  overflow: ${({ hideOverflow }) => (hideOverflow ? "hidden" : "auto")};

  @media (max-width: ${desktopWidth}) {
    height: calc(100vh - 120px);
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }
`;
