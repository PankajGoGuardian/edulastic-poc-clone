import styled from "styled-components";

import { white, mediumDesktopExactWidth, extraDesktopWidthMax, largeDesktopWidth, themeColor } from "@edulastic/colors";

export const PDFPreviewWrapper = styled.div`
  position: relative;
  height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};
  padding: ${({ minimized }) => (minimized ? "30px 23px 30px 60px" : "30px 23px 30px 10px")};
  overflow-y: auto;
  width: 100%;
  transition: padding 0.2s ease-in;
  pointer-events: ${({ viewMode }) => viewMode && "none"};
  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }
  @media (max-width: ${mediumDesktopExactWidth}) {
    padding: ${({ isToolBarVisible, minimized }) =>
      isToolBarVisible && minimized ? "30px 0px 30px 54px" : "30px 0px 30px 0"};
  }
`;

export const Preview = styled.div`
  width: 99%;
  min-height: 90vh;
  background: ${white};
  position: relative;
  border-radius: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.15);
  @media (max-width: ${largeDesktopWidth}) {
    overflow: auto;
  }
`;

export const ZoomControlCotainer = styled.div`
  position: fixed;
  bottom: 50px;
  margin-left: 15px;
  display: flex;
  flex-direction: column;
`;

export const PDFZoomControl = styled.div`
  background: ${themeColor};
  width: 40px;
  height: 40px;
  font-size: 35px;
  font-weight: bolder;
  border-radius: 50%;
  color: ${white};
  display: flex;
  line-height: 0px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin-bottom: 5px;
`;
