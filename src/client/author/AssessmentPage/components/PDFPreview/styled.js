import styled from "styled-components";

import { white, mediumDesktopWidth, mediumDesktopExactWidth, extraDesktopWidthMax } from "@edulastic/colors";

export const PDFPreviewWrapper = styled.div`
  position: relative;
  height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};
  padding: 30px 23px 30px 24px;
  overflow-y: auto;
  margin: 0 auto;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }
  @media (max-width: ${mediumDesktopWidth}) {
    padding: 30px 0px 30px 54px;
  }
`;

export const Preview = styled.div`
  min-width: 600px;
  min-height: 700px;
  background: ${white};
  position: relative;
`;
