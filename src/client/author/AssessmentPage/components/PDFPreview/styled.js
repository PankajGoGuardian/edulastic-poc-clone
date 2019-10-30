import styled from "styled-components";

import {
  white,
  mediumDesktopWidth,
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
  largeDesktopWidth
} from "@edulastic/colors";

export const PDFPreviewWrapper = styled.div`
  position: relative;
  height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};
  padding: ${({ isToolBarVisible }) => (isToolBarVisible ? "30px 23px 30px 100px" : "30px 23px 30px 30px")};
  overflow-y: auto;
  width: 100%;
  transition: padding 0.2s ease-in;
  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }
  @media (max-width: ${mediumDesktopWidth}) {
    padding: ${({ isToolBarVisible }) => (isToolBarVisible ? "30px 0px 30px 54px" : "30px 0px 30px 0")};
  }
`;

export const Preview = styled.div`
  width: 99%;
  min-height: 90vh;
  background: ${white};
  position: relative;
  border-radius: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  @media (max-width: ${largeDesktopWidth}) {
    overflow: auto;
  }
`;
