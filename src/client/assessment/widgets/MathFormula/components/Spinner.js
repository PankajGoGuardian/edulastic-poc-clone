import React from "react";
import { Spin } from "antd";

import styled from "styled-components";
import { lightFadedBlack } from "@edulastic/colors";

export default () => (
  <SpinnerContainer>
    <Spin />
  </SpinnerContainer>
);

const SpinnerContainer = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 9999;
  background: ${lightFadedBlack};
`;
