import styled from "styled-components";
import {
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
  mainBgColor,
  mobileWidthLarge,
  smallDesktopWidth
} from "@edulastic/colors";

const MainContentWrapper = styled.div`
  overflow: auto;
  background: ${mainBgColor};
  padding: ${props => props.padding || "30px"};
  width: ${props => props.width || "100%"};
  height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }
  @media (max-width: ${smallDesktopWidth}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.sd}px)`};
  }
  @media (max-width: ${mobileWidthLarge}) {
    padding: 20px;
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};
  }
`;

export default MainContentWrapper;
