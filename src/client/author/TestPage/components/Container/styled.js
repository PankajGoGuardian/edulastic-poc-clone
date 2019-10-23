import styled from "styled-components";
import { mediumDesktopExactWidth, extraDesktopWidthMax } from "@edulastic/colors";

export const Content = styled.div`
  width: 100%;
  left: 0;
  right: 0;
  height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }
`;
