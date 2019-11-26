import styled from "styled-components";
import { mobileWidth, mediumDesktopExactWidth, extraDesktopWidthMax, desktopWidth } from "@edulastic/colors";

const ContentWrapper = styled.div`
  width: 100%;
  left: 0;
  right: 0;
  padding: 0px 30px 30px;
  overflow: auto;

  @media (min-width: ${mediumDesktopExactWidth}) {
    /** 50px is height of BreadCrumbBar */
    height: ${({ theme }) => `calc(100vh - ${theme.HeaderHeight.md + 50}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    /** 50px is height of BreadCrumbBar */
    height: ${({ theme }) => `calc(100vh - ${theme.HeaderHeight.xl + 50}px)`};
  }
  @media (max-width: ${desktopWidth}) {
    /** 155px is height of BreadCrumbBar and Header */
    height: calc(100vh - 155px);
  }

  height: calc(100vh - 110px);

  @media (max-width: ${mobileWidth}) {
    padding: 0px 25px;
  }
`;

export default ContentWrapper;
