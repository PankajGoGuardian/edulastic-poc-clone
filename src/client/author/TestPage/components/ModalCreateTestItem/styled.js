import styled from "styled-components";

import { mainBgColor } from "@edulastic/colors";

export const FullScreenModal = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 100px;
  right: 0;
  background: ${mainBgColor};
  z-index: 10001;
  overflow: scroll;

  .fixed-header {
    left: 100px !important;
  }
`;

export const ModalWrapper = styled.div`
  position: relative;
  height: 100vh;
`;
