import styled from "styled-components";
import { desktopWidth, mediumDesktopExactWidth, extraDesktopWidthMax, smallDesktopWidth } from "@edulastic/colors";

export const Content = styled.div`
  width: 100%;
  left: 0;
  right: 0;
  height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};
  overflow: ${({ hideOverflow }) => (hideOverflow ? "hidden" : "auto")};

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }
  @media (max-width: ${smallDesktopWidth}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.sd}px)`};
  }
  @media (max-width: ${desktopWidth}) {
    height: calc(100vh - 120px);
  }
`;
