import styled from "styled-components";

import { mainBgColor } from "@edulastic/colors";

export const FullScreenModal = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${mainBgColor};
  z-index: 10001;
  overflow: scroll;

  .fixed-header {
    left: 0 !important;
  }
`;

export const ModalWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;
