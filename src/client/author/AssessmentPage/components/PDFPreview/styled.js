import styled from "styled-components";

import { white, mediumDesktopExactWidth, extraDesktopWidthMax, themeColor } from "@edulastic/colors";

export const PDFPreviewWrapper = styled.div`
  position: relative;
  padding-top: ${props => (props.reportMode ? "0px" : "30px")};
  padding-right: 0px;
  padding-left: ${props => (props.minimized ? "54px" : "0px")};
  padding-bottom: ${props => (props.testMode ? "15px" : props.review ? "60px" : "15px")};
  overflow-y: auto;
  width: 100%;
  transition: padding 0.2s ease-in;
  height: ${props =>
    `calc(100vh - ${
      props.testMode ? "70" : props.reportMode ? props.theme.HeaderHeight.xs + 41 : props.theme.HeaderHeight.xs
    }px) - 43px`};
  .scrollbar-container {
    border-radius: 5px;
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props =>
      `calc(100vh - ${
        props.testMode ? "70" : props.reportMode ? props.theme.HeaderHeight.md + 41 : props.theme.HeaderHeight.md
      }px) - 43px`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props =>
      `calc(100vh - ${
        props.testMode ? "70" : props.reportMode ? props.theme.HeaderHeight.xl + 41 : props.theme.HeaderHeight.xl
      }px) - 43px`};
  }
`;

export const Preview = styled.div`
  min-height: 90vh;
  width: 100%;
  background: ${white};
  position: relative;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.15);
  @media (min-width: ${mediumDesktopExactWidth}) {
    width: 99%;
  }
`;

export const ZoomControlCotainer = styled.div`
  position: fixed;
  bottom: 70px;
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
