import styled from "styled-components";
import {
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
  desktopWidth,
  mainBgColor
} from "@edulastic/colors";

const MainContentWrapper = styled.div`
  background: ${mainBgColor};
  padding: ${props => props.padding || "30px"};
  width: ${props => props.width || "100%"};
  min-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};

  @media (min-width: ${mediumDesktopExactWidth}) {
    min-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    min-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }
  @media (max-width: ${desktopWidth}) {
    padding: 20px;
  }
`;

export default MainContentWrapper;
