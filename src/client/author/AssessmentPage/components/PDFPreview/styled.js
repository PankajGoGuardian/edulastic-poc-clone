import styled from "styled-components";

import { white } from "@edulastic/colors";

export const PDFPreviewWrapper = styled.div`
  position: relative;
  height: calc(100vh - 96px);
  padding: 30px 23px 30px 24px;
  overflow-y: auto;
  margin: 0 auto;
`;

export const Preview = styled.div`
  min-width: 600px;
  min-height: 700px;
  background: ${white};
  position: relative;
`;
