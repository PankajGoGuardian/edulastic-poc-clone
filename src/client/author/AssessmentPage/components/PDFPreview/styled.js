import styled from "styled-components";

import { white, mediumDesktopWidth } from "@edulastic/colors";

export const PDFPreviewWrapper = styled.div`
  position: relative;
  height: calc(100vh - 96px);
  padding: 30px 23px 30px 24px;
  overflow-y: auto;
  margin: 0 auto;
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
