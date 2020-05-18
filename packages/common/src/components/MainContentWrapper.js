import styled from "styled-components";
import { mediumDesktopExactWidth, extraDesktopWidthMax, desktopWidth, mainBgColor } from "@edulastic/colors";

// breadcrumb bar height + padding of content
const breadcrumbHeight = 92;

const MainContentWrapper = styled.div`
  background: ${mainBgColor};
  padding: ${props => props.padding || "20px 30px"};
  padding-top: ${({ mode }) => (mode === "embedded" ? "0px" : "")};
  width: ${props => props.width || "100%"};
  min-height: ${props =>
    `calc(100vh - ${props.theme.HeaderHeight.xs + (props.mode === "embedded" ? breadcrumbHeight : 0)}px)`};

  @media (min-width: ${mediumDesktopExactWidth}) {
    min-height: ${props =>
      `calc(100vh - ${props.theme.HeaderHeight.md + (props.mode === "embedded" ? breadcrumbHeight : 0)}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    min-height: ${props =>
      `calc(100vh - ${props.theme.HeaderHeight.xl + (props.mode === "embedded" ? breadcrumbHeight : 0)}px)`};
  }

  @media (max-width: ${desktopWidth}) {
    padding: 20px;
    min-height: ${props =>
      `calc(100vh - ${props.mobileHeaderHeight + (props.mode === "embedded" ? breadcrumbHeight : 0)}px)`};
    padding-top: ${({ mode }) => (mode === "embedded" ? "0px" : "")};
  }
`;

export default MainContentWrapper;
