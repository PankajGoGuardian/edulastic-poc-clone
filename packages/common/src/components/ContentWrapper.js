import styled from "styled-components";
import { mobileWidth, mediumDesktopExactWidth, extraDesktopWidthMax, desktopWidth } from "@edulastic/colors";

const ContentWrapper = styled.div`
  width: 100%;
  left: 0;
  right: 0;
  padding: 0px 30px 30px;
  overflow: auto;

  @media (min-width: ${mediumDesktopExactWidth}) {
    /** 50px is height of BreadCrumbBar and 5px is height of scrollbar(horizontal) */
    height: ${({ theme }) => `calc(100vh - ${theme.HeaderHeight.md + 55}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    /** 50px is height of BreadCrumbBar and 5px is height of scrollbar(horizontal) */
    height: ${({ theme }) => `calc(100vh - ${theme.HeaderHeight.xl + 55}px)`};
  }
  @media (max-width: ${desktopWidth}) {
    /** 155px is height of BreadCrumbBar and Header and 5px is height of scrollbar(horizontal) */
    height: calc(100vh - 160px);
  }

  height: calc(100vh - 115px);

  @media (max-width: ${mobileWidth}) {
    padding: 0px 25px;
  }
`;

export default ContentWrapper;
