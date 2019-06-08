import styled from "styled-components";

import { mainBgColor } from "@edulastic/colors";

export const FullScreenModal = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 100px;
  right: 0;
  background: ${mainBgColor};
  overflow: auto;
  z-index: 999;
`;

export const ModalWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;
